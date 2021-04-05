<script lang="ts">
  import { createOrRestoreKey } from "../processes/createOrRestoreKey";
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

  let runningProcess: Process;
  import { upsertIdentity } from "../processes/upsertIdentity";
  import { Generate } from "@o-platform/o-utils/dist/generate";

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
    const sub = jwt; //.sub; //TODO: Get email from jwt
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = createOrRestoreKey;
        ctx.childContext = {
          data: {
            loginEmail: sub,
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

    window.o.publishEvent(requestEvent);
  }

  function createOrUpdateIdentity() {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = upsertIdentity;
        ctx.childContext = {
          data: {
            loginEmail: "TODO",
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

<div class="w-full mx-auto mb-20 md:w-2/3 xl:w-1/2 rounded-t-xl md:rounded-xl">
  <div class="p-4 mt-4 bg-white">Profile Component</div>
</div>

<div class="font-primary">
  {#if runningProcess}
    <ProcessContainer
      process={runningProcess}
      on:stopped={() => {
        isOpen = false;
        runningProcess = null;
      }}
    />
  {/if}
</div>
