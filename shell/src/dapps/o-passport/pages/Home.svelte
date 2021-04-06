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
  import { upsertIdentity } from "../processes/upsertIdentity";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import {onMount} from "svelte";

  export let params: {
    jwt: string;
  };

  $: {
    if (params && params.jwt) {
      // TODO: Verify the token and extract the e-mail address
      connectOrCreateKey(params.jwt);
      params.jwt = null;
    } else {
      if (!localStorage.getItem("circles.session") && localStorage.getItem("circles.key")) {
        createOrUpdateIdentity();
      } else {
        window.location = <any>"/";
      }
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

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  PASSPORT<br />
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  image <br />
  first name<br />
  last name<br />
  safeaddress<br />
</div>
