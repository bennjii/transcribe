import { createContext } from "react";
import { Folder, File, Project } from "./project";

const HomeContext = createContext<{ 
    page: any | 'home-page' | 'project-page' | 'resources-page' | 'release-page',
    pageCallback: Function,
    info: {
        username: string,
        creation_date: any,
        projects: Project[],
        id: string
    },
    __infoCallback: Function
}>(null);

export default HomeContext