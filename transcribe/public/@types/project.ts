import Delta from 'quill-delta';
import { Quill } from 'react-quill';
import { v4 as uuidv4 } from 'uuid'

export type EmbeddedString = string;

export type Settings = {
    share: boolean,
    permType: "public" | "private",
    performance?: boolean
}

export type ProjectSettings = {
    author: string,
    book_title: string,
    book_number?: string,
    publisher?: string,
    description: string,

    //... other stuff
}

export type Project = {
    id: string,
    owner: string,

    creation_date: number,
    last_edited: number,

    name: string,

    // Parent Folder
    file_structure: Folder,

    // Current
    active_file: EmbeddedString,
    settings: ProjectSettings
}

export type File = {
    name: string,
    is_folder: false,

    title_format: any

    // Is either a document (straight words) or a vision board (creative ideas) or an artifact which can be 
    // thought of as a dictionary for ideas that is refrenceable through the documents.
    type?: "document" | "vision_board" | "artifact",
    data: any,

    id: string,
    // Type Specific Data...

    settings: Settings
}

/**
 * The file structure works on a parent to child oriented system
 */
export type Folder = {
    name: string,
    id: string,

    type: "folder" | "book",

    // Is a parent
    is_folder: true,
    children?: (File | Folder)[],
    active_sub_file: string,

    settings: Settings
}

export type CanvasItem = {
    name: string,
    is_folder: false,
    title_format: null,
    data: Delta | string,
    type: "text" | "image",
    id: string,
    settings: {
        share: boolean,
        permType: "private" | "public"
    }
}

export const recursivelyIdentify = (state: Project, editorCallback: Function) => {
    if(state.file_structure.id == state.active_file) return state.file_structure;
    else return reccursion(state.file_structure, state, editorCallback)
} 

const reccursion = (element, state: Project, editorCallback: Function) => {
    return element?.children?.forEach(_element => {
        if(_element.id == state.active_file) { 
            // editorCallback(_element);
            if(element.type == 'book') {
                editorCallback({ ...element, active_sub_file: state.active_file });
            }else {
                editorCallback(_element);
            }

            return;
        }

        if(_element.id == state.active_file) return;
        else return reccursion(_element, state, editorCallback);
    });
}


export const newFile = (name: string, docType: "document" | "vision_board" | "artifact") => {
    return {
        name: name,
        id: uuidv4(),
        type: docType,

        is_folder: false,
        data: docType !== "vision_board" ? new Delta({ ops: [ { insert: "Start Typing Here..." } ] }) : [ newCanvasItem("...", "text") ],
        title_format: null,
        settings: {
            share: false,
            permType: "private"
        }
    }
}

export const newFolder = (name) => {
    return {
        name: name,
        id: uuidv4(),
        type: "folder",

        is_folder: true,
        children: [],
        active_sub_file: null,
        settings: {
            share: false,
            permType: "private"
        }
    }
}

export const newChapter = () => {
    return {
        name: "",
        is_folder: false,
        title_format: null,
        data: new Delta({ ops: [ { insert: "Start Typing Here..." } ] }),
        type: "document",
        id: uuidv4(),
        settings: {
            share: false,
            permType: "private"
        }
    }
}

export const newCanvasItem = (content: string, type?: "image" | "text") => {
    let data;

    switch(type) {
        case "image":
            data = content;
            break;
        case "text":
            data = new Delta({ ops: [ { insert: content } ] })
            break;
        default: 
            data = content;
            break;
    }

    return {
        name: "",
        is_folder: false,
        title_format: null,
        data: data,
        type: type,
        id: uuidv4(),
        settings: {
            share: false,
            permType: "private"
        }
    }
}