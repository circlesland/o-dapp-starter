<script lang="ts">
  import Select from "svelte-select";
  import { ChoiceSelectorContext } from "./choiceSelectorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  export let context: ChoiceSelectorContext;

	let selected = undefined;
	
	function handleSelect(event) {
		selected = event.detail;
	}

  function submit() {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = selected;
    context.data[context.fieldName] = selected;
    context.process.sendAnswer(event);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submit();
    }
  }

</script>

<div class="form-control justify-self-center">
<div  class="dropdown-select-editor flex flex-wrap content-end w-full h-60">

  <div class="w-full">
    <label class="label" for={context.fieldName}>
    <span class="label-text">{context.params.label}</span>
  </label>
</div>
  <Select items={context.params.choices} on:select={handleSelect} showChevron={true} listAutoWidth={false} listPlacement='top' containerClasses="w-80 min-w-full"></Select>

</div>
</div>
<ProcessNavigation on:buttonClick={submit} {context} />

<style>
  .dropdown-select-editor {
    --listMaxHeight: 200px;
    --listMaxWidth: 10rem;
  }
</style>
