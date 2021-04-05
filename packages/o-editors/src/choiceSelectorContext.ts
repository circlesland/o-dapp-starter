import {EditorContext} from "./editorContext";

export type ChoiceSelectorContext = EditorContext & {
    params: {
        choices:{
            key:string,
            label:string
        }[],
        [x: string]: any
    }
}