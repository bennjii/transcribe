export type Project = {
    id: string,
    owner: string,

    creation_date: number,
    last_edited: number,

    name: string,

    // Parent Folder
    file_structure: Folder,

    // Current
    active_file: EmbeddedString
}

export type EmbeddedString = string;

export type File = {
    name: string,
    is_folder: false,

    title_format: any

    // Is eaither a document (straight words) or a vision board (creative ideas) or an artifact which can be 
    // thought of as a dictionary for ideas that is refrenceable through the documents.
    type?: "document" | "vision_board" | "artifact",
    data: any,

    id: string,
    // Type Specific Data...
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
    active_sub_file: string
}

export const recursivelyIdentify = (state: Project, editorCallback: Function) => {
    if(state.file_structure.id == state.active_file) return state.file_structure;
    else return reccursion(state.file_structure, state, editorCallback)
} 

const reccursion = (element, state: Project, editorCallback: Function) => {
    return element?.children?.forEach(element => {
        if(element.id == state.active_file) { 
            editorCallback(element);
        }

        if(element.id == state.active_file) return;
        else return reccursion(element, state, editorCallback);
    });
}