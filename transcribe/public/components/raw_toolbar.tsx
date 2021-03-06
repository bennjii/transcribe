import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Italic, Underline } from "react-feather";

import styles from '@styles/Home.module.css'

const RawToolbar: React.FC<{ id: string }> = ({ id }) => {
    const { editor } = useContext(ProjectContext);

    return (
        <div 
            id={`toolbar-${id}`} 
            //@ts-expect-error
            className={`${styles.toolbar} ${(editor?.active_sub_file !== id && editor?.id !== id && id !== 'single') && styles.toolbarHidden} ql-toolbar ql-snow`}
        >
            <select className="ql-font" onSelect={e => e.preventDefault()}>
                <option value="arial" selected>Arial</option>
                <option value="pt-serif">PT Serif</option>
                <option value="public-sans" >Public Sans</option>
                <option value="times-new-roman" >Times New Roman</option>
            </select>

            <select className="ql-header">  
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option value="0" selected>Regular</option>
            </select>

            <select className="ql-size"> 
                <option value="18px">18px</option> 
                <option value="16px">16px</option>
                <option value="14px">14px</option>
                <option value="13px" selected >13px</option>
                <option value="12px">12px</option>
                <option value="11px">11px</option>
            </select>

            <div>
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button> 
                <button className="ql-strike"></button> 
            </div>

            <div className="ql-formats">
                <button className="ql-script" value="sub"></button>
                <button className="ql-script" value="super"></button>
            </div>

            <button className="ql-direction" value="rtl"></button>
            <select className="ql-align"></select>

            <select className="ql-color">
                <option value="#000000"></option>
                <option value="#202737"></option>
                <option value="#3F4960"></option>
                <option value="#636977"></option>
            </select>

            <div>
                <button className="ql-link"></button>
                <button className="ql-image"></button>
                <button className="ql-formula"></button>
            </div>

            {/* <div>
                <button className="ql-table"></button>
                <button className="ql-remove-table"></button>
                <button className="ql-underline"></button>  
            </div> */}

            <div>
                {/* <button className="ql-page-break"></button> */}
            </div>

            <button className="ql-clean"></button>
        </div>
    )
}

export default RawToolbar;