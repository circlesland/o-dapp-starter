<script lang="ts">
  import {EditorContext} from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";

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

<div class="bordered mt-4">
  <div class="form-control">
    <label class="cursor-pointer label">
      <span class="label-text"
        >I have read and agree to the Terms of Service. <a
          href="#"
          target="_blank"
          class="underline">Cricles Land Terms</a
        ></span
      >
      <div>
        <input type="checkbox" class="checkbox checkbox" />
        <span class="checkbox-mark" />
      </div>
    </label>
  </div>
</div>


<div>
  <small>
    Current context.data: <br />
    <pre>
    {JSON.stringify(context.data, undefined, 2)}
    </pre>
  </small>
</div>

<ProcessNavigation {context} />