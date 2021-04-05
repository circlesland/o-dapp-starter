<script lang="ts">
  import {ChoiceSelectorContext} from "./choiceSelectorContext";
  import {Continue} from "@o-platform/o-process/dist/events/continue";

  export let context: ChoiceSelectorContext;

  function sendAnswer(selected:{key:string, label:string}) {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = selected;
    context.data[context.fieldName] = selected;
    context.process.sendAnswer(event);
  }
</script>

<p>
  Hello Worlds: {context.params.label}
</p>
{#each context.params.choices as choice}
  <button
          on:click={() => sendAnswer(choice)}
          class="btn btn-outline btn-secondary btn-block"
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
    {choice.label}
  </button>
{/each}