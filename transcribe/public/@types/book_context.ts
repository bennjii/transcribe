import { createContext } from "react";
import { Book } from "./book";
import { Folder, File } from "./project";

const BookContext = createContext<{ 
    book: Folder | File,
    callback: Function
}>(null);

export default BookContext