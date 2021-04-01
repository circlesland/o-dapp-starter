import {OmoEvent} from "omo-events/dist/omoEvent";

export interface Bubble extends OmoEvent {
  type: "process.ipc.bubble",
  wrappedEvent: OmoEvent,
  noReply?:boolean, // If set, indicates that the backtrace cannot be used to send events back
  levels: number, // How many levels the event already bubbled
  tag?: string // Can be used to identify the event
  trace: string[] // A list of state-ids that the event passed
}