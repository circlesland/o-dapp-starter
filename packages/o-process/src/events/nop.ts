import { OmoEvent } from "@o-platform/o-events/dist/omoEvent";
import { OmoEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class Nop implements OmoEvent {
  type: OmoEventTypes = "process.nop";
}
