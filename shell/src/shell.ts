import {useMachine} from "xstate-svelte";
import { Shell } from "./shared/interfaces/shell";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {Process} from "omo-process/dist/interfaces/process";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
import Success from "./shared/atoms/Success.svelte";
import Error from "./shared/atoms/Error.svelte";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";
import {ProcessEvent} from "omo-process/dist/interfaces/processEvent";
import {Bubble} from "omo-process/dist/events/bubble";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {Sinker} from "omo-process/dist/events/sinker";

export async function getProcessContext(): Promise<ProcessContext<any>> {
  return <ProcessContext<any>>{
    data: {}
  };
}

export const shell: Shell = {
  stateMachines: {
    async run<TContext>(definition: ProcessDefinition<any,any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>)
    {
      console.log("Starting process:", definition);

      const {service, state, send} = useMachine(
        (<any>definition).stateMachine(LoadingIndicator, Success, Error),
        {
          context: contextModifier
            ? await contextModifier(await getProcessContext())
            : await getProcessContext()
        });

      const processEvents = new OmoSubject<ProcessEvent>();

      service.onTransition((state1, event) =>
      {
        if (event.type == 'error.platform')
        {
          console.error(`An error occurred during the execution of process '${definition.name}'::`, event);
        }
        if (event.type == "process.ipc.bubble") {
          process.lastReceivedBubble = <Bubble>event;
        }

        console.log(`window.o.stateMachines: forwarding event to the processEvents stream of process '${definition.name}':`, event);
        processEvents.next(<any>{
          stopped: false,
          currentState: state1,
          previousState: state1.history,
          event: event
        });
      });

      service.onStop(() =>
      {
        processEvents.next({
          stopped: true
        });
        this._current = null;
      });

      const process: Process = {
        id: 0,
        events: processEvents,
        lastReceivedBubble: null,
        sendEvent: (event: any) => send(event),
        sendAnswer(answer: OmoEvent) {
          if(!this.lastReceivedBubble || this.lastReceivedBubble.noReply) {
            throw new window.Error("Cannot answer because no Bubble event was received before or the event hat the 'noReply' property set.")
          }
          process.sendEvent(<Sinker>{
            type:"process.ipc.sinker",
            levels: this.lastReceivedBubble.levels ?? 0,
            backTrace: this.lastReceivedBubble.trace,
            wrappedEvent: answer
          });
        }
      };

      service.start();
      return process;
    }
  }
}
