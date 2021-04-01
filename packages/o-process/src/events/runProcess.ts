import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";
import { ProcessDefinition } from "../interfaces/processManifest";
import { ProcessContext } from "../interfaces/processContext";

export class RunProcess<TContext extends ProcessContext<any>> implements PlatformEvent {
  type: PlatformEventTypes = "shell.runProcess";

  readonly definition: ProcessDefinition<any,any>;
  readonly contextModifier?: (processContext: TContext) => Promise<TContext>;

  constructor(definition: ProcessDefinition<any,any>, contextModifier?: (processContext: TContext) => Promise<TContext>) {
    this.definition = definition;
    this.contextModifier = contextModifier;
  }
}