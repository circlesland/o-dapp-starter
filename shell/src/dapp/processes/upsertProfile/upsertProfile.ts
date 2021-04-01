import {OmoEvent} from "omo-events/dist/omoEvent";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import TextEditor from "@o-platform/editors/src/TextEditor.svelte";
import ImageEditor from "@o-platform/editors/src/ImageEditor.svelte";
import {editDataField} from "../../stateConfigurations/editDataField";
import {createMachine, actions} from "xstate";
const {escalate} = actions;

export type UpsertProfileContextData = {
  id?: string,
  loginEmail?: string,
  verificationCode?: string,
  firstName?: string,
  lastName?: string,
  avatar?: {
    mimeType: string,
    data: Buffer
  }
}

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'UpsertProfileContextData' type.
 * The 'UpsertProfileContextData' type is also the return value of the process (see bottom for the signature).
 */
export type UpsertProfileContext = ProcessContext<UpsertProfileContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelFirstName: "Please enter your first name",
  labelLastName: "Please enter your last name",
  labelAvatar: "Please upload an avatar"
}

// 'editDataField()' is a factory function for
// a x-state StateConfiguration..
// It assumes that the user wants to operate on the 'data'-object of the process' context
// and creates a stateConfig node with the following sub-states:
// * show: Displays the configured 'component' to the user
// * back: Tries to go back to 'navigation.previous'
// * skip: Tries to go to 'navigation.next'
// * submit: Safes the changes
const dataCollectionStates = {
  // Use a template state configuration for a field editor:
  firstName: editDataField({
    fieldName: "firstName",
    component: TextEditor,
    params: {
      label: strings.labelFirstName
    },
    navigation: {
      next: "#lastName"
    }
  }),
  lastName: editDataField({
    fieldName: "lastName",
    component: TextEditor,
    params: {
      label: strings.labelLastName
    },
    navigation: {
      previous: "#firstName",
      next: "#avatar"
    }
  }),
  avatar: editDataField({
    fieldName: "avatar",
    component: ImageEditor,
    params: {
      label: strings.labelAvatar
    },
    navigation: {
      previous: "#lastName",
      next: "#doAllThatStuff",
      canSkip: () => true // Allow the user to skip this step
    }
  })
};

// The actual process definition.
// Here it uses pre-configured blocks to collect the context-data and
// a promise to process it in the end.
const processDefinition = () => createMachine<UpsertProfileContext, any>({
  id: "upsertProfile",
  initial: "firstName",
  states: {
    // Includ all data-collection steps
    ...dataCollectionStates,
    // Use a promise to do the actual work.
    // At this point you can access the ProcessContext.dirtyFlags
    // to determine which properties of ProcessContext.data changed
    // during the execution of the process and act accordingly.
    doAllThatStuff: {
      id:"doAllThatStuff",
      invoke: {
        src: async (context, event) => {
          // Do something useful here
          console.log(context.data);
          return context.data;
        },
        onError: "error", // In case something goes wrong during the excution, go to the 'error' state which in turn escalates the error event
        onDone: "success"
      }
    },
    error: {
      type: 'final',
      entry: escalate((context, event: OmoEvent & { data: Error }) => event.data)
    },
    success: {
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
// Here it simply returns all the data that was collected in the process (UpsertProfileContextData)
// if no error occurs in the promise.
export const upsertProfile: ProcessDefinition<void, UpsertProfileContextData> = {
  name: "upsertProfile",
  stateMachine: <any>processDefinition
};