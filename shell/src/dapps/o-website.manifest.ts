import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-website/pages/Home.svelte";
import Imprint from "./o-website/pages/Imprint.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const home : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["index"],
  component: Home,
  title: "Home",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const imprint : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["imprint"],
  component: Imprint,
  title: "Imprint",
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

export const website : DappManifest<DappState> = {
  dappId: "website:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faPeopleArrows,
  title: "Website",
  routeParts: ["website"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  actions: [],
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: home,
      cancelDependencyLoading: false
    };
  },
  pages: [home, imprint]
};