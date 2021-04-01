import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {Shell} from "./shared/interfaces/shell";
import App from "src/App.svelte";
import {shellEvents} from "./shared/shellEvents";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {useMachine} from "xstate-svelte";
import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
import Success from "./shared/atoms/Success.svelte";
import Error from "./shared/atoms/Error.svelte";
import {OmoSubject} from "@o-platform/o-dependencies/dist/OmoSubject";
import {ProcessEvent} from "@o-platform/o-process/dist/interfaces/processEvent";
import {Bubble} from "@o-platform/o-process/dist/events/bubble";
import {Process} from "@o-platform/o-process/dist/interfaces/process";
import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
import {Sinker} from "@o-platform/o-process/dist/events/sinker";
import {ApiConnection} from "./shared/apiConnection";
import {getProcessContext} from "./shell";

dayjs.extend(relativeTime)

declare global {
  interface Window {
    o: Shell
  }
}

const shell: Shell = {
  stateMachines: {
    async run<TContext>(definition: ProcessDefinition<any, any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>) {
      console.log("Starting process:", definition);

      const {service, state, send} = useMachine(
        (<any>definition).stateMachine(LoadingIndicator, Success, Error),
        {
          context: contextModifier
            ? await contextModifier(await getProcessContext())
            : await getProcessContext()
        });

      const processEvents = new OmoSubject<ProcessEvent>();

      service.onTransition((state1, event) => {
        if (event.type == 'error.platform') {
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

      service.onStop(() => {
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
          if (!this.lastReceivedBubble || this.lastReceivedBubble.noReply) {
            throw new window.Error("Cannot answer because no Bubble event was received before or the event hat the 'noReply' property set.")
          }
          process.sendEvent(<Sinker>{
            type: "process.ipc.sinker",
            levels: this.lastReceivedBubble.levels ?? 0,
            backTrace: this.lastReceivedBubble.trace,
            wrappedEvent: answer
          });
        }
      };

      service.start();
      return process;
    }
  },
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event),
  graphQLClient: null
};

async function connectToApi() {
  const apiConnection = new ApiConnection("http://localhost:1234/");
  shell.graphQLClient = await apiConnection.client.subscribeToResult();
  console.log("GraphQL client ready:", shell.graphQLClient);

}
connectToApi();

window.o = shell;

console.log("Starting ..", {
  userAgent: navigator.userAgent
})

export default new App({
  target: document.body,
});
