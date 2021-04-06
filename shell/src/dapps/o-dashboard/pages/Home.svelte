<script lang="ts">
  import { dapps } from "../../../loader";
  import {dashboard} from "../../o-dashboard.manifest";
  import {onMount} from "svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/#/passport/profile";
    }
  });

  function buyXats() {
    window.o.publishEvent(dashboard.actions.find(o => o.key == "xats").event(undefined));
  }
</script>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">DASHBOARD</div>

<div class="p-8 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Featured xATS TokenSale Campaign
  <button class="btn" on:click={() => buyXats()}>buy now</button>
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Welcome Home, Martin! This is your dashboard and door into the CirclesLAND
  universe.
</div>

<div class="flex space-x-4">
  {#each dapps.filter((o) => !o.isHidden) as dapp}
    <div class="p-12 mt-4 bg-white rounded-t-xl md:rounded-xl">
      <a
        href="/#/{dapp.routeParts.join('/') + '/' + dapp.pages[0].routeParts.join('/')}">{dapp.title} Dapp</a
      ><br />
    </div>
  {/each}
</div>
