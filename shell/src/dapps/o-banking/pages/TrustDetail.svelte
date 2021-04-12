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
  import BankingHeader from "../atoms/BankingHeader.svelte";

  export let params:{
    trustPartner:string
  };

  function execTransfer(recipientAddress?: string) {
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

  function execTrust(recipientAddress?: string) {
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

  function execUntrust(recipientAddress?: string) {
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
<BankingHeader />
Your trust relation with: {params.trustPartner}