import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {Bubble} from "omo-process/dist/events/bubble";
import {actions} from "xstate";
const {sendParent} = actions;

/**
 * Bubbles any event up the call chain.
 * @param eventFactory
 */
export function bubble<TContext extends ProcessContext<any>>(eventFactory: (context:TContext) => OmoEvent) {
  return sendParent((context:TContext) => <Bubble>{
    type: "process.ipc.bubble",
    levels: 0,
    trace: [],
    wrappedEvent: eventFactory(context)
  });
}