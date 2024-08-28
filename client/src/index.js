import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loaderReducer } from './reducer/loaderReducer';
import { userReducer } from './reducer/userReducer';
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import {createStore} from 'redux'
import {applyMiddleware} from 'redux';
import logger from 'redux-logger';
import { combineReducers } from 'redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import socketMiddleware from './reducer/middlewares/socketMiddleware'
import {thunk} from 'redux-thunk';
import groupReducer from './reducer/groupReducer';

const root = ReactDOM.createRoot(document.getElementById('root'));

const rootReducer=combineReducers({
  user:userReducer,
  loader:loaderReducer,
  group:groupReducer
})
const store = createStore(rootReducer,applyMiddleware(logger,socketMiddleware,thunk))

const theme=createTheme({
  
})
root.render(

    <Provider store={store}>
    <BrowserRouter>
    <ThemeProvider theme={theme} >
    <App />
    </ThemeProvider>
    </BrowserRouter>
    </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
