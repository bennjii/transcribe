import { TextareaHTMLAttributes, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'

const BookInput: React.FC<{ value: any }> = ({ value }) => {
    const input_field = useRef(null);

    const [ height, setHeight ] = useState(input_field?.current?.scrollHeight);

    return (
        <div 
            contentEditable
            ref={input_field}
            onChange={() => {
                setHeight(input_field.current.scrollHeight)
            }}
            style={{
                ...value.content.format,
                textAlign: 'justify',
                height: `${height}px`,
                overflowY: 'hidden'
            }}
            className={styles.bookInput}
            >
                { value.content.text }
        </div>
    )
}

export default BookInput;