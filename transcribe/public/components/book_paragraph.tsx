import { TextareaHTMLAttributes, useContext, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
// import { Paragraph } from "../@types/book";
import BookContext from "../@types/book_context";

const BookParagraph: React.FC<{ paragraph: number, content: any, callback: Function }> = ({ paragraph, content, callback }) => {
    const input_field = useRef(null);
    
    const [ height, setHeight ] = useState(input_field?.current?.scrollHeight);
    const [ paragraphState, setParagraphState ] = useState(content);

    return (
        <div 
            ref={input_field}
            onInput={(e) => {
                console.log(e)
                setHeight(input_field.current.scrollHeight)
            }}
            onKeyDown={(e) => {
                console.log(e);

                if(e.code == "Backspace" && paragraphState.text == '') {
                    callback(paragraph, content.format, -1)
                }

                if(e.code == "Enter") {
                    console.log("Attempting the unknown")

                    callback(paragraph, content.format, 1);
                    input_field.current.blur();
                }
            }}
            style={{
                ...content.format,
                textAlign: 'justify',
                height: `${height}px`,
                overflowY: 'hidden'
            }}
            className={styles.bookInput}
            >
                {
                    content.text
                }
        </div>
    )
}

export default BookParagraph;