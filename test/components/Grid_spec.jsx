import React from 'react';
import {expect} from 'chai';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';
import {renderIntoDocument, scryRenderedDOMComponentsWithTag} from 'react-addons-test-utils';
import {GridContainer} from '../../src/components/Grid';
import reducer from '../../src/reducer';
import CellState from '../../src/CellState';
import {getSelectedCell, getFirstActiveCell, getFirstCell} from '../test_helper';

const questionUrl = '/images/question.png';
const sadFaceUrl = '/images/sad.png';
const happyFaceUrl = '/images/happy.png';
const cartoonUrl = '/images/cartoon.jpg';

describe('Grid', () => {

  const grid = [
    [{}, {isHeader: true, factor: 2}],
    [{isHeader: true, factor: 2}, {image: null, cartoon: cartoonUrl, state: CellState.Default}]
  ];

  const availableCells = [{row: 1, col: 1}];
  const activeCells = [];
  const excludedCells = [];

  const initialState = fromJS({
    gridState: {grid, availableCells, activeCells, excludedCells},
    cartoonState: {imageUrl: null}
  });

  const store = createStore(reducer(initialState));

  store.dispatch({type: 'RESET'});
  store.dispatch({type: 'SELECT_RANDOM_CELL'});

  const component = renderIntoDocument(
    <Provider store={store}>
      <GridContainer />
    </Provider>
  );

  it('renders rows and cells', () => {

    const rowElements = scryRenderedDOMComponentsWithTag(component, 'tr');
    const cells = scryRenderedDOMComponentsWithTag(component, 'td');

    expect(rowElements.length).to.equal(2);
    expect(cells.length).to.equal(4);

    expect(cells[0].textContent).to.equal('');
    expect(cells[1].textContent).to.equal('2');

    expect(store.getState().getIn(['gridState', 'grid', 0, 1, 'isActive'])).to.be.true;
    expect(store.getState().getIn(['gridState', 'grid', 1, 0, 'isActive'])).to.be.true;
    expect(cells[1].className).to.equal('header active');
    expect(cells[2].className).to.equal('header active');
  });

  it('displays question icon', () => {

    expect(store.getState().getIn(['gridState', 'availableCells']).isEmpty()).to.be.true;
    expect(store.getState().hasIn(['gridState', 'selectedCell'])).to.be.true;
    expect(store.getState().getIn(['gridState', 'activeCells']).isEmpty()).to.be.false;

    expect(getSelectedCell(store).state).to.equal(CellState.Default);
    expect(getSelectedCell(store).image).to.be.null;

    store.dispatch({type: 'TICK'});
    expect(getSelectedCell(store).state).to.equal(CellState.Question);
    expect(getSelectedCell(store).image).to.equal(questionUrl);

    store.dispatch({type: 'TICK'});
    expect(getSelectedCell(store).state).to.equal(CellState.Default);
    expect(getSelectedCell(store).image).to.be.null;
  });

  it('displays sad face', () => {

    store.dispatch({type: 'WRONG_ANSWER'});

    expect(getSelectedCell(store).state).to.equal(CellState.Sad2);
    expect(getSelectedCell(store).image).to.equal(sadFaceUrl);

    store.dispatch({type: 'TICK'});
    expect(getSelectedCell(store).state).to.equal(CellState.Sad1);
    expect(getSelectedCell(store).image).to.equal(sadFaceUrl);

    store.dispatch({type: 'TICK'});
    expect(getSelectedCell(store).state).to.equal(CellState.Default);
    expect(getSelectedCell(store).image).to.be.null;

    store.dispatch({type: 'TICK'});
    expect(getSelectedCell(store).state).to.equal(CellState.Question);
    expect(getSelectedCell(store).image).to.equal(questionUrl);
  });

  it('displays happy face', () => {

    store.dispatch({type: 'CORRECT_ANSWER'});

    expect(getFirstActiveCell(store).state).to.equal(CellState.Happy2);
    expect(getFirstActiveCell(store).image).to.equal(happyFaceUrl);

    store.dispatch({type: 'TICK'});
    expect(getFirstActiveCell(store).state).to.equal(CellState.Happy1);
    expect(getFirstActiveCell(store).image).to.equal(happyFaceUrl);

    store.dispatch({type: 'TICK'});
    expect(getFirstActiveCell(store)).to.be.null;
    expect(getFirstCell(store).state).to.equal(CellState.Done);
    expect(getFirstCell(store).image).to.equal(getFirstCell(store).cartoon);
  });

  it('displays and hides a cartoon on hover', () => {
    
    store.dispatch({type: 'RESET'});
    store.dispatch({type: 'SELECT_RANDOM_CELL'});
    store.dispatch({type: 'CORRECT_ANSWER'});
    store.dispatch({type: 'TICK'});
    store.dispatch({type: 'TICK'});

    expect(getFirstCell(store).image).to.equal(cartoonUrl);

    store.dispatch({
      type: 'CELL_MOUSE_ENTER',
      cell: store.getState().getIn(['gridState', 'grid', 1, 1])
    });

    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.equal(cartoonUrl);

    store.dispatch({type: 'CELL_MOUSE_LEAVE'});

    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.be.null;
  });

});