import React, { useContext } from 'react';
import { UIContext } from '../state/UIProvider';

const Navigation = props => {
    const [UIState, UIDispatch] = useContext(UIContext);
    const { step, steps } = UIState;
    const { updateStep } = UIDispatch;

    const renderedSteps = steps.map((s, i) => {
        const { step: st, label } = s;
        const isCurrentStep = step === st;
        let onclick;
        if (!isCurrentStep) {
            onclick = () => updateStep(st);
        }

        const tileClasses = step === st ? "navigationTile currentStep" : "navigationTile";
        return (
            <div
                className={tileClasses}
                key={i}
                onClick={onclick}
            >
                {label}
            </div>
        );
    });
    return (
        <div id="navigation" >
            <div style={{float: 'left'}}>
                {renderedSteps}
            </div>
        </div>
    );
};

export default Navigation;