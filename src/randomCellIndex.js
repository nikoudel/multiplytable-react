export default function(state) {

    const cells = state.getIn(['gridState', 'availableCells']);

    return cells.size > 0
        ? Math.floor(Math.random() * cells.size)
        : -1;
}