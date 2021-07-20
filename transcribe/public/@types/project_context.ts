import { createContext } from "react";
import { Book } from "./book";
import { Project } from "./project";

const ProjectContext = createContext<{ 
    project: Project,
    callback: Function
}>(null);

export default ProjectContext