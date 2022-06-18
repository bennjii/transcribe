import { createContext } from "react";
import { Book } from "./book";
import { File, Folder, Project } from "./project";

const ProjectContext = createContext<{ 
    project: Project,
    projectCallback: Function,
    editors: File[] | Folder[],
    editorsCallback: Function,
    synced: boolean
}>(null);

export default ProjectContext