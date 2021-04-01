import { OmoEvent } from "@o-platform/o-events/dist/omoEvent";
import { OmoEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class Success implements OmoEvent {
  type: OmoEventTypes = "process.success";
  result: any;
}
