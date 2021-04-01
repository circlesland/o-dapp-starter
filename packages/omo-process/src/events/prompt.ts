import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

/**
 * Can be used to ask for user input or to display status information.
 */
export class Prompt implements OmoEvent {
  type: OmoEventTypes = "process.prompt";

  fieldName?:string;

  /**
   * The component that should be displayed during a state.
   */
  component:any;

  /**
   * The data that should be edited (if any).
   */
  data:{[x:string]:any} = {};
  /**
   * The component specific params.
   */
  params:{[x:string]:any} = {};
}
