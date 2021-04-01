import {DappManifest} from "./dappManifest";
import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
import {Topic} from "@o-platform/o-utils/dist/eventBroker";
import {StatePropagation} from "./statePropagation";
import {Signal} from "@o-platform/o-events/dist/signals/signal"
import {BehaviorSubject} from "rxjs";

export interface RuntimeDapp<TState extends {[x:string]:any}> extends DappManifest<TState>
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


  state: BehaviorSubject<StatePropagation<TState>>

  emitSignal: (signal:Signal) => void;
  emitState: (state:TState) => void;
}
