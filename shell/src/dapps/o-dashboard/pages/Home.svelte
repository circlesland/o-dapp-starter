<script lang="ts">
  import { dapps } from "../../../loader";
  import { dashboard } from "../../o-dashboard.manifest";
  import { onMount } from "svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/#/passport/profile";
    }
  });

  function buyXats() {
    window.o.publishEvent(
      dashboard.actions.find((o) => o.key == "xats").event(undefined)
    );
  }
</script>

<div
  class="w-full mt-4 h-72 bg-center bg-no-repeat bg-cover"
  style="background-image: url('https://images.unsplash.com/photo-1609343007774-dad98a8f8c33?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1225&q=80');"
>
  <div
    class="w-full h-72 bg-opacity-50 bg-black flex justify-center items-center relative"
  >
    <div class="mx-4 text-center text-white">
      <h1 class="font-bold text-6xl mb-4">Xats is what you need!</h1>
      <h2 class="font-bold text-3xl mb-12">Xats is what you want!</h2>
    </div>
    <div class="absolute bottom-4">
      <button class="btn btn-accent" on:click={() => buyXats()}
        >buy Xats now</button
      >
    </div>
  </div>
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
