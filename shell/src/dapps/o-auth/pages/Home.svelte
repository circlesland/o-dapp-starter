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
  import { Process } from "@o-platform/o-process/dist/interfaces/process";
  import { Generate } from "@o-platform/o-utils/dist/generate";

  let devHome = true;
  let devDash = false;
  let runningProcess: Process;

  export let params: {
    code: string;
  };

  $: {
    if (params && params.code) {
      authenticateWithCircles("circles.land", params.code);
    } else if (localStorage.getItem("circles.session")) {
      window.location = <any>"/#/dashboard";
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
