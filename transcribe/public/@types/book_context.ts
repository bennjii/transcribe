import { createContext } from "react";
import { Book } from "./book";

const BookContext = createContext<{ 
    book: Book,
    callback: Function
}>(null);

export default BookContext