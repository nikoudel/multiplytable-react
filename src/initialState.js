import {fromJS} from 'immutable';
import CellState from './CellState';
import getIconFiles from './images';

export default function() {

    const grid = [];
    const availableCells = [];
    const activeCells = [];
    const excludedCells = [];

    for (var i = 0; i < 9; i++) {

        const row = [];

        for (var j = 0; j < 9; j++) {

            const cell = {row: i, col: j};

            if (i == 0 || j == 0) {
                
                cell.isHeader = true;
                cell.isActive = false;
                cell.isExcluded = false;

                if (j > 0) cell.factor = j + 1;
                if (i > 0) cell.factor = i + 1;
                
            } else {

                cell.state = CellState.Default;
                cell.image = null;
                cell.cartoon = "/images/" + getIconFiles(i + 1, j + 1);
                availableCells.push({row: i, col: j});
            }
            
            row.push(cell);
        }

        grid.push(row);
    }

    const buttons = {
        isInMultiplicationMode: true,
        isModeLocked: false,
        isResetDown: false,
        errorCount: 0,
        checkboxes: []
    };

    for (var i = 2; i < 10; i++) {
      buttons.checkboxes.push({id: i, checked: true});
    }

    const input = {
      text: ""
    }

    const cartoon = {
        header: null,
        imageUrl: null
    }

    return fromJS({
        gridState: {grid, availableCells, activeCells, excludedCells},
        buttonsState: buttons,
        inputState: input,
        cartoonState: cartoon
    });
}