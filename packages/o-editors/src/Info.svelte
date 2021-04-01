<script lang="ts">
    import {Process} from "omo-process/dist/interfaces/process";
    import {Back} from "omo-process/dist/events/back";
    import {Skip} from "omo-process/dist/events/skip";
    import {Continue} from "omo-process/dist/events/continue";

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
Hello from ={name}.svelte= for field: {context.fieldName}<br/>
<br>

== Your options: ===<br/>
&gt; <button on:click={() => context.process.sendAnswer(new Back())}>Go back</button><br/>
&gt; <button on:click={() => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
}}>Submit</button><br/>
&gt; <button on:click={() => context.process.sendAnswer(new Skip())}>Skip</button><br/>
<br>

== Some infos: ===<br>
Current field value (editable): <br/>
{#if context.fieldName}
    <input style="border:solid 1px gray;" type="text" bind:value={context.data[context.fieldName]} /><br/>
{:else}
    - not available -
{/if}

Current context.params: <br/>
<pre>
    {JSON.stringify(context.params)}
</pre><br/>

Current context.data: <br/>
<pre>
    {JSON.stringify(context.data)}
</pre><br/>