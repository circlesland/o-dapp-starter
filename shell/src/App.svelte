<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";

  import Router, {push} from "svelte-spa-router";
  import routes from "./loader";
  import Modal from "./shared/molecules/Modal.svelte";
  import ProcessContainer from "./shared/molecules/ProcessContainer.svelte";
  import {Process} from "@o-platform/o-process/dist/interfaces/process";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "./shared/processes/shellProcess";
  import {NavigateTo} from "@o-platform/o-events/dist/shell/navigateTo";
  import {ProgressSignal} from "@o-platform/o-events/dist/signals/progressSignal";

  import Error from "./shared/atoms/Error.svelte";
  import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
  import Success from "./shared/atoms/Success.svelte";
  import {authenticate} from "./dapps/o-auth/processes/authenticate";

  let actions = [];
  let isOpen:boolean = false;
  let runningProcess: Process;

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
      runningProcess = await window.o.stateMachines.run(
        (<RunProcess<any>>event).definition,
        (<RunProcess<any>>event).contextModifier
      );
      isOpen = true;
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
    {#if runningProcess}
      <ProcessContainer
        process={runningProcess}
        on:stopped={() => {
          isOpen = false;
          runningProcess = null;
        }} />
    {:else}
      No process
    {/if}
  </div>
</Modal>
