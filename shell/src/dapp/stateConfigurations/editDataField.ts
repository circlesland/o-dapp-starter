import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {Continue} from "omo-process/dist/events/continue";
import {actions} from "xstate";
import {show} from "omo-process/dist/actions/show";
const {assign} = actions;

/**
 * Displays the specified editor to the user.
 * The editor is expected to understand the 'fieldName' property
 * and the supplied params.
 *
 * @param spec
 */
export function editDataField(spec: {
  fieldName: string,
  component: any,
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string,
    canGoBack?: (context:ProcessContext<any>, event:{type:string, [x:string]:any}) => boolean,
    next: string,
    canSkip?: (context:ProcessContext<any>, event:{type:string, [x:string]:any}) => boolean,
  },
  params: {
    label: string
  }
}) {
  const editDataFieldConfig:any = { // TODO: Fix need for 'any'
    id: spec.fieldName,
    initial: 'show',
    states: {
      show: {
        entry: [
          show({
            fieldName: spec.fieldName,
            component: spec.component,
            params: spec.params
          }),
          () => console.log(`${spec.fieldName} process - show`)
        ],
        on: {
          "process.back": 'back',
          "process.continue": 'submit',
          "process.skip": 'skip'
        }
      },
      back: {
        entry: () => console.log(`${spec.fieldName} process - back`),
        always: [{
          cond: (context, event) => {
            return spec.navigation.previous && (!spec.navigation?.canGoBack || spec.navigation.canGoBack(context, event))
          },
          target: spec.navigation.previous ?? "show"
        }, {
          target: "show"
        }]
      },
      skip: {
        entry: () => console.log(`${spec.fieldName} process - skip`),
        always: [{
          cond: (context, event) => {
            return spec.navigation.canSkip !== undefined && spec.navigation.canSkip(context, event)
          },
          target: spec.navigation.next
        }, {
          target: "show"
        }]
      },
      submit: {
        entry: [
          assign((context: ProcessContext<any>, event: Continue) => {
            // TODO: Try to use a nicer equivalence check for change tracking and setting the dirty flag
            // TODO: How to handle validation?
            if (context.data[spec.fieldName] !== event.data[spec.fieldName]) {
              context.data[spec.fieldName] = event.data[spec.fieldName];
              context.dirtyFlags[spec.fieldName] = true;
            }
            return context;
          }),
          () => console.log(`${spec.fieldName} process - submit`),
        ],
        always: [{
          target: spec.navigation.next
        }]
      }
    }
  };

  console.log(`Created config for field ${spec.fieldName}:`, editDataFieldConfig);

  return editDataFieldConfig;
}