<script lang="ts">
  import {onMount} from "svelte";
  import BankingHeader from "../atoms/BankingHeader.svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>
<BankingHeader />
<br/>
Graph<br/>
<br/>