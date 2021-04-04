import { initializeKlumfyApp } from '@klumfy/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import firebase from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import firebaseConfig from './config/credentials/firebase';
import store from './models/store';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';



/** Setup Klumfy Application Service */
if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig)
    initializeKlumfyApp(app)
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const theme = createMuiTheme({
    palette: {
       type: prefersDark.matches ? 'dark' : 'light',
    }
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
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
