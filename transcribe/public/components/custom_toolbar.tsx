import { Bold, Italic, Underline } from "react-feather";

const CustomToolbar: React.FC<{  }> = ({ }) => {
    return (
        <div id="toolbar">
            <select className="ql-font">
                <option selected> <label htmlFor="">Arial</label></option>
                <option value="pt-serif"><label htmlFor="">PT Serif</label></option>
                <option value="public-sans"><label htmlFor="">Public Sans</label></option>
            </select>

            <select className="ql-header">  
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option selected><label htmlFor="">Regular</label></option>
            </select>

            <select className="ql-size"> 
                <option value="18px"><label htmlFor="">18px</label></option> 
                <option value="16px"><label htmlFor="">16px</label></option>
                <option value="14px"><label htmlFor="">14px</label></option>
                <option value="12px" selected><label htmlFor="">12px</label></option>
            </select>

            <div>
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>  
            </div>

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