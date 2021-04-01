import {OmoEvent} from "@o-platform/o-events/dist/omoEvent";
import {EventBroker} from "@o-platform/o-utils/dist/eventBroker";

const eventBroker = new EventBroker();
export const shellEvents = eventBroker.createTopic<OmoEvent>("omo", "shell");
