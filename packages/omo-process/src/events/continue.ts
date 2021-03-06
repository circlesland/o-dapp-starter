import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

/**
 * Can be used as a generic trigger event or as response to a 'Prompt'.
 */
export class Continue implements OmoEvent {
  type: OmoEventTypes = "process.continue";
  data?: {
    [key: string]: any
  }
}
