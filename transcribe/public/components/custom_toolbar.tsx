import { Bold, Italic, Underline } from "react-feather";

const CustomToolbar: React.FC<{  }> = ({ }) => {
    return (
        <div id="toolbar">
            <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                <option value="1" />
                <option value="2" />
                <option selected />
            </select>

            <button className="ql-bold" />
            <button className="ql-italic" />

            <select className="ql-color">
                <option value="red" />
                <option value="green" />
                <option value="blue" />
                <option value="orange" />
                <option value="violet" />
                <option value="#d0d1d2" />
                <option selected />
            </select>

            <button className="ql-customBold">
                <Bold size={18}/>
            </button>
        </div>

        // <div id="toolbar">
        //     <select className="ql-size">
        //         <option value="small"></option>

        //         <option selected></option>
        //         <option value="large"></option>
        //         <option value="huge"></option>
        //     </select>

        //     <button className="ql-bold"></button>

        //     <button className="ql-script" value="sub"></button>
        //     <button className="ql-script" value="super"></button>
        // </div>
    )
}

export default CustomToolbar;