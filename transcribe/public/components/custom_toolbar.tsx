import { Bold, Italic, Underline } from "react-feather";

const CustomToolbar: React.FC<{  }> = ({ }) => {
    return (
        <div id="toolbar">
            <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                <option value="Header 1"/>
                <option value="Header 2" />
                <option value="Text" selected />
            </select>

            <button className="ql-bold"><Bold size={18}/></button>
            <button className="ql-italic"><Italic size={18}/></button>
            <button className="ql-underscore"><Underline size={18}/></button>

            <select className="ql-color">
                <option value="red" />
                <option value="green" />
                <option value="blue" />
                <option value="orange" />
                <option value="violet" />
                <option value="#d0d1d2" />
                <option selected />
            </select>
        </div>
    )
}

export default CustomToolbar;