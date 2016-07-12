import React from 'react';
import {expect} from 'chai';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {fromJS} from 'immutable';
import {GridContainer} from '../../src/components/Grid';
import {InputFieldContainer} from '../../src/components/InputField';
import reducer from '../../src/reducer';
import CellState from '../../src/cellState';
import getFactors from '../../src/factors';
import {getSelectedCell, getFirstActiveCell} from '../test_helper';
import getInitialState from '../../src/initialState';

describe('Picture', () => {

  const initialState = getInitialState();
  const store = createStore(reducer(initialState));

  it('appears when a cell is selected', () => {
    store.dispatch({type: 'RESET'});
    store.dispatch({type: 'SELECT_RANDOM_CELL'});

    const selectedCell = getSelectedCell(store);
    const header = selectedCell.row + 1 + ' * ' + (selectedCell.col + 1);

    expect(store.getState().getIn(['cartoonState', 'header'])).to.equal(header);
    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.equal(selectedCell.cartoon);

    store.dispatch({type: 'CELL_MOUSE_LEAVE'});

    expect(store.getState().getIn(['cartoonState', 'header'])).to.equal(header);
    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.equal(selectedCell.cartoon);
  });

  it('does not appear on hover until all table is solved', () => {
    store.dispatch({type: 'RESET'});
    store.dispatch({type: 'SELECT_RANDOM_CELL'});

    const selectedCell = getSelectedCell(store);
    const header = selectedCell.row + 1 + ' * ' + (selectedCell.col + 1);
    const anotherCell = store.getState().getIn(['gridState', 'grid', 1, 1]); // < 2% probability for collision

    store.dispatch({type: 'CELL_MOUSE_ENTER', cell: anotherCell.set('state', CellState.Done)});

    expect(store.getState().getIn(['cartoonState', 'header'])).to.equal(header);
    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.equal(selectedCell.cartoon);
  });

  it('appears on hover when all table is solved', () => {
    store.dispatch({type: 'RESET'});

    const cellOne = store.getState().getIn(['gridState', 'grid', 1, 1]);
    const cellTwo = store.getState().getIn(['gridState', 'grid', 1, 2]);

    store.dispatch({type: 'CELL_MOUSE_ENTER', cell: cellOne.set('state', CellState.Done)});

    expect(store.getState().getIn(['cartoonState', 'header'])).to.be.null;
    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.equal(cellOne.get('cartoon'));

    store.dispatch({type: 'CELL_MOUSE_LEAVE'});

    expect(store.getState().getIn(['cartoonState', 'header'])).to.be.null;
    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.be.null;

    store.dispatch({type: 'CELL_MOUSE_ENTER', cell: cellTwo.set('state', CellState.Done)});

    expect(store.getState().getIn(['cartoonState', 'header'])).to.be.null;
    expect(store.getState().getIn(['cartoonState', 'imageUrl'])).to.equal(cellTwo.get('cartoon'));
  });

});