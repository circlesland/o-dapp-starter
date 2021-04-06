<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";

  import routes from "./loader";
  import { getLastLoadedDapp } from "./loader";
  import {getLastLoadedPage} from "./loader";

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
  import { Cancel } from "@o-platform/o-process/dist/events/cancel";
  import { ProcessEvent } from "@o-platform/o-process/dist/interfaces/processEvent";
  import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
  import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

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
              processEvent.event &&
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
    if (isOpen) {
      isOpen = false;
      lastPrompt = null;
      if (modalProcess) {
        modalProcess.sendEvent(new Cancel());
      }
      return;
    }
  }

  function conditionsFailed(event) {
    // TODO: Cannot currently remember what this callback does. Lookup documentation.
  }

  let lastPrompt: Prompt | undefined = undefined;

  function routeLoading() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
  }

  let lastLoadedPage:PageManifest;
  let lastLoadedDapp:DappManifest<any>;
  function routeLoaded() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
    if (isOpen) {
      isOpen = false;
      lastPrompt = null;
      if (modalProcess) {
        modalProcess.sendEvent(new Cancel());
      }
      return;
    }
  }

  function authenticateWithCircles(appId: string, code?: string) {
    if (isOpen) {
      isOpen = false;
      lastPrompt = null;
      if (modalProcess) {
        modalProcess.sendEvent(new Cancel());
      }
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
  <header class="w-full mx-auto md:w-2/3 xl:w-1/2 ">
    <div
      class="mb-2 rounded-b-lg shadow-lg navbar bg-neutral text-neutral-content"
    >
        {#if lastLoadedDapp && lastLoadedPage}
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold">{#if lastLoadedDapp.title != lastLoadedPage.title} {lastLoadedDapp.title} / {/if}{lastLoadedPage.title}</span>
        </div>
      {/if}
      <div class="flex-none">
        <div class="avatar">
          <div class="w-10 h-10 m-1 rounded-lg">
            <img src="https://i.pravatar.cc/500?img=32" />
          </div>
        </div>
      </div>
    </div>
  </header>
  <main class="flex-1 overflow-y-auto">
    <div class="w-full mx-auto md:w-2/3 xl:w-1/2 ">
      <Router
        {routes}
        on:conditionsFailed={conditionsFailed}
        on:routeLoading={routeLoading}
        on:routeLoaded={routeLoaded}
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
        {#if !modalProcess}
          <button class="btn">
            <div class="flex-none">
              <button class="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </div></button
          >
        {/if}
        <button
          class="p-2 bg-white border border-gray-700 rounded-lg "
          on:click={() => {
            isOpen = !isOpen;
            if (!isOpen) {
              lastPrompt = null;
              if (modalProcess) {
                modalProcess.sendEvent(new Cancel());
              }
            }
          }}
        >
          <img
            width="42px"
            src="/images/common/circles.png"
            alt="circles.land"
          />
        </button>
        {#if !modalProcess}
          <button
            class="btn"
            on:click={() => (window.location = "/#/dashboard")}>home</button
          >
        {/if}
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
        <div class="mb-8 space-y-4">
          {#each getLastLoadedDapp().actions as action}
            <button
              on:click={() =>
                window.o.publishEvent(action.event(getLastLoadedDapp()))}
              class="w-full btn btn-primary btn-outline">{action.label}</button
            >
          {/each}
        </div>
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
