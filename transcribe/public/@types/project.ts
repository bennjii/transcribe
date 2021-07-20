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

    // Is a parent
    is_folder: true,
    children?: (File | Folder)[],
}

export const recursivelyIdentify = (state: Project) => {
    const ID = state.active_file;

    console.log(reccursion(state.file_structure, ID));

    if(state.file_structure.id == ID) return state.file_structure;
    else return reccursion(state.file_structure, ID)
} 

const reccursion = (element, id) => {
    return element?.children?.forEach(element => {
        console.log(element);
        if(element.id == id) return element;
        else return reccursion(element, id);
    });
}