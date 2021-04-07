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
  import { Generate } from "@o-platform/o-utils/dist/generate";

  export let params: {
    code: string;
  };

  $: {
    if (params) {
      authenticateWithCircles("circles.land", params.code);
    } else {
      authenticateWithCircles("circles.land");
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
