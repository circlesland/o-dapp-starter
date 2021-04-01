<script lang="ts">
  import {onDestroy, onMount} from "svelte";
  import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
  import {ProgressSignal} from "@o-platform/o-events/dist/signals/progressSignal";
  import {OmoSubscription} from "@o-platform/o-dependencies/dist/OmoSubscription";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  let progressIndicator: { message: string, percent: number };
  let subscription: OmoSubscription;

  onMount(() => {
    subscription = window.o.events.subscribe((event: OmoEvent) => {
      if (event.type === "shell.begin") {
      }
      if (event.type === "shell.done") {
        progressIndicator = null;
      }
      if (event.type === "shell.progress") {
        const progressEvent: ProgressSignal = <ProgressSignal>event;
        progressIndicator = {
          message: progressEvent.message,
          percent: progressEvent.percent
        }
      }
    });
  });

  onDestroy(() => {
    if (subscription)
      subscription.unsubscribe();
  });
</script>

<div class="flex items-center justify-center">
  <div>
    <LoadingSpinner />
    {#if progressIndicator}
      <div class="text-sm text-center text-primary foont-primary">
        {progressIndicator.message}
      </div>
    {/if}
  </div>
</div>

