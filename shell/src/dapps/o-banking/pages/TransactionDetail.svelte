<script lang="ts">
  import {onMount} from "svelte";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";


  export let params: {
    from: string
    to: string
    blockNo?: string
  };

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>
<BankingDetailHeader />
Transaction detail page for <br/>
From: {params.from}<br/>
To: {params.to}<br/>
Block: {params.blockNo}<br/>
