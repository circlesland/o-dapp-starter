<script lang="ts">
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import {HtmlViewerContext} from "./htmlViewerContext";

  export let context: HtmlViewerContext;
</script>

{@html context.params.html}

<ProcessNavigation {context} />