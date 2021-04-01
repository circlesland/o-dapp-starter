import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
import {actions} from "xstate";
import {ProcessContext} from "../interfaces/processContext";
import {Bubble} from "../events/bubble";
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