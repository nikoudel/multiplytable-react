import React from 'react';
import {expect} from 'chai';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';
import {renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate} from 'react-addons-test-utils';
import {GridContainer} from '../../src/components/Grid';
import {InputFieldContainer} from '../../src/components/InputField';
import reducer from '../../src/reducer';
import CellState from '../../src/cellState';
import getFactors from '../../src/factors';
import {getSelectedCell, getFirstActiveCell} from '../test_helper';

describe('Input', () => {

  const grid = [
    [{}, {isHeader: true, factor: 2}],
    [{isHeader: true, isActive: true, factor: 2}, {image: null, state: CellState.Default}]
  ];

  const availableCells = [{row: 1, col: 1}];
  const activeCells = [];

  const inputState = {text: '23'}

  const initialState = fromJS({gridState: {grid, availableCells, activeCells}, inputState});
  const store = createStore(reducer(initialState));

  store.dispatch({type: 'RESET'});
  store.dispatch({type: 'SELECT_RANDOM_CELL'});

  const component = renderIntoDocument(
    <Provider store={store}>
      <div>
        <GridContainer />
        <InputFieldContainer />
      </div>
    </Provider>
  );

  const input = scryRenderedDOMComponentsWithTag(component, 'input');

  it('renders input element', () => {
    expect(input.length).to.equal(1);
    expect(input[0].value).to.equal('23');
  });

  it('updates state upon value change and prevents invalid user input', () => {
    Simulate.change(input[0], {target: {value: '34'}})
    expect(input[0].value).to.equal('34');

    Simulate.change(input[0], {target: {value: 'Doh!'}})
    expect(input[0].value).to.equal('34');
  });

  it('evaluates user input', () => {
    const factors = getFactors(store.getState());

    expect(factors.x).to.equal(2);
    expect(factors.y).to.equal(2);

    Simulate.change(input[0], {target: {value: '5'}});
    Simulate.keyPress(input[0], {key: 'Enter'});

    expect(input[0].value).to.equal('');
    expect(getSelectedCell(store).state).to.equal(CellState.Sad2);

    Simulate.change(input[0], {target: {value: '4'}});
    Simulate.keyPress(input[0], {key: 'Enter'});

    expect(input[0].value).to.equal('');
    expect(getSelectedCell(store)).to.be.null;
    expect(getFirstActiveCell(store).state).to.equal(CellState.Happy2);
  });

  it('returns focus when blurred', () => {
    Simulate.focus(input[0]);
    expect(store.getState().getIn(['inputState', 'shouldFocusInput'])).to.equal(false);
    
    Simulate.blur(input[0]);
    expect(store.getState().getIn(['inputState', 'shouldFocusInput'])).to.equal(true);
  });
});