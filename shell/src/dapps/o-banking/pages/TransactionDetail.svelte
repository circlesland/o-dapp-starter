<script lang="ts">
  import {onMount} from "svelte";
  import BankingHeader from "../atoms/BankingHeader.svelte";

  export let params:{
    from:string
    to:string
    blockNo?:string
  };

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>
<BankingHeader />
Transaction detail page for <br/>
From: {params.from}<br/>
To: {params.to}<br/>
Block: {params.blockNo}<br/>