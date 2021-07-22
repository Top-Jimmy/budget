import React, { useContext } from 'react';
import { FirebaseContext } from './FirebaseProvider';

const RequireLogin = props => {
    const [firebaseState] = useContext(FirebaseContext);
    const { authUser } = firebaseState;

    if (authUser && Object.keys(authUser).length > 0) {
        return (
            <React.Fragment>{props.children}</React.Fragment>
        )
    } else {
        return <div>Not logged in</div>
    }
};

export default RequireLogin;