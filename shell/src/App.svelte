<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";

  import routes from "./loader";

  import Router, {push} from "svelte-spa-router";
  import Modal from "./shared/molecules/Modal.svelte";
  import ProcessContainer from "./shared/molecules/ProcessContainer.svelte";

  import {Process} from "@o-platform/o-process/dist/interfaces/process";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {NavigateTo} from "@o-platform/o-events/dist/shell/navigateTo";
  import {ProgressSignal} from "@o-platform/o-events/dist/signals/progressSignal";
  import {ProcessStarted} from "@o-platform/o-process/dist/events/processStarted";
  import {current_component} from "svelte/internal";

  let isOpen:boolean = false;
  let modalProcess: Process;

  let progressIndicator: {
    message: string;
    percent: number;
  };

  window.o.events.subscribe(async (event: PlatformEvent) => {
    if (event.type === "shell.closeModal") {
      isOpen = false;
    }
    if (event.type === "shell.openModal") {
      isOpen = true;
    }
    if (event.type == "shell.runProcess") {
      const runProcessEvent = <RunProcess<any>>event;
      const runningProcess = await window.o.stateMachines.run(
        runProcessEvent.definition,
        runProcessEvent.contextModifier
      );

      if (runProcessEvent.inWindow) {
        // If the process should be started modal, let App.svelte's ProcessContainer handle it.
        modalProcess = runningProcess;
        isOpen = true;
      } else {
        // If not, send an event with the process id.
        const startedEvent = new ProcessStarted(runningProcess.id);
        startedEvent.responseToId = runProcessEvent.id;
        window.o.publishEvent(startedEvent);
      }
    }
    if (event.type === "shell.begin") {
    }
    if (event.type === "shell.navigateTo") {
      push("#" + (<NavigateTo>event).route);
    }
    if (event.type === "shell.done") {
      progressIndicator = null;
    }
    if (event.type === "shell.progress") {
      const progressEvent: ProgressSignal = <ProgressSignal>event;
      progressIndicator = {
        message: progressEvent.message,
        percent: progressEvent.percent,
      };
    }
  });

  function modalWantsToClose() {
    // Use this to cancel the close request etc.
  }

  function conditionsFailed(event) {
    // TODO: Cannot currently remember what this callback does. Lookup documentation.
  }

  function routeLoading() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
  }
</script>
<Router
  {routes}
  on:conditionsFailed={conditionsFailed}
  on:routeLoading={routeLoading} />
<Modal bind:isOpen on:closeRequest={modalWantsToClose}>
  <div class="font-primary">
    {#if modalProcess}
      <ProcessContainer
        process={modalProcess}
        on:stopped={() => {
          isOpen = false;
          modalProcess = null;
        }} />
    {:else}
      No process
    {/if}
  </div>
</Modal>
