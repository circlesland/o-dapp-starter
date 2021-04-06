<script lang="ts">
  import {onMount} from "svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>
<br/>
Graph<br/>
<br/>