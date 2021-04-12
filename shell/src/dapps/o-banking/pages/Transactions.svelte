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

<div class="mx-4 mt-4">
  <section
    class="flex items-center justify-center mb-2 text-circlesdarkblue -mt-10"
  >
    <div
      class="flex items-center bg-white shadow px-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 py-2 pt-2 text-center">
        <div
          class="block rounded-t overflow-hidden bg-white text-center w-12 sm:w-24"
        >
          <div class="bg-red text-white py-1">Apr</div>
          <div class="pt-1 border-l border-r">
            <span class="text-2xl sm:text-4xl font-bold">9</span>
          </div>
          <div
            class="pb-2 px-2 border-l border-r border-b rounded-b flex flex-col justify-between"
          >
            <span class="text-xs font-bold">2020</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-left space-x-2">
        <div class="flex items-left">
          <div class="avatar">
            <div class="rounded-full w-8 h-8 sm:w-12 sm:h-12 m-auto">
              <img src="/images/common/circles.png" />
            </div>
          </div>

          <a href="#/banking/transactions/samuel/daniel/123">
            <h2 class="text-2xl sm:text-5xl font-bold ml-4 underline">Samuel</h2>
          </a>
        </div>
        <p class="text-sm mt-4">time</p>
      </div>
      <div class="flex justify-end flex-1 text-transactionpositive text-2xl sm:text-3xl">
        <span>200.00</span>
      </div>
    </div>
  </section>

  <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
    <div
      class="flex items-center bg-white shadow px-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 py-2 pt-2 text-center">
        <div
          class="block rounded-t overflow-hidden bg-white text-center w-12 sm:w-24"
        >
          <div class="bg-red text-white py-1">Jan</div>
          <div class="pt-1 border-l border-r">
            <span class="text-2xl sm:text-4xl font-bold">1</span>
          </div>
          <div
            class="pb-2 px-2 border-l border-r border-b rounded-b flex flex-col justify-between"
          >
            <span class="text-xs font-bold">2020</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-left space-x-2">
        <div class="flex items-left">
          <div class="avatar">
            <div class="rounded-full w-8 h-8 sm:w-12 sm:h-12 m-auto">
              <img src="https://i.pravatar.cc/500?img=12" />
            </div>
          </div>

          <h2 class="text-2xl sm:text-5xl font-bold ml-4">Thorsten</h2>
        </div>
        <p class="text-sm mt-4">xAts transfer</p>
      </div>
      <div
        class="flex justify-end flex-1 text-transactionnegative text-2xl sm:text-3xl"
      >
        <span>-24.00</span>
      </div>
    </div>
  </section>

  <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
    <div
      class="flex items-center bg-white shadow px-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 py-2 pt-2 text-center">
        <div
          class="block rounded-t overflow-hidden bg-white text-center w-12 sm:w-24"
        >
          <div class="bg-red text-white py-1">Feb</div>
          <div class="pt-1 border-l border-r">
            <span class="text-2xl sm:text-4xl font-bold">2</span>
          </div>
          <div
            class="pb-2 px-2 border-l border-r border-b rounded-b flex flex-col justify-between"
          >
            <span class="text-xs font-bold">2021</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-left space-x-2">
        <div class="flex items-left">
          <div class="avatar">
            <div class="rounded-full w-8 h-8 sm:w-12 sm:h-12 m-auto">
              <img src="https://i.pravatar.cc/500?img=42" />
            </div>
          </div>

          <h2 class="text-2xl sm:text-5xl font-bold ml-4">Inga</h2>
        </div>
        <p class="text-sm mt-4">3 Bier</p>
      </div>
      <div
        class="flex justify-end flex-1 text-transactionnegative text-2xl sm:text-3xl"
      >
        <span>10.50</span>
      </div>
    </div>
  </section>
</div>