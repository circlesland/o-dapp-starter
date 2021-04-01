import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Main from "./views/pages/Main.svelte";
import {PageManifest} from "omo-kernel-interfaces/dist/pageManifest";
import {DappManifest} from "omo-kernel-interfaces/dist/dappManifest";

const index : PageManifest = {
  isDefault: true,
  routeParts: ["main"],
  component: Main,
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

export const dapp : DappManifest<DappState> = {
  dappId: "dapp:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Dapp 1",
  routeParts: ["dapp1"],
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
