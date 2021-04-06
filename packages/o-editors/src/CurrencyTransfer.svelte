<script lang="ts">
  import {Continue} from "@o-platform/o-process/dist/events/continue";
  import {CurrencyTransferContext} from "./currencyTransferContext";

  export let context: CurrencyTransferContext;
  let amount:string = "0";

  function sendAnswer(amount:string, selected:{key:string, label:string}) {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = {
      amount: amount,
      currency: selected
    }
    context.data[context.fieldName] = selected;
    context.process.sendAnswer(event);
  }
</script>

<p>
  {context.params.label}
</p>
<div class="flex space-x-2 w-full">
  <input type="text" bind:value={amount}>
  {#each context.params.currencies as currency}
    <button
            on:click={() => sendAnswer(amount, currency)}
            class="btn btn-outline"
    >
      <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-6 h-6 ml-2 stroke-current"
      >
        <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
        />
      </svg>
      Send {currency.label}
    </button>
  {/each}
</div>