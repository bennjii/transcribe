export type Project = {
    id: string,
    owner: string,

    creation_date: number,
    last_edited: number,

    name: string,
    file_structure: object,
}


/**
 * The file structure works on a parent to child oriented system
 */
export type FileStructure = {
    name: string,

    // Is a parent
    is_folder: boolean,
    children?: object[],

    // Is a child

    // Is eaither a document (straight words) or a vision board (creative ideas) or an artifact which can be 
    // thought of as a dictionary for ideas that is refrenceable through the documents.
    type?: "document" | "vision_board" | "artifact"
}