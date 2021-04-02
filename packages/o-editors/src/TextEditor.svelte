<script lang="ts">
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { EditorContext } from "./editorContext";

  export let context: EditorContext;
</script>

{#if context.fieldName}
  <div class="form-control justify-self-center">
    <label class="label" for={context.fieldName}>
      <span class="label-text">{context.params.label}</span>
    </label>
    <input
      id={context.fieldName}
      type="text"
      placeholder={context.params.placeholder}
      class="input input-lg input-bordered"
      bind:value={context.data[context.fieldName]}
    />
  </div>
{:else}
  - not available -
{/if}

<div
  class="flex mt-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 flex-col md:flex-row"
>
  {#if context.canGoBack}
    <div class="flex-1 ">
      <button
        on:click={() => context.process.sendAnswer(new Back())}
        class="btn btn-secondary btn-block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-6 h-6 ml-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Go back</button
      >
    </div>
  {/if}
  <div class="flex-1">
    <button
      on:click={() => {
        const answer = new Continue();
        answer.data = context.data;
        context.process.sendAnswer(answer);
      }}
      class="btn btn-primary btn-block"
      >Submit
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block w-6 h-6 ml-2 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>

  {#if context.canSkip}
    <div class="flex-1">
      <button
        on:click={() => context.process.sendAnswer(new Skip())}
        class="btn btn-outline btn-secondary btn-block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-6 h-6 mr-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Skip
      </button>
    </div>
  {/if}
</div>
<div>
  <small>
    Current context.data: <br />
    <pre>
    {JSON.stringify(context.data, undefined, 2)}
    </pre>
  </small>
</div>
