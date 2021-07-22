import React, { useContext, useState } from 'react';
import { UIContext } from '../state/UIProvider';

const TransferQuestions = props => {
    // Required: Source of transfers
        // debit or credit card
        // institution name
    // Optional: Person making transfers
    const [UIState, UIDispatch] = useContext(UIContext);
    const { step, uploadMeta: meta } = UIState;
    const { onQuestionChange } = UIDispatch;
    const { cardType: currentCardType, institutionName: currentName, cardHolder: currentCardHolder } = meta || {};

    // Card Type just read from radio
    // const [cardType, setCardType] = useState(() => {
    //     if (currentCardType) {
    //         return currentCardType === 'Credit Card' ? 'credit' : 'debit';
    //     } else {
    //         return '';
    //     }
    // });
    const [institutionName, setInstitutionName] = useState(currentName); // 'Discover'
    const [cardHolder, setCardHolder] = useState(currentCardHolder); // TODO: init w/ user's name

    if (step !== 'questions') {
        return null;
    }

    const handleSave = () => {
        // Get value from radio
        let radioVal = document.querySelector('input[name="cardType"]:checked').value;
        const cardType = radioVal === 'credit' ? 'Credit Card' : 'Debit Card';

        const newVals = {
            cardType,
            institutionName,
            cardHolder
        };
        onQuestionChange(newVals);
    };

    let creditClass;
    let debitClass;
    if (currentCardType) {
        if (currentCardType === 'Credit Card') {
            creditClass = 'checked';
        } else {
            debitClass = 'checked';
        }
    }
    const sourceRadio = (
        <React.Fragment>
            <p>Card Type</p>
            <label className="radio_container">Credit Card
                <input checked={creditClass} type="radio" name="cardType" value="credit" />
            </label>
            <label className="radio_container">Debit Card
                <input checked={debitClass} type="radio" name="cardType" value="debit" />
            </label>
        </React.Fragment>
    );
    const institutionNameInput = (
        <div style={{marginBottom: '20px'}}>
            <label>Institution Name </label>
            <input type="text"
                placeholder="Discover"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}>
            </input>
        </div>
    );
    const cardHolderInput = (
        <div style={{marginBottom: '20px'}}>
            <label>Card Holder </label>
            <input type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}>
            </input>
        </div>
    );

    const saveButton = (
        <button onClick={handleSave}>Save and View Transfers</button>
    );
    return (
        <React.Fragment>
            {sourceRadio}
            {institutionNameInput}
            {cardHolderInput}
            {saveButton}
        </React.Fragment>
    );
};

export default TransferQuestions;