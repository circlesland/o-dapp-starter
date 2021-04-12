<script lang="ts">
  import {onMount} from "svelte";
  import BankingHeader from "../atoms/BankingHeader.svelte";

  export let params:{
    symbol:string
  };

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });
</script>
<BankingHeader />
Token detail page for "{params.symbol}"