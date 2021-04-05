<script lang="ts">
  import ProcessNavigation from "./ProcessNavigation.svelte";
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

{#each context.params.choices as choice}
  <button
          on:click={() => sendAnswer(choice)}
          className="btn btn-outline btn-secondary btn-block"
  >
    <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 ml-2 stroke-current"
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

<ProcessNavigation {context} />