import React, { useContext, useState } from 'react';
import Dropdown from '../components/Dropdown2';
import { UIContext } from '../state/UIProvider';
import TransferCategoryCell from '../components/TransferCategoryCell';

// User questions/settings
    // Joint account? Y/N
        // Names?

// Transfer Meta
    // Subscriptions in month
    // Assign to person if joint account?

const frequencyOptions = [
    {label: 'Monthly'},
    {label: 'Biannual'},
    {label: 'Yearly'},
];
    
const UploadInfo = props => {
    const [UIState, UIDispatch] = useContext(UIContext);
    const { step, parsedFileInfo, uploadInfo, uploadMeta } = UIState;
    if (step !== 'display') {
        return null;
    }
    const { updateStep, togglePossibleRecurring, updatePossibleRecurring, setFrequency } =  UIDispatch;
    const { headers, transfers } = parsedFileInfo || {};
    const { net, total_expenses, possible_subscriptions, subscription_total } = uploadMeta || {};

    const renderMeta = () => {
        if (!uploadMeta) {
            return null;
        }
        const { cardType, institutionName, cardHolder } = uploadMeta;
        let title;
        if (cardHolder && institutionName && cardType) {
            title = <h1 style={{margin: '0px'}} >{cardHolder}'s {institutionName} {cardType}</h1>;
        }

        return (
            <React.Fragment>
                {title}
                { /* <div>Card Holder: {cardHolder}</div>
                <div>Card Type: {cardType}</div>
                <div>Institution Name: {institutionName}</div> */}
                <p />
                <div>Net Amount: ${net}</div>
                <div>Total Expenses: ${total_expenses}</div>
                <div>Subscription Total: ${subscription_total}</div>

                <p />
                {renderPossibleSubscriptions(possible_subscriptions)}
            </React.Fragment>
        )
    };

    const renderPossibleSubscriptions = (possible_subscriptions) => {
        if (!uploadInfo || !possible_subscriptions || possible_subscriptions.length === 0) {
            return null;
        }

        const subscriptionHeaders = ['Description', 'Amount', 'Date', 'Frequency'].map((val, i) => {
            return <th key={i}>{val}</th>;
        });

        const renderedPossibleSubscriptions = possible_subscriptions.map((ps, i) => {
            const t = uploadInfo[ps.index];
            return (
                <tr key={i}>
                   <td>{t.description}</td>
                   <td>{t.amount}</td>
                   <td>{t.date}</td>
                   {frequencyDropdown()}
                </tr>
            );
        });
        return (
            <React.Fragment>
                <h2>Possible Recurring Payments</h2>
                <button onClick={updatePossibleRecurring}>Save</button>
                <table>
                    <tr>
                        {subscriptionHeaders}
                    </tr>
                    {renderedPossibleSubscriptions}
                </table>

            </React.Fragment>
        );
    };

    const transferTable = () => {
        if (!headers || !transfers) {
            return null;
        }
        const headerList = [...headers, 'Recurring Transfer', 'Frequency'];
        
        const renderedHeaders = headerList.map((val, i) => {
            return <th key={i}>{val}</th>;
        });

        const renderedTransfers = transfers.map((transferArray, i) => {
            // Add 'Frequency' cell if it's a subscription or possible subscription
            let recurring;
            if (possible_subscriptions) {
                recurring = possible_subscriptions.filter(t => t.index === i).length;
            }

            let frequency;
            if (recurring && recurring.frequency) {
                frequency = <td>{recurring.frequency}</td>;
            }
            return (
                <tr key={i}>
                    {transferArray.map((val, i) => {
                        return <td key={i}>{val}</td>;
                    })}
                    {/* <TransferCategoryCell transfer={transferArray} /> */}
                    {possibleTransferCheckbox(transferArray, i)}
                    {frequency}
                </tr>
            );
        });
        
        return (
            <table>
                <tbody>
                    <tr>
                        {renderedHeaders}
                    </tr>
                    {renderedTransfers}
                </tbody>
            </table>
        );
    };

    const possibleTransferCheckbox = (transferArray, transfer_index) => {
        if (!transferArray) {
            return null;
        }
        let checked;
        if (possible_subscriptions) {
            checked = possible_subscriptions.filter(t => t.index === transfer_index).length;
        }
        return (
            <td>
                <input 
                    type="checkbox" 
                    checked={checked ? "checked" : ""} 
                    id={"possible_transfer_" + transfer_index}
                    onChange={() => togglePossibleRecurring({
                        index: transfer_index,
                        amount: transferArray.amount,
                        date: transferArray.date
                    })}
                ></input>
            </td>
        );
    };

    const frequencyDropdown = () => {
        return <td><Dropdown options={frequencyOptions} initialValue="Monthly"/></td>;
    };


    const actions = (
        <div className="actionBar">
            <button onClick={() => updateStep('upload')} >Upload a different CSV file</button>
        </div>
    );

    return (
        <React.Fragment>
            {renderMeta()}
            {actions}
            {transferTable()}
        </React.Fragment>
    );
};

export default UploadInfo;
