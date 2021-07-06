import React from 'react'
import styles from '../../styles/Home.module.css'

import { SingletonRouter } from 'next/router'

interface State {
    active: boolean,
    hovered: boolean,
    value: string,
    activated: boolean
}

class Input extends React.Component<{type: string, title?: string, defaultValue?: string, placeholder?: string, onChange?: Function, disabled?: boolean}, State> {
    constructor(props) {
        super(props)

        this.state = { active: false, hovered: false, value: '', activated: false }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ activated: true });

        if(e.target.value !== "") this.setState({ active: true });
        else this.setState({ active: false })

        if(this.props.onChange) { 
            this.props.onChange(e);
        }
    }

    render() {
        return (
            <div className={styles.inputModule}>
                <h4>{this.props?.title}</h4>
                <input 
                    defaultValue={this.props.defaultValue}
                    type={this.props.type} 
                    onChange={this.handleChange}  
                    className={(this.state.hovered) ? `${styles.hoverInput} ${styles.input} ${(this.props.disabled) ? styles.inputDisabled : styles.inputEnabled}` : `${(this.props.disabled) ? styles.inputDisabled : styles.inputEnabled} ${(this.state.active) ? styles.inputActive : styles.inputInactive} ${styles.input}`} 
                    onMouseOver={() => this.setState({ hovered: true })} 
                    onMouseLeave={() => this.setState({ hovered: false })}
                    disabled={this.props?.disabled}
                    placeholder={this.props?.placeholder}
                />
            </div>
            
        )
    }
}

export default Input;