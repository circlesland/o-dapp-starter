<script lang="ts">
  import { dapps } from "../../../loader";
</script>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">DASHBOARD</div>

<div class="p-8 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Featured xATS TokenSale Campaign
  <button class="btn">buy now</button>
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Welcome Home, Martin! This is your dashboard and door into the CirclesLAND
  universe.
</div>

<div class="flex space-x-4">
  {#each dapps.filter((o) => !o.isHidden) as dapp}
    <div class="p-12 mt-4 bg-white rounded-t-xl md:rounded-xl">
      <a
        href="/#/{dapp.routeParts.join('/') +
          '/' +
          dapp.pages[0].routeParts.join('/')}">{dapp.title} Dapp</a
      ><br />
    </div>
  {/each}
  <div class="p-12 mt-4 bg-white rounded-t-xl md:rounded-xl">
    <a href="#" class="text-gray-400">Market Dapp<br />(coming soon)</a><br />
  </div>
</div>

<div class="flex space-x-4">
  <div class="p-12 mt-4 bg-white rounded-t-xl md:rounded-xl">
    <a href="#" class="text-gray-400">Chat Dapp<br />(coming soon)</a>
  </div>
</div>
