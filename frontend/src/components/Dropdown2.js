import React, { useState } from 'react';

const Dropdown = props => {
    const { id, initialValue, options } = props;
    
    const [selection, setSelection] = useState(initialValue);
    const [open, setOpen] = useState(false);
    const showOptions = () => setOpen(true);
    const hideOptions = () => setOpen(false);
    const selectOption = (label) => {
        hideOptions();
        setSelection(label);
    };

    const renderedOptions = options ? options.map((o, i) => {
        const { label } = o;
        const onclick = () => selectOption(label);
        return (
            <div key={i} className="dropdown_option" onClick={onclick}>
                <div className="dropdown_option_label">{label}</div>
            </div>
        );
    }) : null;

    let optionsClass = "dropdown_options";
    let backdropClass = "dropdown_backdrop";
    if (open) {
        optionsClass += " active";
        backdropClass += " active";

    }

    return (
        <div className="dropdown_container">
            <div id={id} className="current_selection" onClick={showOptions}>{selection}</div>
            <div className={optionsClass}>{renderedOptions}</div>
            <div className={backdropClass} onClick={hideOptions} />
        </div>
    )
};

export default Dropdown;