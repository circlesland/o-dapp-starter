<script lang="ts">
  import {onMount} from "svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>

<div class="p-16 mt-4 text-center bg-white rounded-t-xl md:rounded-xl">
  BALANCE
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">TRANSACTION ITEM</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">TRANSACTION ITEM</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">TRANSACTION ITEM</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">TRANSACTION ITEM</div>
