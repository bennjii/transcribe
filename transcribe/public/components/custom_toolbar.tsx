import { Bold, Italic, Underline } from "react-feather";

const CustomToolbar: React.FC<{  }> = ({ }) => {
    return (
        // <div id="toolbar">
        //     <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
        //         <option value="1" />
        //         <option value="2" />
        //         <option selected />
        //     </select>

        //     <button className="ql-bold" />
        //     <button className="ql-italic" />

        //     <select className="ql-color">
        //         <option value="red" />
        //         <option value="green" />
        //         <option value="blue" />
        //         <option value="orange" />
        //         <option value="violet" />
        //         <option value="#d0d1d2" />
        //         <option selected />
        //     </select>

        //     <button className="ql-customBold">
        //         <Bold size={18}/>
        //     </button>
        // </div>

        <div id="toolbar">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>

            <select className="ql-header">  
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option selected></option>
            </select>

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