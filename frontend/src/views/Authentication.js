import React, { useContext } from 'react';
import { FirebaseContext } from '../state/FirebaseProvider';

const Authentication = props => {
    const [firebaseState] = useContext(FirebaseContext);
    const { authUser } = firebaseState;
    
    let loginContent;
    if (authUser && Object.keys(authUser).length === 0) {
        
        loginContent = (
            <React.Fragment>
                <h1>Welcome to firebase hell</h1>
            </React.Fragment>
        );
    }
    return (
        <div className="authentication_container">
            {loginContent}
        </div>
    );
};

export default Authentication;