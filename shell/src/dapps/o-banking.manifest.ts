import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-banking/pages/Home.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const index : PageManifest = {
  isDefault: true,
  routeParts: [""],
  component: Home,
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
      initialPage: index,
      cancelDependencyLoading: false
    };
  },
  pages: [index]
};