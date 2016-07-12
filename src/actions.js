export function reset() {
  return {
    type: 'RESET'
  };
}

export function resetAndSelectNewCell() {
  return {
    type: 'RESET_AND_SELECT'
  };
}

export function toggleMode() {
  return {
    type: 'TOGGLE_MODE'
  };
}

export function resetDown() {
  return {
    type: 'RESET_DOWN'
  };
}

export function resetUp() {
  return {
    type: 'RESET_UP'
  };
}

export function toggleCheckbox(index) {
  return {
    type: 'TOGGLE_CHECKBOX',
    index
  };
}

export function textChanged(evt) {
  return {
    type: 'TEXT_CHANGED',
    value: evt.target.value
  };
}

export function keyPressed(evt) {
  return {
    type: 'KEY_PRESSED',
    key: evt.key
  };
}

export function cellMouseEnter(cell) {
  return {
    type: 'CELL_MOUSE_ENTER',
    cell
  };
}

export function cellMouseLeave() {
  return {
    type: 'CELL_MOUSE_LEAVE'
  };
}

export function inputFocused() {
  return {
    type: 'INPUT_FOCUSED'
  };
}

export function inputBlurred() {
  return {
    type: 'INPUT_BLURRED'
  };
}