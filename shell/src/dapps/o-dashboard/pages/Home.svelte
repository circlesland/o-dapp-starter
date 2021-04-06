<script lang="ts">

  import {dapps} from "../../../loader";
  import {getLastLoadedDapp} from "../../../loader";
</script>
<br/>
Dashboard:<br/>
<br/>

{#each dapps.filter(o => !o.isHidden) as dapp}
  <a href="/#/{dapp.routeParts.join('/') + '/' + dapp.pages[0].routeParts.join('/')}">{dapp.title}</a><br/>
{/each}