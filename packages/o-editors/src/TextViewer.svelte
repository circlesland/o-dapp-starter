<script lang="ts">
  import {EditorContext} from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";

  export let context: EditorContext;
</script>

<div class="form-control justify-self-center">
  {context.data[context.fieldName]}
</div>

<ProcessNavigation {context} />