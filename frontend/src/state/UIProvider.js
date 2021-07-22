import React, { createContext, useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';

import { FirebaseContext } from './FirebaseProvider';
import { standardizeColumnNames, standardizeTransfer, calcUploadInfo, calcUploadMeta } from '../util/transferUtil';


// Augment funcs for getting/setting items so we can stringify objects
Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key));
};

const defaultValue = (key, defaultVal) => {
    const storageVal = window.localStorage.getObj(key);
    if (storageVal) {
        return storageVal;
    }
    return defaultVal;
}

// Handles navigation 'step'
// Handles csv upload data and metadata
export const UIContext = createContext();
export const UIProvider = props => {
    const [firebaseState] = useContext(FirebaseContext);
    const { authUser, userDoc } = firebaseState;
    const { displayName } = userDoc || {};

    // 1st step depends on if you're logged in
    const steps = [{
        step: displayName ? 'userInfo' : 'auth',
        label: displayName || 'Authenticate',
    }, {
        step: 'upload',
        label: 'Upload CSV',
    }, {
        step: 'questions',
        label: 'Transfer Information',
    }, {
        step: 'display',
        label: 'Uploaded Transfers',
    }];

    const [step, setStep] = useState(defaultValue('step', authUser ? 'upload' : 'auth'));
    const updateStep = (newStep) => {
        setStep(newStep);
        localStorage.setObj('step', newStep);
    }

    // UPLOAD DATA
    // selectedFile: raw text of csv file
    // parsedFileInfo: readable version of selectedFile
    // uploadInfo:
    // uploadMeta: 

    const [selectedCSV, setSelectedCSV] = useState(defaultValue('selectedCSV', null));
    const updateSelectedCSV = (newCSV) => {
        setSelectedCSV(newCSV);
        localStorage.setObj('selectedCSV', newCSV);
    };
    const [parsedFileInfo, setParsedFileInfo] = useState(defaultValue('parsedFileInfo', null));
    const updateParsedFileInfo = newInfo => {
        setParsedFileInfo(newInfo);
        localStorage.setObj('parsedFileInfo', newInfo);
    };
    const [uploadInfo, setUploadInfo] = useState(defaultValue('uploadInfo', null));
    const updateUploadInfo = newInfo => {
        setUploadInfo(newInfo);
        localStorage.setObj('uploadInfo', newInfo);
    };
    const [uploadMeta, setUploadMeta] = useState(defaultValue('uploadMeta', {}));
    const updateUploadMeta = newInfo => {
        setUploadMeta(newInfo);
        localStorage.setObj('uploadMeta', newInfo);
    };
    const updatePossibleSubscriptions = (newList) => {
        const newMeta = {
            ...uploadMeta,
            possible_subscriptions: newList,
        };
        updateUploadMeta(newMeta);
    }
    const { possible_subscriptions } = uploadMeta;

    // Handle navigation on auth change
    useEffect(() => {
        if(!authUser) {
            updateStep('auth');
        } else if (step === 'auth') {
            updateStep('upload');
        }
    }, [authUser, step]);

    const onFileChange = (event) => {
        // New CSV file was uploaded
        let file;
        if (event && event.target && event.target.files) {
            // New file uploaded
            file = event.target.files[0];
            updateSelectedCSV(file);
        } else if (selectedCSV) {
            // Re-parse current file
            file = selectedCSV;
        } else {
            console.log('No file to change');
            return;
        }
        
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = e => {
            console.log(e);
            let csv_data_file = e.target.result;
            // let size = e.total;

            // 1st row is column names, following rows are transfers
            let rows = csv_data_file.split("\n");
            
            // Standardize column names
            let rawColumnNames = rows[0].split(",");
            let columnNames = standardizeColumnNames(rawColumnNames);
            
            // Standardize transfers
            let transfers = [];
            rows.slice(1).forEach((res, i) => {
                const rawTransferValues = res.split(",");
                transfers.push(standardizeTransfer(rawTransferValues, i, columnNames));
            });

            updateParsedFileInfo({
                headers: columnNames,
                transfers,
            });

            let newUploadInfo = calcUploadInfo(
                columnNames,
                transfers,
            );
            updateUploadInfo(newUploadInfo);

            let newUploadMeta = calcUploadMeta(newUploadInfo);
            updateUploadMeta(newUploadMeta);

            updateStep('questions');
        };
    };

    const togglePossibleRecurring = (info) => {
        // Toggle transfer as possible recurring transfer
        console.log(info);
        if (!possible_subscriptions) {
            console.log('add to possible_subscriptions');
            updatePossibleSubscriptions([info]);
            return;
        }
        let updated_list;
        let exists = possible_subscriptions.filter(ps => ps.index === info.index).length;
        if (exists) {
            // Remove
            console.log('remove');
            updated_list = possible_subscriptions.filter(ps => ps.index !== info.index);
        } else {
            // Add
            console.log('add');
            updated_list = [...possible_subscriptions, info];
        }

        if (updated_list) {
            updatePossibleSubscriptions(updated_list);
        }
    };

    const onQuestionChange = (newMeta) => {
        // const { cardType, institutionName, cardHolder } = newMeta;
        const mergedMeta = {...uploadMeta, ...newMeta};
        updateUploadMeta(mergedMeta);
        updateStep('display');
    };

    const setFrequency = (frequency, i) => {
        const currentInfo = possible_subscriptions.filter(ps => ps.index === i)[0];
        if (!currentInfo) {
            console.log('No matching possible_subscription to update');
            return;
        }
        const newRecurringList = possible_subscriptions.map(ps => {
            if (ps.index !== i) {
                return ps;
            }
            return {
                ...ps,
                frequency,
            };
        });
        updatePossibleSubscriptions(newRecurringList);
    };


    const UIState = {
        step,
        steps,
        selectedCSV,
        parsedFileInfo,
        uploadInfo,
        uploadMeta,
    };
    const UIDispatch = {
        // File upload
        onFileChange,

        // Get user responses
        onQuestionChange,

        // Recurring Transfers
        togglePossibleRecurring,
        setFrequency,

        // Navigation
        updateStep,
    };
    return (
        <UIContext.Provider value={[UIState, UIDispatch]}>
            {props.children}
        </UIContext.Provider>
    );
};
