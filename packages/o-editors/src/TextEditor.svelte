<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";

  export let context: EditorContext;
</script>

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

<ProcessNavigation {context} />
