import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import TextEditor from "../../../../../packages/o-editors/src/TextEditor.svelte";
import {AuthenticateContext} from "../../o-auth/processes/authenticate";
import {CloseModal} from "@o-platform/o-events/dist/shell/closeModal";

export type SetTrustContextData = {
  safeAddress:string;
  trustReceiver?:string;
  trustLimit?:number;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type SetTrustContext = ProcessContext<SetTrustContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelTrustReceiver: "",
  labelTrustLimit: ""
};

const processDefinition = (processId: string) =>
  createMachine<SetTrustContext, any>({
    id: `${processId}:setTrust`,
    initial: "findEntryPoint",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<SetTrustContext, any>("error"),

      trustReceiver: prompt<SetTrustContext, any>({
        fieldName: "trustReceiver",
        component: TextEditor,
        params: {
          label: strings.labelTrustReceiver,
        },
        navigation: {
          next: "#trustLimit",
        },
      }),
      trustLimit: prompt<SetTrustContext, any>({
        fieldName: "trustLimit",
        component: TextEditor,
        params: {
          label: strings.labelTrustLimit,
        },
        navigation: {
          previous: "#trustReceiver",
          next: "#setTrust"
        },
      }),
      // The code was either manually entered or pre-configured at launch.
      // Exchange it for the actual token and redirect the user to the application.
      setTrust: {
        id: "setTrust",
        invoke: {
          src: async (context) => {
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        id: "success",
        entry: (context, event) => {
          console.log("setTrust - success")
          window.o.publishEvent(new CloseModal());
        },
      },
    },
  });

export const setTrust: ProcessDefinition<void, SetTrustContext> = {
  name: "setTrust",
  stateMachine: <any>processDefinition,
};
