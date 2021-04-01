<script lang="ts">
  import "./libs/o-views/css/base.css";
  import "./libs/o-views/css/components.css";
  import "./libs/o-views/css/utilities.css";

  import Router, {push} from "svelte-spa-router";
  import routes from "./libs/o-os/loader";
  import Modal from "./libs/o-views/molecules/Modal.svelte";
  import ProcessContainer from "./libs/o-views/molecules/ProcessContainer.svelte";
  import {Process} from "omo-process/dist/interfaces/process";
  import {OmoEvent} from "omo-events/dist/omoEvent";
  import {RunProcess} from "omo-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "./dapp/processes/shell/shellProcess";
  import {upsertProfile} from "./dapp/processes/upsertProfile/upsertProfile";
  import {NavigateTo} from "omo-events/dist/shell/navigateTo";
  import {ProgressSignal} from "omo-events/dist/signals/progressSignal";

  import Error from "./libs/o-views/atoms/Error.svelte";
  import LoadingIndicator from "./libs/o-views/atoms/LoadingIndicator.svelte";
  import Success from "./libs/o-views/atoms/Success.svelte";
  import {Continue} from "omo-process/dist/events/continue";

  let actions = [];
  let isOpen:boolean = false;
  let runningProcess: Process;

  let progressIndicator: {
    message: string;
    percent: number;
  };

  window.o.events.subscribe(async (event: OmoEvent) => {
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

  function runProcess() {
    // We start a 'shellProcess' which provides access to the UI and give it the process definition
    // that we eventually want to run.
    // When the shellProcess runs, it starts the child process with the 'childContext', let's it run
    // and passes bubbling and sinking events until the child process ends.
    window.o.publishEvent(new RunProcess<ShellProcessContext>(shellProcess, async ctx => {
      ctx.childProcessDefinition = upsertProfile;
      ctx.childContext = {
        data: {},
        dirtyFlags: {},
        environment: {
          errorView: Error,
          progressView: LoadingIndicator,
          successView: Success
        }
      }
      return ctx;
    }));
  }

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
<div class="appContainer">
  Hello from App.svelte
  <br/>
  <button on:click={runProcess}>&gt; Run process</button><br/>
  <a href="#/dapp1/main">&gt; Open dapp (route: '#/dapp1/main' - see the dapp-manifest's routeParts-property)</a><br/>
</div><br/>
Router output follows below:<hr/>
<div>
  <Router
    {routes}
    on:conditionsFailed={conditionsFailed}
    on:routeLoading={routeLoading} />
</div>
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
