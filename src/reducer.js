import CellState from './CellState';
import getFactors from './factors';
import getRandomCell from './randomCellIndex';
import {fromJS} from 'immutable';

export default function(initialState) {

    return (state, action) => {

        switch (action.type) {
            case 'RESET':
                return initialState;
            case 'RESET_AND_SELECT':
                return selectRandomCell(initialState);
            case 'SET_STATE':
                return action.state;
            case 'SELECT_RANDOM_CELL':
                return selectRandomCell(state);
            case 'TICK':
                return onTick(state);
            case 'TOGGLE_MODE':
                return toggleMode(state);
            case 'RESET_DOWN':
                return changeResetPosition(state, true);
            case 'RESET_UP':
                return changeResetPosition(state, false);
            case 'TOGGLE_CHECKBOX':
                return toggleCheckbox(state, action.index);
            case 'TEXT_CHANGED':
                return changeText(state, action.value);
            case 'KEY_PRESSED':
                return tryEnter(state, action.key);
            case 'WRONG_ANSWER':
                return wrongAnswer(state);
            case 'CORRECT_ANSWER':
                return correctAnswer(state);
            case 'CELL_MOUSE_ENTER':
                return cellMouseEnter(state, action.cell);
            case 'CELL_MOUSE_LEAVE':
                return cellMouseLeave(state);
            case 'INPUT_FOCUSED':
                return shouldFocusInput(state, false);
            case 'INPUT_BLURRED':
                return shouldFocusInput(state, true);
        }

        return state;
    }
}

function selectRandomCell(state) {

    const oldSelectedCell = state.getIn(['gridState', 'selectedCell']);

    if (oldSelectedCell != null) {
        state = state
            .setIn(['cartoonState', 'header'], null)
            .setIn(['cartoonState', 'imageUrl'], null)
            .setIn(['gridState', 'grid', oldSelectedCell.get('row'), 0, 'isActive'], false)
            .setIn(['gridState', 'grid', 0, oldSelectedCell.get('col'), 'isActive'], false);
    }

    const index = getRandomCell(state);

    if (index < 0) {
        return state
            .setIn(['inputState', 'disabled'], true)
            .deleteIn(['gridState', 'selectedCell']);
    }

    const newSelectedCell = state.getIn(['gridState', 'availableCells', index]);

    state = state.getIn(['inputState', 'disabled'])
        ? shouldFocusInput(state, true)
        : state;

    const gridCell = getGridCell(state, newSelectedCell).toJS();

    return state
        .setIn(['cartoonState', 'header'], formatHeader(gridCell, state.getIn(['buttonsState', 'isInMultiplicationMode'])))
        .setIn(['cartoonState', 'imageUrl'], gridCell.cartoon)
        .setIn(['inputState', 'disabled'], false)
        .setIn(['gridState', 'grid', newSelectedCell.get('row'), 0, 'isActive'], true)
        .setIn(['gridState', 'grid', 0, newSelectedCell.get('col'), 'isActive'], true)
        .setIn(['gridState', 'selectedCell'], newSelectedCell)
        .updateIn(['gridState', 'availableCells'], (cells) => cells.delete(index))
        .updateIn(['gridState', 'activeCells'], (cells) => cells.push(newSelectedCell));
}

function onTick(state) {

    const activeCells = state.getIn(['gridState', 'activeCells']).filter((locator) => {

        var remainsActive = true;

        state = state.updateIn(['gridState', 'grid', locator.get('row'), locator.get('col')], (cell) => {

            switch (cell.get('state')) {
                
                case CellState.Default:
                    return cell.set('state', CellState.Question).set('image', '/images/question.png');

                case CellState.Question:
                    return cell.set('state', CellState.Default).set('image', null);

                case CellState.Sad2:
                    return cell.set('state', CellState.Sad1);

                case CellState.Sad1:
                    return cell.set('state', CellState.Default).set('image', null);

                case CellState.Happy2:
                    return cell.set('state', CellState.Happy1);

                case CellState.Happy1:
                    remainsActive = false;
                    return cell.set('state', CellState.Done).set('image', cell.get('cartoon'));

                default:
                    return cell;
            }
        });

        return remainsActive;
    });

    return state.setIn(['gridState', 'activeCells'], activeCells);
}

function changeResetPosition(state, isDown) {
    return state.setIn(['buttonsState', 'isResetDown'], isDown);
}

function toggleMode(state) {
    return state.getIn(['buttonsState', 'isModeLocked'])
        ? state
        : state.updateIn(['buttonsState', 'isInMultiplicationMode'], (mode) => !mode);
}

function toggleCheckbox(state, index) {
    const headerIndex = index + 1;
    const checked = !state.getIn(['buttonsState', 'checkboxes', index, 'checked']);

    state = state
        .setIn(['gridState', 'grid', 0, headerIndex, 'isExcluded'], !checked)
        .setIn(['gridState', 'grid', headerIndex, 0, 'isExcluded'], !checked)
        .setIn(['buttonsState', 'checkboxes', index, 'checked'], checked);

    state = updateExcludedCells(state);

    return checked && !state.hasIn(['gridState', 'selectedCell'])
        ? selectRandomCell(state)
        : state;
}

function updateExcludedCells(state) {

    const checkboxes = state
        .getIn(['buttonsState', 'checkboxes'])
        .map((cb) => cb.get('checked'))
        .toArray();

    const allCells = state
        .getIn(['gridState', 'availableCells'])
        .concat(state.getIn(['gridState', 'excludedCells']));

    const selectedCell = state.getIn(['gridState', 'selectedCell']) || fromJS({row: 0, col: 0});

    const isIndexIncluded = (index) => checkboxes[index - 1];

    const isCellIncluded = (cell) => cell.equals(selectedCell)
        || (isIndexIncluded(cell.get('row')) && isIndexIncluded(cell.get('col')));

    return state
        .setIn(['gridState', 'availableCells'], allCells.filter(isCellIncluded))
        .setIn(['gridState', 'excludedCells'], allCells.filterNot(isCellIncluded));
}

function changeText(state, value) {
    return value.match(/^[1-9]?\d?$/g)
        ? state.setIn(['inputState', 'text'], value)
        : state;
}

function evaluateUserInput(state) {
    const input = state.getIn(['inputState', 'text']);

    if (!input) return state;

    const factors = getFactors(state);
    const multiply = state.getIn(['buttonsState', 'isInMultiplicationMode']);
    const isCorrectAnswer = multiply
        ? parseInt(input) == factors.x * factors.y
        : parseInt(input) == factors.x + factors.y;

    return isCorrectAnswer
        ? correctAnswer(state)
        : wrongAnswer(state);
}

function tryEnter(state, key) {
    return key == 'Enter'
        ? evaluateUserInput(state)
        : state;
}

function wrongAnswer(state) {

    const locator = state.getIn(['gridState', 'selectedCell']).toJS();

    return state
        .setIn(['inputState', 'text'], '')
        .updateIn(['buttonsState', 'errorCount'], (count) => count + 1)
        .updateIn(['gridState', 'grid', locator.row, locator.col], (cell) => {
            return cell.set('state', CellState.Sad2).set('image', '/images/sad.png');
        });
}

function correctAnswer(state) {

    const locator = state.getIn(['gridState', 'selectedCell']).toJS();

    state = state
        .setIn(['buttonsState', 'isModeLocked'], true)
        .setIn(['inputState', 'text'], '')
        .updateIn(['gridState', 'grid', locator.row, locator.col], (cell) => {
            return cell.set('state', CellState.Happy2).set('image', '/images/happy.png');
        });

    return selectRandomCell(state);
}

function cellMouseEnter(state, cell) {
    return cell.get('state') == CellState.Done && !state.hasIn(['gridState', 'selectedCell'])
        ? state.setIn(['cartoonState', 'imageUrl'], cell.get('cartoon'))
        : state;
}

function cellMouseLeave(state) {
    return state.hasIn(['gridState', 'selectedCell'])
        ? state
        : state.setIn(['cartoonState', 'imageUrl'], null);
}

function shouldFocusInput(state, value) {
    return state.setIn(['inputState', 'shouldFocusInput'], value)
}

function getGridCell(state, locator) {
    return state.getIn(['gridState', 'grid', locator.get('row'), locator.get('col')]);
}

function formatHeader(cell, isInMultiplicationMode) {
    const sign = isInMultiplicationMode ? " * " : " + ";

    return cell.row < cell.col
        ? cell.row + 1 + sign + (cell.col + 1)
        : cell.col + 1 + sign + (cell.row + 1);
}