import { initializeKlumfyApp, setKlumfyApp } from '@klumfy/core';
import firebase from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebaseConfig from './config/credentials/firebase';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


/** Setup Klumfy Application Service */
if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig)
    const klumfyApp = initializeKlumfyApp(app)
    setKlumfyApp(klumfyApp)
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
