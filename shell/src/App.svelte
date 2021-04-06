<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";

  import routes from "./loader";
  import { getLastLoadedDapp } from "./loader";

  import Router, { push } from "svelte-spa-router";
  import Modal from "./shared/molecules/Modal.svelte";
  import ProcessContainer from "./shared/molecules/ProcessContainer.svelte";

  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import { NavigateTo } from "@o-platform/o-events/dist/shell/navigateTo";
  import { ProgressSignal } from "@o-platform/o-events/dist/signals/progressSignal";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";
  import {
    shellProcess,
    ShellProcessContext,
  } from "./shared/processes/shellProcess";
  import { authenticate } from "./dapps/o-auth/processes/authenticate";
  import Error from "./shared/atoms/Error.svelte";
  import LoadingIndicator from "./shared/atoms/LoadingIndicator.svelte";
  import Success from "./shared/atoms/Success.svelte";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { Subscription } from "rxjs";
  import { Prompt } from "@o-platform/o-process/dist/events/prompt";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";
  import { ProcessEvent } from "@o-platform/o-process/dist/interfaces/processEvent";

  let isOpen: boolean = false;
  let modalProcess: Process;
  let modalProcessEventSubscription: Subscription;

  let progressIndicator: {
    message: string;
    percent: number;
  };

  window.o.events.subscribe(async (event: PlatformEvent) => {
    if (event.type === "shell.closeModal") {
      isOpen = false;
      lastPrompt = null;
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
        modalProcessEventSubscription = modalProcess.events.subscribe(
          (processEvent: ProcessEvent) => {
            if (
              processEvent.event.type == "process.ipc.bubble" &&
              (<any>processEvent.event).wrappedEvent.type == "process.prompt"
            ) {
              console.log(
                "lastPrompt:",
                (<any>processEvent.event).wrappedEvent
              );
              lastPrompt = <Prompt>(<any>processEvent.event).wrappedEvent;
            }
          }
        );
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

  let lastPrompt: Prompt | undefined = undefined;

  function routeLoading() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
  }

  function authenticateWithCircles(appId: string, code?: string) {
    if (isOpen) {
      isOpen = false;
      lastPrompt = null;
      return;
    }

    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = authenticate;
        ctx.childContext = {
          data: {
            appId: appId,
            code: code,
          },
          dirtyFlags: {},
          environment: {
            errorView: Error,
            progressView: LoadingIndicator,
            successView: Success,
          },
        };
        return ctx;
      }
    );

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }
</script>

<div class="flex flex-col h-screen bg-gray-100">
  <main class="flex-1 overflow-y-auto">
    <div class="w-full mx-auto md:w-2/3 xl:w-1/2 ">
      <Router
        {routes}
        on:conditionsFailed={conditionsFailed}
        on:routeLoading={routeLoading}
      />
    </div>
  </main>
  <footer class="z-50 flex justify-center w-full">
    <div class="flex space-x-2">
      {#if lastPrompt && lastPrompt.navigation.canGoBack}
        <button
          class="bg-white btn btn-outline"
          on:click={() => modalProcess.sendAnswer(new Back())}>back</button
        >
      {/if}
      {#if !localStorage.getItem("circles.key")}
        <button
          class="mb-4 bg-white btn btn-outline"
          on:click={() => authenticateWithCircles("circles.land")}
        >
          {#if !isOpen}
            <img
              width="15px"
              class="mr-3"
              src="/images/common/circles.png"
              alt="circles.land"
            /> login with circles
          {:else}
            <img
              width="15px"
              class="mr-3"
              src="/images/common/circles.png"
              alt="circles.land"
            /> Close
          {/if}
        </button>
      {:else}
        <button class="bg-white btn btn-outline">profile</button>
        <button
          class="bottom-0 p-3 bg-white border border-black rounded-full"
          on:click={() => {
            isOpen = !isOpen;
            if (!isOpen) {
              lastPrompt = null;
            }
          }}
        >
          <img
            width="40px"
            src="/images/common/circles.png"
            alt="circles.land"
          />
        </button>
        <button class="bg-white btn btn-outline">home</button>
      {/if}
      {#if lastPrompt && lastPrompt.navigation.canSkip}
        <button
          class="bg-white btn btn-outline"
          on:click={() => modalProcess.sendAnswer(new Skip())}>skip</button
        >
      {/if}
    </div>
  </footer>
</div>

<Modal bind:isOpen on:closeRequest={modalWantsToClose}>
  <div class="font-primary">
    {#if modalProcess}
      <ProcessContainer
        process={modalProcess}
        on:stopped={() => {
          isOpen = false;
          lastPrompt = null;
          modalProcess = null;
        }}
      />
    {:else}
      <!-- No process -->
      {#if getLastLoadedDapp()}
        Actions:<bt/><hr/>
        {#each getLastLoadedDapp().actions as action}
          <button on:click={() => window.o.publishEvent(action.event(getLastLoadedDapp()))}>{action.label}</button><br/>
        {/each}<br/>
      {/if}
        {#if getLastLoadedDapp()}
          <div class="flex justify-between">
            {#each getLastLoadedDapp().pages.filter((o) => !o.isSystem) as page}
              <a
                href="#/{getLastLoadedDapp().routeParts.join('/') +
              '/' +
              page.routeParts.join('/')}"
                class="justify-center inline-block w-full text-center focus:text-teal-500 hover:text-teal-500"
              >
                icon
                <span class="block text-xs tab tab-home">{page.title}</span>
              </a>
            {/each}
          </div>
        {/if}
    {/if}
  </div>
</Modal>
