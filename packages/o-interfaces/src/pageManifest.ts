import {IconDefinition} from "@fortawesome/fontawesome-common-types";

export interface PageManifest {
  component: any,
  isDefault?:boolean,
  isSystem?:boolean,
  icon?: IconDefinition,
  title: string,
  available?: any[],
  routeParts: string[],
  userData?: {
  }
}
