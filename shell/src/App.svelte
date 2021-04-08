<script lang="ts">
  import "./shared/css/base.css";
  import "./shared/css/components.css";
  import "./shared/css/utilities.css";

  import routes from "./loader";
  import { getLastLoadedDapp } from "./loader";
  import { getLastLoadedPage } from "./loader";

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
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

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

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;
  let headertype = "small";

  function routeLoaded() {
    // Pretty self explanatory. For more lookup the svelte-spa-router docs,
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();

    if (lastLoadedDapp.dappId == "dashboard:1") {
      headertype = "dashboard";
    } else if (lastLoadedDapp.dappId == "auth:1") {
      headertype = "auth";
    } else {
      headertype = "small";
    }
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

<div class="flex flex-col h-screen ">
  <header class="w-full mx-auto md:w-2/3 xl:w-1/2 z-10">
    {#if headertype == "auth"}
      <!-- DASHBOARD HEADER START -->
      <div
        class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
      >
        {#if lastLoadedDapp && lastLoadedPage}
          <div class=" pl-2 ">
            <span class="text-lg font-bold"
              >{#if lastLoadedDapp.title != lastLoadedPage.title}
                {lastLoadedDapp.title} /
              {/if}{lastLoadedPage.title}</span
            >
          </div>
        {/if}
        <div class="self-center text-center mt-16 block">
          <div class="avatar">
            <div class="w-24 h-24 rounded-full mb-4">
              <img src="/images/common/circles.png" />
            </div>
          </div>
          <div class="">Welcome to CirclesLAND</div>
          <div class="">
            <small>Use the button to log in or create an Account</small>
          </div>
        </div>
      </div>
      <!-- DASHBOARD HEADER STOP -->
    {/if}
    {#if headertype == "dashboard"}
      <!-- DASHBOARD HEADER START -->
      <div
        class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
      >
        {#if lastLoadedDapp && lastLoadedPage}
          <div class=" pl-2 ">
            <span class="text-lg font-bold"
              >{#if lastLoadedDapp.title != lastLoadedPage.title}
                {lastLoadedDapp.title} /
              {/if}{lastLoadedPage.title}</span
            >
          </div>
        {/if}
        <div class="self-center text-center mt-16 block">
          <div class="avatar">
            <div class="w-24 h-24 rounded-full ring ring-gradient1 mb-4">
              <img src="https://i.pravatar.cc/500?img=32" />
            </div>
          </div>
          <div class="">
            <strong>Hi Martin,</strong> Welcome to CirclesLAND
          </div>
          <div class="">
            <small>This is your dashboard and door into our universe.</small>
          </div>
        </div>
      </div>
      <!-- DASHBOARD HEADER STOP -->
    {/if}
    {#if headertype == "small"}
      <!-- PROFILE HEADER START -->
      <div
        class="h-28 flex flex-col  navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
      >
        {#if lastLoadedDapp && lastLoadedPage}
          <div class=" pl-2 ">
            <span class="text-lg font-bold self-center"
              >{#if lastLoadedDapp.title != lastLoadedPage.title}
                {lastLoadedDapp.title} /
              {/if}{lastLoadedPage.title}</span
            >
          </div>
        {/if}
      </div>
      <!-- DASHBOARD HEADER STOP -->
    {/if}
  </header>

  <main class="flex-1 overflow-y-visible z-30">
    <div class="w-full mx-auto md:w-2/3 xl:w-1/2 ">
      <Router
        {routes}
        on:conditionsFailed={conditionsFailed}
        on:routeLoading={routeLoading}
        on:routeLoaded={routeLoaded}
      />
    </div>
  </main>

  {#if !localStorage.getItem("circles.key")}
    <footer class="z-50  w-full sticky bottom-0 ">
      <div class="flex justify-around ">
        <button
          class="mb-4 btn btn-outline bg-base-100"
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
      </div>
    </footer>
  {:else}
    <footer class="z-50  w-full sticky bottom-0 bg-white h-12">
      <div class="flex justify-around ">
        {#if lastPrompt && lastPrompt.navigation.canGoBack}
          <button
            class="bg-white btn btn-outline"
            on:click={() => modalProcess.sendAnswer(new Back())}>back</button
          >
        {/if}

        {#if !modalProcess}
          <button class="bg-white text-linkgrey self-center h-12">
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
        {/if}
        <button
          class="bg-white btn-circle -m-4 w-14 h-14 shadow-lg circles-button "
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
            class="w-full"
            src="/images/common/circles.png"
            alt="circles.land"
          />
        </button>
        {#if !modalProcess}
          <button
            class="bg-white text-linkgrey self-center h-12"
            on:click={() => (window.location = "/#/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
        {/if}

        {#if lastPrompt && lastPrompt.navigation.canSkip}
          <button
            class="bg-white btn btn-outline"
            on:click={() => modalProcess.sendAnswer(new Skip())}>skip</button
          >
        {/if}
      </div>
    </footer>
  {/if}
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
