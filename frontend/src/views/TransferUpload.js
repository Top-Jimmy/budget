import React, { useContext, useState } from 'react';
import { UIContext } from '../state/UIProvider';
import RequireLogin from '../state/RequireLogin';

const TransferUpload = props => {
    // UI for uploading CSV document and capturing basic info about transfers in file
    const [UIState, UIDispatch] = useContext(UIContext);
    const { step } = UIState;
    if (step !== 'upload') {
        return null;
    }
    const { selectedCSV } = UIState;
    const { onFileChange } = UIDispatch;
    

    // const onSourceChange = event => {
    //     setFileSource(event.target.value);
    // };

    let currentFileInfo;
    if (selectedCSV) {
        currentFileInfo = (
            <React.Fragment>
                <p>{selectedCSV.name}</p>
                <button onClick={() => onFileChange()}>Parse Again</button>
            </React.Fragment>
        )
    }
    return (
        <RequireLogin>
            {currentFileInfo}
            <input type="file" accept=".csv" onChange={onFileChange}  />
        </RequireLogin>
    );
};

export default TransferUpload;