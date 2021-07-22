import React, { useContext, useState } from 'react';
import RequireLogin from '../state/RequireLogin';
import TransferUpload from './TransferUpload';
import TransferQuestions from './TransferQuestions';
import UploadInfo from './UploadInfo';
import { parseColumnVals, parseRowArray, calcUploadInfo, calcUploadMeta } from '../util/transferUtil';
import { UIContext } from '../state/UIProvider';

const hello_world_url = "http://localhost:5000/budget-dfb97/us-central1/helloWorld";
const csv_upload_url = "http://localhost:5001/budget-dfb97/us-central1/csvTransferUpload";

// User questions/settings
    // Joint account? Y/N
        // Names?

// Transfer Meta
    // Subscriptions in month
    // Assign to person if joint account?


const UploadWizard = props => {
    // UI
    const [UIState, UIDispatch] = useContext(UIContext);
    const { step } = UIState;
    const { updateStep } = UIDispatch;

    let currentStep;
    // if (step === 'upload') {
    //     currentStep = <TransferUpload />;
    // } else if (step === 'questions') {
    //     currentStep = <TransferQuestions />
    // } else if (step === 'display') {
    //     currentStep = (
    //         <UploadInfo 
    //             jsonInfo={uploadInfo} 
    //             parsedInfo={parsedFileInfo} 
    //             meta={uploadMeta}
    //             uploadDifferentFile={() => updateStep('upload')}
    //             togglePossibleRecurring={togglePossibleRecurring}
    //         />
    //     );
    // } else{
    //     currentStep = <div>Ya dun fucked up. Choose a better step: {step}</div>;
    // }


    // Unused
    // const disabled = !selectedFile || !uploadInfo || !uploadMeta;
    // const onFileUpload = () => {
    //     const formData = new FormData();
    
    //     // Update the formData object
    //     formData.append('transfer_csv', selectedFile);

    //     for (var pair of formData.entries()) {
    //         const key = pair[0];
    //         const value = pair[1];
    //         console.log(key + ', ' + value);
    //         if (key === 'transfer_csv') {
    //             console.log(JSON.stringify(value));
    //         }
            
    //     }

    //     const options = {
    //         method: 'POST',
    //         body: formData
    //     };
    //     fetch(csv_upload_url, options)
    //         .then(resp => resp.json())
    //         .then(res => {
    //             console.log('response');
    //             console.log(res);
    //         });
    // };
    // const processFileButton = <button style={{marginTop: '20px'}} disabled={disabled} onClick={onFileUpload} className="b_button">Process Transaction File</button>;

    return (
        <RequireLogin>
            {currentStep}
        </RequireLogin>
    );
};

export default UploadWizard;
