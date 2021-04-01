import { OmoEvent } from "@o-platform/o-events/dist/omoEvent";
import { OmoEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class ShellEvent implements OmoEvent {
  type: OmoEventTypes = "process.shellEvent";
  payload: OmoEvent;

  constructor(payload:OmoEvent)
  {
    this.payload = payload;
  }
}
