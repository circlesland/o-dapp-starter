import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import TextEditor from "../../../../../packages/o-editors/src/TextEditor.svelte";
import CurrencyTransfer from "../../../../../packages/o-editors/src/CurrencyTransfer.svelte";
import {CloseModal} from "@o-platform/o-events/dist/shell/closeModal";
import {CreateOrRestoreKeyContext} from "../../o-passport/processes/createOrRestoreKey";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {transferXdai} from "./transferXdai";
import {transferCircles} from "./transferCircles";
import {Cancel} from "@o-platform/o-process/dist/events/cancel";

export type TransferCirclesContextData = {
  safeAddress:string;
  recipientAddress?:string;
  tokens?:{
    currency: {
      key: string,
      label: string
    },
    amount: string
  };
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type TransferCirclesContext = ProcessContext<TransferCirclesContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: "",
  tokensLabel: "Please enter the amount and the token you want to transfer",
  currencyCircles: "CRC",
  currencyXdai: "xDai"
};

const processDefinition = (processId: string) =>
createMachine<TransferCirclesContext, any>({
  id: `${processId}:transfer`,
  initial: "recipientAddress",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<TransferCirclesContext, any>("error"),

    recipientAddress: prompt<TransferCirclesContext, any>({
      fieldName: "recipientAddress",
      component: TextEditor,
      params: {
        label: strings.labelRecipientAddress,
      },
      navigation: {
        next: "#tokens",
      },
    }),
    tokens: prompt<CreateOrRestoreKeyContext, any>({
      fieldName: "tokens",
      component: CurrencyTransfer,
      params: {
        label: strings.tokensLabel,
        currencies:[{
          key: "crc",
          label: strings.currencyCircles
        },{
          key: "xdai",
          label: strings.currencyXdai
        }]
      },
      navigation: {
        next: "#checkChoice",
      },
    }),
    checkChoice: {
      id: "checkChoice",
      always: [
        {
          cond: (context) => {
            return context.data.tokens.currency.key == "crc"
          },
          target: "callCirclesTransfer",
        },
        {
          cond: (context) => {
            return context.data.tokens.currency.key == "xdai"
          },
          target: "callXdaiTransfer",
        },
      ],
    },
    callCirclesTransfer: {
      id: "callCirclesTransfer",
      on: <any>{
        ...ipc("callCirclesTransfer"),
      },
      invoke: {
        src: transferCircles.stateMachine(`${processId}:transfer:transferCircles`),
        onDone: "#success",
        onError: "#error"
      }
    },
    callXdaiTransfer: {
      id: "callXdaiTransfer",
      on: <any>{
        ...ipc("callXdaiTransfer"),
      },
      invoke: {
        src: transferXdai.stateMachine(`${processId}:transfer:transferXdai`),
        onDone: "#success",
        onError: "#error"
      }
    },
    success: {
      id: "success",
      entry: (context, event) => {
        console.log("transfer - success")
        window.o.publishEvent(new CloseModal());
      },
    },
  },
});

export const transfer: ProcessDefinition<void, TransferCirclesContextData> = {
  name: "transfer",
  stateMachine: <any>processDefinition,
};
