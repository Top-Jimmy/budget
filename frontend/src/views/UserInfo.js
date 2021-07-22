import React, { useContext } from 'react';
import { UIContext } from '../state/UIProvider';
import { FirebaseContext } from '../state/FirebaseProvider';

const UserInfo = props => {
    const [fbState, fbDispatch] = useContext(FirebaseContext);
    const [UIState, UIDispatch] = useContext(UIContext);
    const { step } = UIState;
    if (step !== 'userInfo') {
        return null;
    }
    const { authUser } = fbState;
    const { displayName } = authUser || {};
    const { signout } = fbDispatch;

    return (
        <div>
            <p>Welcome {displayName}</p>
            <p>Budget until your extremely wealthy.</p>
            <button onClick={signout}>Sign Out</button>
        </div>
        
    );
}

export default UserInfo;