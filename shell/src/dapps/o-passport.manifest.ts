import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-passport/pages/Home.svelte";
import Account from "./o-passport/pages/Account.svelte";
import Keys from "./o-passport/pages/Keys.svelte";
import Settings from "./o-passport/pages/Settings.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const index : PageManifest = {
  isDefault: true,
  routeParts: ["profile"],
  component: Home,
  title: "Profile",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const account : PageManifest = {
  isDefault: false,
  routeParts: ["account"],
  component: Account,
  title: "Account",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const keys : PageManifest = {
  isDefault: false,
  routeParts: ["keys"],
  component: Keys,
  title: "Keys",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const settings : PageManifest = {
  isDefault: false,
  routeParts: ["settings"],
  component: Settings,
  title: "Settings",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const exchangeToken : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["exchangeToken", ":jwt"],
  component: Home,
  title: "Login",
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

export const passport : DappManifest<DappState> = {
  dappId: "passport:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Passport",
  routeParts: ["passport"],
  tag: Promise.resolve("alpha"),
  actions: [],
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false
    };
  },
  pages: [index, account, keys, settings, exchangeToken]
};