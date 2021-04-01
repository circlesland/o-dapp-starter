import {actions, AnyEventObject} from "xstate";
import {IProcessContext} from "../interfaces/processContext";
const {escalate} = actions;

/**
 * A generic error state that escalates the error.
 */
export function errorState<TContext extends IProcessContext, TEvent extends AnyEventObject>() : {
error: {
    id:string,
    type:"final" | "atomic" | "compound" | "parallel" | "history",
    entry:any
}
} {
    return {
        error: {
            id: "error",
            type: 'final',
            entry: escalate((context:TContext, event: TEvent) =>  new Error(`Original error: ${JSON.stringify(event)}`))
        }
    }
}