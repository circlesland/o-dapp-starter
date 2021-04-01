import {bubble} from "./bubble";
import {Prompt} from "omo-process/dist/events/prompt";

/**
 * Bubbles a 'process.prompt' event in order to show the specified component to the user.
 * @param spec
 */
export function show(spec: {
  passDataByReference?:boolean, // If the value of 'context.data' should be passed by reference (default: no)
  fieldName?:string,
  component: any,
  params?: {
    [x: string]: any
  }
}) {
  return bubble((context) => <Prompt>{
    type: "process.prompt",
    fieldName: spec.fieldName,
    component: spec.component,
    data: spec.passDataByReference ? context.data : JSON.parse(JSON.stringify(context.data)),
    params: spec.params
  });
}