import {DappManifest} from "./dappManifest";
import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
import {Topic} from "@o-platform/o-utils/dist/eventBroker";
import {StatePropagation} from "./statePropagation";
import {DappState} from "./dappState";
import {Signal} from "@o-platform/o-events/dist/signals/signal";
import {OmoBehaviorSubject} from "@o-platform/o-dependencies/dist/OmoBehaviorSubject";

export interface RuntimeDapp<TState extends DappState> extends DappManifest<TState>
{
  runtimeId:string,
  route: string,

  // shell: Shell,

  /**
   * Used by the auth to receive incoming events.
   */
  inEvents?:Topic<OmoEvent>,
  /**
   * Used by the auth to send outgoing events for other dapps to subscribe.
   */
  outEvents?:Topic<OmoEvent>,


  state: OmoBehaviorSubject<StatePropagation<TState>>

  emitSignal: (signal:Signal) => void;
  emitState: (state:TState) => void;
}
