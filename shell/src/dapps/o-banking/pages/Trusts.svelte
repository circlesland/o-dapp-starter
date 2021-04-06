<script lang="ts">
  import {onMount} from "svelte";

  onMount(() => {
    if (!localStorage.getItem("circles.session")) {
      window.location = <any>"/";
    }
  });

  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "../../../shared/processes/shellProcess";
  import {transfer} from "../processes/transfer";
  import {setTrust} from "../processes/setTrust";

  function execTransfer(recipientAddress?:string) {
    window.o.publishEvent(new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = transfer;
        ctx.childContext = {
          data: {
            recipientAddress
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      }));
  }
  function execTrust(recipientAddress?:string) {
    window.o.publishEvent(new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 100,
            trustReceiver: recipientAddress
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      }));
  }
  function execUntrust(recipientAddress?:string) {
    window.o.publishEvent(new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 0,
            trustReceiver: recipientAddress
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      }));
  }
</script>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">TRUSTS</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  NEW INCOMING TRUST
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Name 1 <button class="btn" on:click={() => execTransfer("this-guys-address")}>send money</button>
  <button class="btn"
          on:click={() => execTrust("this-guys-address")}>trust back</button>
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">MUTUTAL TRUST</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Name 2 <button class="btn" on:click={() => execTransfer("this-guys-address")}>send money</button><button class="btn"
    on:click={() => execUntrust("this-guys-address")} >remove trust</button
  >
</div>
<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">TRUSTED BY YOU</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Name 3 <button class="btn" on:click={() => execTransfer("this-guys-address")}>send money</button>
  <button class="btn"
    on:click={() => execUntrust("this-guys-address")}>remove trust</button
  >
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">REMOVED TRUST</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  Name 4 <button class="btn" on:click={() => execTransfer("this-guys-address")}>send money</button>
  <button class="btn"
          on:click={() => execTrust("this-guys-address")}>add trust</button
  >
</div>
