import { Bold, Italic, Underline } from "react-feather";

const CustomToolbar: React.FC<{  }> = ({ }) => {
    return (
        <div id="toolbar">
            <select className="ql-header">  
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option selected></option>
            </select>

            <div>
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>  
            </div>

            <select className="ql-font">
                <option selected> <label htmlFor="">Arial</label></option>
                <option value="pt-serif"><label htmlFor="">PT Serif</label></option>
                <option value="public-sans"><label htmlFor="">Public Sans</label></option>
            </select>

            <select className="ql-align">
                <option selected></option>
                <option value="justify"></option>
                <option value="center"></option>
                <option value="right"></option>
            </select>

            <button className="ql-clean"></button>
        </div>
    )
}

export default CustomToolbar;