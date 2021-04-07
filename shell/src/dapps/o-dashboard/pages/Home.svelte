<script lang="ts">
  import { dapps } from "../../../loader";
  import { dashboard } from "../../o-dashboard.manifest";
  import { onMount } from "svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });

  function buyXats() {
    window.o.publishEvent(
      dashboard.actions.find((o) => o.key == "xats").event(undefined)
    );
  }
</script>

<div
  class="w-full  h-72 bg-center bg-no-repeat bg-cover"
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
      <button class="btn btn-primary" on:click={() => buyXats()}
        >buy Xats now</button
      >
    </div>
  </div>
</div>
<div class="p-4 bg-white">
  Welcome Home, Martin! <br />
  This is your dashboard and door into the CirclesLAND universe.
</div>

<div class="p-2  mt-4 md:p-0">
  <div class="flex space-x-4 flex-wrap">
    <div class="card mt-4 shadow-lg flex-1 compact bg-base-100">
      <a href="/#/passport/profile">
        <figure><img src="https://picsum.photos/id/1005/600/400" /></figure>
        <div class="flex-row items-center space-x-4 card-body">
          <div>
            <h2 class="card-title justify-self-center">Passport</h2>
          </div>
        </div>
      </a>
    </div>
    <div class="card mt-4 shadow-lg flex-1 compact bg-base-100">
      <a href="/#/banking/transactions">
        <figure><img src="https://picsum.photos/id/1005/600/400" /></figure>
        <div class="flex-row items-center space-x-4 card-body">
          <div>
            <h2 class="card-title justify-self-center">Banking</h2>
          </div>
        </div>
      </a>
    </div>

    <!-- {#each dapps.filter((o) => !o.isHidden) as dapp}
      <div class="p-12 h-48 flex-1 mt-4 bg-white rounded-xl">
        <a
          href="/#/{dapp.routeParts.join('/') +
            '/' +
            dapp.pages[0].routeParts.join('/')}">{dapp.title} Dapp</a
        >
      </div>
    {/each} -->
  </div>
  <div class="flex mt-4 space-x-4">
    <div class="card mt-4 shadow-lg flex-1 compact bg-base-100">
      <figure><img src="https://picsum.photos/600/400" /></figure>
      <div class="flex-row items-center space-x-4 card-body">
        <div>
          <h2 class="card-title justify-self-center">Market</h2>
          <p class="text-base-content text-opacity-40">coming soon</p>
        </div>
      </div>
    </div>
    <div class="card mt-4 shadow-lg flex-1 compact bg-base-100">
      <figure><img src="https://picsum.photos/600/400" /></figure>
      <div class="flex-row items-center space-x-4 card-body">
        <div>
          <h2 class="card-title justify-self-center">Chat</h2>
          <p class="text-base-content text-opacity-40">coming soon</p>
        </div>
      </div>
    </div>
  </div>
</div>
