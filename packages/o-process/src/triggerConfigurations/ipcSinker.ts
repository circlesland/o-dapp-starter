import {actions} from "xstate";
import {Sinker} from "../events/sinker";
import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
import {IProcessContext} from "../interfaces/processContext";
const {send} = actions;

export const ipcSinker = (id:string) => {
  return {
    "process.ipc.sinker": [{
      // Unwrap and send
      cond: (context: IProcessContext, event: Sinker) => {
        return event.levels == 1;
      },
      actions: send((context: any, event: any) => {
        return event.wrappedEvent;
      }, {
        to: (context: IProcessContext, event: Sinker) => {
          const id = event.backTrace.pop()
          if (!id)
            throw new Error(`Arrived at tne last level of the backtrace. Cannot sink any deeper.. :/`);

          return id;
        }
      })
    }, {
      // Let it continue to sink
      cond: (context: IProcessContext, event: Sinker) => {
        return event.levels > 0
            && (!event.trace?.length || event.trace[event.trace.length - 1] != id)
      },
      actions: send((context: any, event: any) => {
        const newSinker = <OmoEvent>{
          type: "process.ipc.sinker",
          levels: event.levels - 1,
          tag: event.tag,
          wrappedEvent: event.wrappedEvent,
          trace: event.trace?.concat([id]) ?? [id],
          backTrace: event.backTrace
        };
        return newSinker;
      }, {
        to: (context: IProcessContext, event: Sinker) => {
          const id = event.backTrace.pop()
          if (!id)
            throw new Error(`Arrived at tne last level of the backtrace. Cannot sink any deeper.. :/`);

          return id;
        }
      })
    }]
  }
}