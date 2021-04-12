<script lang="ts">
  import {onMount} from "svelte";
  import BankingDetailHeader from "../atoms/BankingDetailHeader.svelte";

  export let params:{
    symbol:string
  };

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>
<BankingDetailHeader />
Token detail page for "{params.symbol}"