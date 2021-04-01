import {OmoEvent} from "omo-events/dist/omoEvent";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";
import {Process} from "omo-process/dist/interfaces/process";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import ApolloClient, {DefaultOptions} from "apollo-client";
import {NormalizedCacheObject} from "apollo-cache-inmemory";

export interface Shell {
  contactUsername?: string;
  graphQLClient?: ApolloClient<NormalizedCacheObject>,
  lastError?: any;
  events?: OmoSubject<OmoEvent>,
  publishEvent?: (event: OmoEvent) => void,
  stateMachines: {
    run<TContext>(definition: ProcessDefinition<any,any>, contextModifier?: (processContext: ProcessContext<any>) => Promise<TContext>) : Promise<Process>
  }
}
