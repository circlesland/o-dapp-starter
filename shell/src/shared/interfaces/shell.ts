import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
import {OmoSubject} from "@o-platform/o-dependencies/dist/OmoSubject";
import {Process} from "@o-platform/o-process/dist/interfaces/process";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import ApolloClient from "apollo-client";
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
