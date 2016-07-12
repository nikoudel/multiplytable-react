import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';
import {GridContainer} from './components/Grid';
import {ButtonsContainer} from './components/Buttons';
import {InputFieldContainer} from './components/InputField';
import {CartoonContainer} from './components/Cartoon';
import getInitialState from './initialState';
import localStorageMiddleware from './localStorageMiddleware';

const createStoreWithMiddleware = applyMiddleware(localStorageMiddleware)(createStore);

const initialState = getInitialState();

const store = createStoreWithMiddleware(reducer(initialState));

const savedState = fromJS(JSON.parse(localStorage.getItem("kertotaulu")));

if (savedState == null) {
  store.dispatch({type: 'SET_STATE', state: initialState});
  store.dispatch({type: 'SELECT_RANDOM_CELL'});
} else {
  store.dispatch({type: 'SET_STATE', state: savedState});
}

setInterval(() => store.dispatch({type: 'TICK'}), 1000);

const app = (
  <Provider store={store}>
    <div>
        <div id="main">
          <div id="grid">
            <GridContainer />
          </div>
          <div id="input">
            <InputFieldContainer />
          </div>
        </div>
        <div id="right">
          <div id="buttons">
            <ButtonsContainer />
          </div>
          <div id="cartoon">
            <CartoonContainer />
          </div>
        </div>
    </div>
  </Provider>
);

ReactDOM.render(app, document.getElementById('app'));