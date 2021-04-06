import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import PictureEditor from "@o-platform/o-editors/src/PictureEditor.svelte";
import {CloseModal} from "@o-platform/o-events/dist/shell/closeModal";
import {AuthenticateContext} from "../../o-auth/processes/authenticate";
import {Cancel} from "@o-platform/o-process/dist/events/cancel";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type UpsertIdentityContextData = {
  loginEmail: string;
  firstName?: string;
  lastName?: string;
  avatar?: {
    bytes: Buffer,
    mimeType: string
  }
};

export type UpsertIdentityContext = ProcessContext<UpsertIdentityContextData>;

const strings = {
  labelFirstName: "firstName",
  labelLastName: "lastName",
  labelAvatar: "avatar"
};

const processDefinition = (processId: string) =>
  createMachine<UpsertIdentityContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "checkFirstName",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertIdentityContext, any>("error"),

      checkFirstName: {
        id: "checkFirstName",
        always:[{
          cond: (context) => false,
          target: "#checkLastName"
        }, {
          target: "#firstName"
        }]
      },
      editFirstName: prompt<AuthenticateContext, any>({
        fieldName: "firstName",
        component: TextEditor,
        params: {
          label: strings.labelFirstName,
        },
        navigation: {
          next: "#checkLastName",
        },
      }),
      checkLastName: {
        id: "checkLastName",
        always:[{
          cond: (context) => false,
          target: "#checkAvatar"
        }, {
          target: "#lastName"
        }]
      },
      editLastName: prompt<AuthenticateContext, any>({
        fieldName: "lastName",
        component: TextEditor,
        params: {
          label: strings.labelLastName,
        },
        navigation: {
          next: "#checkAvatar",
          previous: "#checkFirstName",
          canSkip: () => true
        },
      }),
      checkAvatar: {
        id: "checkAvatar",
        always:[{
          cond: (context) => false,
          target: "#upsertIdentity"
        }, {
          target: "#avatar"
        }]
      },
      editAvatar: prompt<AuthenticateContext, any>({
        fieldName: "avatar",
        component: PictureEditor,
        params: {
          label: strings.labelAvatar,
        },
        navigation: {
          next: "#upsertIdentity",
          previous: "#checkLastName",
          canSkip: () => true
        },
      }),
      upsertIdentity: {
        id: "upsertIdentity",
        invoke: {
          src: async (context) => {
            localStorage.setItem("circles.session", "true");
            console.log("upsertIdentity():", context.data)
          },
          onDone: "#success",
          onError: "#error"
        }
      },
      success: {
        type: 'final',
        id: "success",
        data: (context, event: PlatformEvent) => {
          return "yeah!";
        }
      }
    },
  });

// A ProcessDefinition always has a input and an output value (the generic parameters).
// Depending on how 'void' is placed, it can mimic either a function or procedure.
// Here it simply returns all the data that was collected in the process (AuthenticateContextData)
// if no error occurs in the promise.
export const upsertIdentity: ProcessDefinition<void, UpsertIdentityContextData> = {
  name: "upsertIdentity",
  stateMachine: <any>processDefinition,
};
