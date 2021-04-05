import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-identity/pages/Home.svelte";
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

export const identity : DappManifest<DappState> = {
  dappId: "identity:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Circles authentication",
  routeParts: ["identity"],
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