<script lang="ts">
  import {authenticate} from "../processes/authenticate";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "../../../shared/processes/shellProcess";
  import Error from "../../../shared/atoms/Error.svelte";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";

  export let params:{
    code:string
  };

  $:{
    if (params && params.code) {
      authenticateWithCircles("circles.land", params.code);
    }
  }

  function authenticateWithCircles(appId:string, code?:string) {
    window.o.publishEvent(new RunProcess<ShellProcessContext>(shellProcess, async ctx => {
      ctx.childProcessDefinition = authenticate;
      ctx.childContext = {
        data: {
          appId: appId,
          code: code
        },
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
</script>
{#if !params || !params.code}
  Hi!<br/>
  <br/>
  Click the Button below to login with Circles<br/>
  <button on:click={() => authenticateWithCircles("circles.land")}>Login with Circles</button>
{:else}
  Please wait ..<br/>
  We're logging you in.
{/if}