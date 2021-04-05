<script lang="ts">
  import { authenticate } from "../processes/authenticate";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import Error from "../../../shared/atoms/Error.svelte";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";
  import ProcessContainer from "../../../shared/molecules/ProcessContainer.svelte";
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { Subscription } from "rxjs";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { ProcessStarted } from "@o-platform/o-process/dist/events/processStarted";

  let devHome = true;
  let devDash = false;
  let runningProcess: Process;

  export let params: {
    code: string;
  };

  $: {
    if (params && params.code) {
      authenticateWithCircles("circles.land", params.code);
    }
  }

  function authenticateWithCircles(appId: string, code?: string) {
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

<!-- <div class="grid grid-cols-1 p-2">
  <div class="flex h-screen ">
    <div class="grid m-auto">
      <img
        class="z-30 inline w-12 h-12 m-auto -mb-6"
        src="/images/common/circles.png"
        alt="circles.land"
      />
      <div class="z-0 bg-white shadow card">
        <div class="card-body">
          {#if !params || !params.code}
            <h1 class="mb-4 justify-self-left">Hi!</h1>
            <div class="mb-4">Click the Button below to login with Circles</div>
            <button
              class="btn btn-outline"
              on:click={() => authenticateWithCircles("circles.land")}
              >Login with Circles</button
            >
          {:else}
            <p>
              Please wait ..<br />
              We're logging you in.
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div> -->
