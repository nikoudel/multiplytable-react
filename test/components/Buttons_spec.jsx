import React from 'react';
import {expect} from 'chai';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate} from 'react-addons-test-utils';
import {ButtonsContainer} from '../../src/components/Buttons';
import reducer from '../../src/reducer';
import getInitialState from '../../src/initialState';

describe('Buttons', () => {

  const initialState = getInitialState();
  const store = createStore(reducer(initialState));

  store.dispatch({type: 'RESET'});

  const component = renderIntoDocument(
    <Provider store={store}>
      <ButtonsContainer />
    </Provider>
  );

  const images = scryRenderedDOMComponentsWithTag(component, 'img');
  const inputs = scryRenderedDOMComponentsWithTag(component, 'input');
  const counter = scryRenderedDOMComponentsWithTag(component, 'h1');

  const modeButton = images[0];
  const resetButton = images[1];

  it('renders buttons and checkboxes', () => {
    expect(images.length).to.equal(3);
    expect(inputs.length).to.equal(8);
    expect(counter.length).to.equal(1);
    expect(modeButton.src).to.equal("/images/multiply.png");
    expect(resetButton.src).to.equal("/images/restart.png");
    expect(inputs[0].checked).to.equal(true);
  });

  it('resets state back to initial', () => {
    Simulate.click(modeButton);
    store.dispatch({type: 'RESET'});
    expect(store.getState()).to.equal(initialState);
  });

  it('toggles multiplication vs. addition mode', () => {
    expect(store.getState().getIn(['buttonsState', 'isInMultiplicationMode'])).to.equal(true);
    Simulate.click(modeButton);
    expect(store.getState().getIn(['buttonsState', 'isInMultiplicationMode'])).to.equal(false);
  });

  it('changes color of reset button when pushed down', () => {
    expect(store.getState().getIn(['buttonsState', 'isResetDown'])).to.equal(false);

    Simulate.mouseDown(resetButton);
    expect(store.getState().getIn(['buttonsState', 'isResetDown'])).to.equal(true);

    Simulate.mouseUp(resetButton);
    expect(store.getState().getIn(['buttonsState', 'isResetDown'])).to.equal(false);

    Simulate.mouseDown(resetButton);
    Simulate.dragEnd(resetButton);
    expect(store.getState().getIn(['buttonsState', 'isResetDown'])).to.equal(false);
  });

  it('toggles checkbox state', () => {
    expect(store.getState().getIn(['buttonsState', 'checkboxes', 0, 'checked'])).to.equal(true);
    Simulate.change(inputs[0]);
    expect(store.getState().getIn(['buttonsState', 'checkboxes', 0, 'checked'])).to.equal(false);
  });

  it('disables mode button after first answer', () => {
    expect(store.getState().getIn(['buttonsState', 'isModeLocked'])).to.equal(false);

    store.dispatch({type: 'RESET'});
    store.dispatch({type: 'SELECT_RANDOM_CELL'});

    expect(store.getState().getIn(['buttonsState', 'isModeLocked'])).to.equal(false);

    store.dispatch({type: 'CORRECT_ANSWER'});

    expect(store.getState().getIn(['buttonsState', 'isModeLocked'])).to.equal(true);

    expect(store.getState().getIn(['buttonsState', 'isInMultiplicationMode'])).to.equal(true);
    Simulate.click(modeButton);
    expect(store.getState().getIn(['buttonsState', 'isInMultiplicationMode'])).to.equal(true);

    store.dispatch({type: 'RESET'});

    expect(store.getState().getIn(['buttonsState', 'isModeLocked'])).to.equal(false);
  });

  it('excludes unchecked multipliers', () => {
    
    store.dispatch({type: 'RESET'});

    expect(store.getState().getIn(['gridState', 'grid', 0, 1, 'isExcluded'])).to.equal(false);
    expect(store.getState().getIn(['gridState', 'grid', 1, 0, 'isExcluded'])).to.equal(false);
    expect(store.getState().getIn(['gridState', 'excludedCells']).size).to.equal(0);
    expect(store.getState().getIn(['gridState', 'availableCells']).size).to.equal(64);
    
    Simulate.change(inputs[0]);

    expect(store.getState().getIn(['gridState', 'grid', 0, 1, 'isExcluded'])).to.equal(true);
    expect(store.getState().getIn(['gridState', 'grid', 1, 0, 'isExcluded'])).to.equal(true);
    expect(store.getState().getIn(['gridState', 'excludedCells']).size).to.equal(15);
    expect(store.getState().getIn(['gridState', 'availableCells']).size).to.equal(64 - 15);

    store.dispatch({type: 'SELECT_RANDOM_CELL'});

    const selectedCell = store.getState().getIn(['gridState', 'selectedCell']).toJS();

    Simulate.change(inputs[selectedCell.row - 1]); // non-header cell index starts from 1

    expect(store.getState().getIn(['gridState', 'grid', 0, selectedCell.row, 'isExcluded'])).to.equal(true);
    expect(store.getState().getIn(['gridState', 'grid', selectedCell.row, 0, 'isExcluded'])).to.equal(true);
    expect(store.getState().getIn(['gridState', 'excludedCells']).size).to.equal(27);
    expect(store.getState().getIn(['gridState', 'availableCells']).size).to.equal(64 - 27 - 1); // 1 for selected cell (not in availableCells)
  });

  it('increases error counter', () => {

    store.dispatch({type: 'RESET'});
    store.dispatch({type: 'SELECT_RANDOM_CELL'});
    store.dispatch({type: 'WRONG_ANSWER'});

    expect(store.getState().getIn(['buttonsState', 'errorCount'])).to.equal(1);
  });
});