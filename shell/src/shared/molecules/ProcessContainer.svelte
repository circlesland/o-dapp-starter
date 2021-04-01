<script lang="ts">
  import NavItem from "../atoms/NavItem.svelte";
  import {
    faArrowLeft,
    faForward,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
  import Prompt from "./Prompt.svelte";
  import { createEventDispatcher } from "svelte";
  import {Process} from "@o-platform/o-process/dist/interfaces/process";
  import {ShellEvent} from "@o-platform/o-process/dist/events/shellEvent";
  import {Cancel} from "@o-platform/o-process/dist/events/cancel";
  import {Prompt as PromptEvent} from "@o-platform/o-process/dist/events/prompt";
  import {Continue} from "@o-platform/o-process/dist/events/continue";
  import {Subscription} from "rxjs";
  import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
  import {Bubble} from "@o-platform/o-process/dist/events/bubble";
  import {Sinker} from "@o-platform/o-process/dist/events/sinker";

  /**
   * A channel to an already running process.
   */
  export let process: Process;

  let subscription: Subscription;
  let canSkip = false;
  let canGoBack = false;
  let prompt: PromptEvent;

  const dispatch = createEventDispatcher();

  $: {
    if (subscription) {
      console.log("unsubscribe()");
      subscription.unsubscribe();
      subscription = null;
    }
    if (process) {
      console.log("subscribeToProcess()");
      subscribeToProcess();
      console.log("subscription:", subscription);
      console.log("sending a Continue event to the process to kick it off.")
      process.sendEvent(new Continue());
    } else {
      console.log("clear");
      canSkip = false;
      prompt = null;
    }
  }

  let lastBubble:Bubble;

  function ensureProcess(action: (p: Process) => void) {
    if (!process) {
      console.warn(
        "ProcessContainer.svelte: No running 'process' attached to ProcessContainer."
      );
      return;
    }
    action(process);
  }

  function subscribeToProcess() {

    ensureProcess((process) =>
    {
      subscription = process.events.subscribe((next) =>
      {
        if (next.stopped) {
          prompt = null;
          process = null;
          dispatch("stopped");
        }

        if (!next.event)
          return;

        console.log("ProcessContainer received: ", next.event);

        let event:OmoEvent;
        if (next.event?.type === "process.ipc.bubble") {
          console.log("ProcessContainer received Bubble: ", next);
          lastBubble = next.event;
          event = next.event.wrappedEvent;
        } else {
          event = next.event;
        }

        if (event.type === "process.shellEvent")
        {
          console.log("ProcessContainer received 'process.shellEvent' event: ", next);
          console.log("publishing shell event:", event);
          window.o.publishEvent((<ShellEvent>event).payload);
        }
        else if (event.type === "process.prompt")
        {
          console.log("ProcessContainer received 'process.prompt' event: ", next);
          prompt = <PromptEvent>event;
          if (!prompt.fieldName) {
            console.log("fieldname not set in:", JSON.parse(JSON.stringify(prompt)))
          }
        }
      });

      process.sendEvent({
        type: "process.continue",
      });
    });
  }

  function sinkEvent(event) {
    if (!lastBubble) {
      // TODO: This is error prone without event-ids
      throw new Error("Can only sink events in response to a previously bubbled event.");
    }
    ensureProcess((p) => {
      p.sendEvent(<Sinker>{
        type: "process.ipc.sinker",
        levels: lastBubble.levels,
        backTrace: lastBubble.trace,
        wrappedEvent: event
      })
    });
  }

  const cancel = {
    data: {
      label: "Cancel",
    },
    design: {
      icon: faTimes,
    },
  };
  const cancelPressed = () => {
    process.sendEvent(new Cancel());
  };
</script>

{#if process && prompt}
  <div class="w-full">
    <Prompt process={process} prompt={prompt} bubble={lastBubble} />
  </div>
{/if}
<footer class="flex justify-between px-4 pt-4 text-gray-400 bg-white ">
  <button on:click={cancelPressed}>
    <NavItem mapping={cancel} />
  </button>
</footer>
