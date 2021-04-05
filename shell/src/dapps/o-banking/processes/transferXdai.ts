import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import TextEditor from "../../../../../packages/o-editors/src/TextEditor.svelte";
import {SetTrustContext} from "./setTrust";

export type TransferXdaiContextData = {
  safeAddress:string;
  recipientAddress?:string;
  amount?:string;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type TransferXdaiContext = ProcessContext<TransferXdaiContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: "",
  labelAmount: ""
};

const processDefinition = (processId: string) =>
createMachine<TransferXdaiContext, any>({
  id: `${processId}:transferCircles`,
  initial: "transferCircles",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<TransferXdaiContext, any>("error"),

    recipientAddress: prompt<TransferXdaiContext, any>({
      fieldName: "recipientAddress",
      component: TextEditor,
      params: {
        label: strings.labelRecipientAddress,
      },
      navigation: {
        next: "#amount",
      },
    }),
    amount: prompt<TransferXdaiContext, any>({
      fieldName: "amount",
      component: TextEditor,
      params: {
        label: strings.labelAmount,
      },
      navigation: {
        previous: "#recipientAddress",
        next: "#transferXdai"
      },
    }),
    transferXdai: {
      id: "transferXdai",
      invoke: {
        src: async (context) => {
        },
        onDone: "#success",
        onError: "#error",
      },
    },
    success: {
      id: "success"
    },
  },
});

export const transferXdai: ProcessDefinition<void, TransferXdaiContextData> = {
  name: "transferXdai",
  stateMachine: <any>processDefinition,
};
