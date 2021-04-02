<script lang="ts">
    import {Back} from "@o-platform/o-process/dist/events/back";
    import {Skip} from "@o-platform/o-process/dist/events/skip";
    import {Continue} from "@o-platform/o-process/dist/events/continue";
    import {Context} from "./context";

    export let context: Context;
</script>
{context.params.label}: <br/>
{#if context.fieldName}
    <input style="border:solid 1px gray;" type="text" bind:value={context.data[context.fieldName]} /><br/>
{:else}
    - not available -
{/if}

{#if context.canGoBack}
<button on:click={() => context.process.sendAnswer(new Back())}>&lt; Go back</button> |
{/if}
<button on:click={() => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
}}>[ Submit ]</button>
{#if context.canSkip}
| <button on:click={() => context.process.sendAnswer(new Skip())}>Skip &gt;</button>
{/if}
<br/><br/>
Current context.data: <br/>
<pre>
    {JSON.stringify(context.data, undefined, 2)}
</pre><br/>