<script lang="ts">
    import {Process} from "omo-process/dist/interfaces/process";
    import Info from "./Info.svelte";

    export let context: {
        process: Process,
        fieldName: string,
        data: {
            [x: string]: any
        },
        params: {
            label: string
        }
    }
</script>
<Info context={context} name="TextEditor" />