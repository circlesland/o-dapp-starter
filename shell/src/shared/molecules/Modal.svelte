<script lang="ts">
  // imports
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();
  // public props
  // export let triggerRef = undefined;
  export let isOpen = false;
  export let role = "dialog";
  // functions
  const handleClose = () => {
    dispatch("closeRequest");
  };
  const handleEsc = (e) => e.key === "Escape" && handleClose();
</script>

{#if isOpen}
  <aside
    on:keydown={handleEsc}
    aria-labelledby="modal-heading"
    aria-modal="true"
    tabIndex={-1}
    {role}
    in:fade
    out:fade
    on:click|self={handleClose}
    class="z-40 overlay"
  >
    <div
      class="w-full mb-20 bg-white md:w-2/3 xl:w-1/2 rounded-t-xl md:rounded-xl"
    >
      <div class="p-4 space-y-2 md:p-8">
        <div class="flex">
          <div class="w-full m-auto">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </aside>
{/if}

<style>
  * {
    box-sizing: border-box;
  }
  aside {
    /* z-index: 1000; */
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow-y: hidden;
  }
</style>
