import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Transactions from "./o-banking/pages/Transactions.svelte";
import Tokens from "./o-banking/pages/Tokens.svelte";
import Trusts from "./o-banking/pages/Trusts.svelte";
import Graph from "./o-banking/pages/Graph.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const transactions : PageManifest = {
  isDefault: true,
  routeParts: ["transactions"],
  component: Transactions,
  title: "Transactions",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const tokens : PageManifest = {
  isDefault: true,
  routeParts: ["tokens"],
  component: Tokens,
  title: "Tokens",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const trusts : PageManifest = {
  isDefault: true,
  routeParts: ["trusts"],
  component: Trusts,
  title: "Trusts",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const graph : PageManifest = {
  isDefault: true,
  routeParts: ["graph"],
  component: Graph,
  title: "Graph",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};


export interface DappState {
  // put state here
}

export const banking : DappManifest<DappState> = {
  dappId: "banking:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Circles banking",
  routeParts: ["banking"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: transactions,
      cancelDependencyLoading: false
    };
  },
  pages: [transactions, tokens, trusts, graph]
};