import { ProcessEvent } from "./processEvent";
import { OmoEvent } from "@o-platform/o-events/dist/omoEvent";
import {Bubble} from "../events/bubble";
import {Observable} from "rxjs";

/**
 * Provides a connection to a running process.
 * The process provides its events via the 'events'-property
 * and you can send events to the process via 'sendEvents()'.
 *
 * The events from the process have additional properties
 * that indicate the current state of the process.
 */
export interface Process {
  /**
   * A unique process id.
   */
  id: number;
  /**
   * The process' out-stream.
   */
  events: Observable<ProcessEvent>;
  /**
   * Stores the last received Bubble-event for the use with the 'sendAnswer' function
   */
  lastReceivedBubble?:Bubble;
  /**
   * The process' in-stream.
   */
  sendEvent(event: OmoEvent) : void;

  sendAnswer(answer:OmoEvent) : void;
}
