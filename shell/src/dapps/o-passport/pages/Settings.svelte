<script lang="ts">
  import {onMount} from "svelte";
  import PassportHeader from "../atoms/PassportHeader.svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>

<PassportHeader />
<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  SETTINGS<br />
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">email address</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">newsletter</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">tos</div>
