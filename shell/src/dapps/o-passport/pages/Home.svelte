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
  import { onMount } from "svelte";

  export let params: {
    jwt: string;
  };

  $: {
    if (params && params.jwt) {
      // TODO: Verify the token and extract the e-mail address
      connectOrCreateKey(params.jwt);
      params.jwt = null;
    } else {
      if (
        !localStorage.getItem("circles.session") &&
        localStorage.getItem("circles.key")
      ) {
        createOrUpdateIdentity();
      } else if (!localStorage.getItem("circles.key")) {
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

<div class="grid grid-cols-1 ">
  <main class="flex-grow">
    <div class="flex items-center w-full px-4 py-10 bg-cover card rounded-none">
      <div class="card glass lg:card-side text-neutral-content">
        <figure class="p-6">
          <div class="form-control">
            <div class="avatar m-auto">
              <div class="rounded-full w-32 h-32">
                <img src="https://i.pravatar.cc/500?img=32" />
              </div>
            </div>
          </div>
        </figure>
        <div class="max-w-md card-body">
          <h2 class="card-title">Dr. Maria Eduard</h2>
          <h2 class="card-title">von Brunsheim</h2>
          <small class="break-all">
            0x87asdgt9adsofz98ad6fs8as7odft9aszf98pasdzfasdg
          </small>

          <div class="card-actions self-center">
            <button class="btn glass rounded-full">Profil Bearbeiten</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
