import {EditorContext} from "./editorContext";

export type HtmlViewerContext = EditorContext & {
    params: {
        label: string;
        html:string,
        [x: string]: any
    }
}