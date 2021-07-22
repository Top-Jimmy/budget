import React, { useState } from 'react';

const Dropdown = props => {
    const { onChange } = props;
    const [open, setOpen] = useState(false);
    const toggleDropdown = () => {
        setOpen(prevState => !prevState);
    };

    const [selectedValue, setSelectedValue] = useState(null);
    const selectItem = (item) => {
        // Save value locally
        setSelectedValue(item);

        // Close dropdown
        toggleDropdown();

        // Call parent onchange
        if (onChange) {
            onChange(item);
        }
    }
        

    let displayedItems;
    if (open) {
        displayedItems = (
            <div className="dd_content">
                <button 
                    onClick={() => selectItem('monthly')} 
                    className="dd_li"
                >
                    Monthly
                </button>
                <button 
                    onClick={() => selectItem('biannual')} 
                    className="dd_li"
                >
                    Every 6 months
                </button>
                <button 
                    onClick={() => selectItem('annual')} 
                    className="dd_li"
                >
                    Every year
                </button>
            </div>
        );
    }

    return (
        <div className="dd_container">
            <div className="dd_header">
                <div onClick={toggleDropdown} className="dd_header_title">{selectedValue || 'Frequency'}</div>
            </div>
            {displayedItems}
        </div>
    );
};

export default Dropdown;