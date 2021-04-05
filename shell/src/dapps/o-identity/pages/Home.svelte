<script lang="ts">
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "../../../shared/processes/shellProcess";
  import Error from "../../../shared/atoms/Error.svelte";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";
  import {Generate} from "@o-platform/o-utils/dist/generate";
  import {upsertIdentity} from "../processes/upsertIdentity";

  function execute() {

    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = upsertIdentity;
        ctx.childContext = {
          data: {
            loginEmail: "TODO"
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

    requestEvent.id = Generate.randomHexString(8);
    window.o.publishEvent(requestEvent);
  }

  function hasIdentity() {
  }
</script>
<br/>
My profile<br/>
<br/>
<br/>
<button on:click={() => {execute()}}>Upsert indentity</button>