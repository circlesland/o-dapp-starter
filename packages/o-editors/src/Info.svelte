<script lang="ts">
    import {Process} from "@o-platform/o-process/dist/interfaces/process";
    import {Back} from "@o-platform/o-process/dist/events/back";
    import {Skip} from "@o-platform/o-process/dist/events/skip";
    import {Continue} from "@o-platform/o-process/dist/events/continue";

    export let name:string;
    export let context: {
        process: Process,
        fieldName: string,
        data: {
            [x:string]:any
        },
        params: {
            label: string
        }
    }
</script>
{context.params.label}: <br/>
{#if context.fieldName}
    <input style="border:solid 1px gray;" type="text" bind:value={context.data[context.fieldName]} /><br/>
{:else}
    - not available -
{/if}

<button on:click={() => context.process.sendAnswer(new Back())}>&lt; Go back</button> |
<button on:click={() => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
}}>[ Submit ]</button> |
<button on:click={() => context.process.sendAnswer(new Skip())}>Skip &gt;</button>
<br/><br/>
Current context.data: <br/>
<pre>
    {JSON.stringify(context.data, undefined, 2)}
</pre><br/>