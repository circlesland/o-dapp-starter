<script lang="ts">
  import {Process} from "omo-process/dist/interfaces/process";
  import {Prompt} from "omo-process/dist/events/prompt";
  import {Continue} from "omo-process/dist/events/continue";

  export let process: Process;
  export let prompt: Prompt;

  let componentContext: {
    fieldName: string,
    data: {[x:string]:any},
    params: {[x:string]:any},
    process: Process
  }|null;

  $:{
    // Whenever the prompt changes ('prompt' is set from outside by it's parent ProcessContainer molecule):
    if (prompt) {
      console.log("Prompt.svelte got a 'prompt':", prompt);
      componentContext = {
        process: process,
        fieldName: prompt.fieldName,
        data: prompt.data,
        params: prompt.params
      }
    } else {
      componentContext = null;
    }
  }

  function sendAnswer()
  {
    process.sendAnswer(<Continue>{
      type: "process.continue",
      data: prompt.data
    });
  }
</script>

Hi! I'm the Prompt that's displayed whenever a process wants to communicate with a user. My conent follows below:<hr/>
{#if componentContext}
  <svelte:component
    this={prompt.component}
    context={componentContext} />
{:else}
  Hmm... Nothing to display here. Seems like the 'prompt' attribute of the Prompt.svelte component is not set.<br/>
{/if}
