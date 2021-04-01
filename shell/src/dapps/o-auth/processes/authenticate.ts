import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import TextEditor from "@o-platform/editors/src/TextEditor.svelte";
import {editDataField} from "../../../shared/stateNodes/editDataField";
import {createMachine, actions} from "xstate";
import gql from 'graphql-tag';

const {escalate} = actions;

export type AuthenticateContextData = {
  appId?: string,
  loginEmail?: string,
  code?: string,
  authResponse?: string
}

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type AuthenticateContext = ProcessContext<AuthenticateContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelLoginEmail: "Please enter your e-mail address",
  labelVerificationCode: "Enter your authentication code below or click the link in the e-mail to sign-in"
}

const processDefinition = () => createMachine<AuthenticateContext, any>({
  id: "upsertProfile",
  initial: "checkEntryPoint",
  states: {
    checkEntryPoint: {
      always: [{
        cond: (context) => typeof context.data.code === "string",
        target: "exchangeCodeForToken"
      }, {
        target: "loginEmail"
      }]
    },
    // Include all data-collection steps
    loginEmail: editDataField({
      fieldName: "loginEmail",
      component: TextEditor,
      params: {
        label: strings.labelLoginEmail
      },
      navigation: {
        next: "#requestAuthCode"
      }
    }),
    requestAuthCode: {
      id: "requestAuthCode",
      invoke: {
        src: async context => {
          const result = await window.o.graphQLClient.mutate({
            mutation: gql`
              mutation loginWithEmail($appId: String! $emailAddress:String!) {
                loginWithEmail(appId: $appId, emailAddress: $emailAddress) {
                  success
                  errorMessage
                }
              }`,
            variables: {
              appId: context.data.appId,
              emailAddress: context.data.loginEmail
            }
          });

          if (!result.data.loginWithEmail.success) {
            console.error(`Couldn't request a challenge:`, result.data.loginWithEmail.errorMessage);
            throw new Error(result.data.loginWithEmail.errorMessage);
          }
        },
        onDone: "#code",
        onError: "#error"
      }
    },
    code: editDataField({
      fieldName: "code",
      component: TextEditor,
      params: {
        label: strings.labelVerificationCode
      },
      navigation: {
        next: "#exchangeCodeForToken"
      }
    }),
    exchangeCodeForToken: {
      id: "exchangeCodeForToken",
      invoke: {
        src: async (context) => {
          const result = await window.o.graphQLClient.mutate({
            mutation: gql`
              mutation verify($oneTimeToken: String!) {
                verify(oneTimeToken: $oneTimeToken) {
                  success
                  errorMessage
                  jwt
                  exchangeTokenUrl
                }
              }`,
            variables: {
              oneTimeToken: context.data.code.trim()
            }
          });

          if (!result.data.verify.success) {
            console.error(`Couldn't request a challenge:`, result.data.verify.errorMessage);
            throw new Error(result.data.verify.errorMessage);
          }

          return result.data.verify.exchangeTokenUrl + result.data.verify.jwt;
        },
        onDone: "#redirectToApplication",
        onError: "#error"
      }
    },
    redirectToApplication: {
      id: "redirectToApplication",
      entry: (context, event) => {
        window.location = event.data;
      }
    },
    error: {
      id: "error",
      type: 'final',
      entry: escalate((context, event: OmoEvent & { data: Error }) => event.data)
    },
    success: {
      id: "success",
      type: 'final',
      data: (context, event: OmoEvent & { data: any }) => {
        console.log("Nice! Here's the result of your process:", event.data);

        // This last return corresponds roughly to the exit-code of a regular os-process
        // and can be used by the caller.
        return event.data;
      }
    }
  }
});

// A ProcessDefinition always has a input and an output value (the generic parameters).
// Depending on how 'void' is placed, it can mimic either a function or procedure.
// Here it simply returns all the data that was collected in the process (AuthenticateContextData)
// if no error occurs in the promise.
export const authenticate: ProcessDefinition<void, AuthenticateContextData> = {
  name: "upsertProfile",
  stateMachine: <any>processDefinition
};