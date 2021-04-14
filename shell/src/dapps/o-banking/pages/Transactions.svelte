<script lang="ts">
  import { onMount } from "svelte";
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { push } from "svelte-spa-router";
  import gql from "graphql-tag";

  onMount(async () => {
    const result = await window.o.theGraphClient.query({
      query: gql`query safe($id:String) {
                  safe(id: $id) {
                    balances {
                      token {
                        id
                      }
                      amount
                    }
                  }
                }`,
      variables: {
        id: "0x9a0bbbbd3789f184ca88f2f6a40f42406cb842ac"
      },
    });
    console.log(result);
  });

  function loadDetailPage(path) {
    push("#/banking/transactions/" + path);
  }
</script>

<BankingHeader />

<div class="mx-4 -mt-6">
  <section
    on:click|once={() => loadDetailPage("daniel/samuel/200")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="/images/common/circles.png" />
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">Samuel</h2>
        </div>
        <p class="text-sm mt-2">time</p>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionpositive text-2xl sm:text-3xl">
          <span>200.00</span>
        </div>
        <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div>
      </div>
    </div>
  </section>

  <section
    on:click|once={() => loadDetailPage("samuel/inga/30")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="https://i.pravatar.cc/500?img=42" />
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">Inga</h2>
        </div>
        <p class="text-sm mt-2">Brotschneidemaschine</p>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionnegative text-2xl sm:text-3xl">
          <span>30.00</span>
        </div>
        <div class="self-end mt-2 text-xs text-circleslightblue">
          2 weeks ago
        </div>
      </div>
    </div>
  </section>

  <section
    on:click|once={() => loadDetailPage("drfranz/samuel/0.89")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="https://i.pravatar.cc/500?img=12" />
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">
            Dr. Franziskus McCarthy
          </h2>
        </div>
        <p class="text-sm mt-2">+-*&^#$(@*&^#%!)#(&*%$&#*(</p>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionpositive text-2xl sm:text-3xl">
          <span>0.89</span>
        </div>
        <div class="self-end mt-2 text-xs text-circleslightblue">23.1.2021</div>
      </div>
    </div>
  </section>
</div>
