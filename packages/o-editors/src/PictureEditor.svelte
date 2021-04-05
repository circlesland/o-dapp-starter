<script lang="ts">
  import {EditorContext} from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";

  export let context: EditorContext;
</script>
<br/>
Picture Editor<br/>
<br/>
<ProcessNavigation {context} />