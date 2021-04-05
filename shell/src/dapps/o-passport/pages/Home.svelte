<script lang="ts">
  import {createOrRestoreKey} from "../processes/createOrRestoreKey";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import Error from "../../../shared/atoms/Error.svelte";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";

  export let params: {
    jwt: string;
  };

  $: {
    if (params && params.jwt) {
      // TODO: Verify the token and extract the e-mail address
      connectOrCreateKey(params.jwt);
    }
  }

  function connectOrCreateKey(jwt?: string) {
    const sub = jwt//.sub; //TODO: Get email from jwt
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
      ctx.childProcessDefinition = createOrRestoreKey;
      ctx.childContext = {
        data: {
          loginEmail: sub
        },
        dirtyFlags: {},
        environment: {
          errorView: Error,
          progressView: LoadingIndicator,
          successView: Success,
        },
      };
      return ctx;
    });

    window.o.publishEvent(requestEvent);
  }
</script>

<div class="grid grid-cols-1 p-2">
  <h1>PASSPORT</h1>
  <!--
  <div class="flex h-screen ">
    <div class="m-auto grid">
      <img
        class="inline m-auto w-12 h-12 -mb-6 z-30"
        src="/images/common/circles.png"
        alt="circles.land"
      />
      <div class="card shadow bg-white z-0">
        <div class="card-body">
          {#if !params || !params.jwt}
            <h1 class="mb-4 justify-self-left">Hi!</h1>
            <div class="mb-4">Click the Button below to login with Circles</div>
            <button
              class="btn btn-outline"
              on:click={() => connectOrCreateKey("circles.land")}>
              Create Passport
            </button>
          {:else}
            <p>
              Please wait ..<br />
              We're creating your passport.
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>-->
</div>