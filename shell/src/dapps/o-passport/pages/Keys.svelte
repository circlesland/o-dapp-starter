<script lang="ts">
  import {onMount} from "svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  ACCCESS KEYS<br />
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  My Seedphrase <br />
  word 1 word 2 word 3 word 4 word 5 word 6 .......... word 24
</div>
