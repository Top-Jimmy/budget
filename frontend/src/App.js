import './App.css';
import { FirebaseProvider } from './state/FirebaseProvider';
import { UIProvider } from './state/UIProvider';
import { TransferProvider } from './state/TransferProvider';

import Navigation from './views/Navigation';
// import UploadWizard from './views/UploadWizard';
import Authentication from './views/Authentication';

import TransferUpload from './views/TransferUpload';
import TransferQuestions from './views/TransferQuestions';
import UploadInfo from './views/UploadInfo';

import UserInfo from './views/UserInfo';

import firebase from 'firebase/app';
import 'firebaseui/dist/firebaseui.css'

const firebaseConfig = {
  apiKey: "AIzaSyA8DBhGBdHV6PMRVhgfE5ZF9wtTDTCwlzU",
  authDomain: "budget-dfb97.firebaseapp.com",
  projectId: "budget-dfb97",
  storageBucket: "budget-dfb97.appspot.com",
  messagingSenderId: "369608191412",
  appId: "1:369608191412:web:23305db33216e213be56e1"
};

function App() {
  // Initialize (or retrieve) firebase app
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  return (
    <FirebaseProvider>
      <UIProvider>
        <div className="App">
          <header className="App-header">
            <Navigation />
          </header>
          <div className="bbody">
            <div className="bcontent">
              <div id="firebaseui-auth-container"></div>
              {/* <div id="loader">Loading...</div> */}
              <Authentication />
              <UserInfo />
              
              <TransferUpload />
              <TransferQuestions />
              <UploadInfo />
              </div>

          </div>
        </div>
      </UIProvider>
    </FirebaseProvider>
  );
}

export default App;
