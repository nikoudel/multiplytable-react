export default function(state) {

    const locator = state.getIn(['gridState', 'selectedCell']).toJS();

    const x = state.getIn(['gridState', 'grid', locator.row, 0, 'factor']);
    const y = state.getIn(['gridState', 'grid', 0, locator.col, 'factor']);

    return {x, y}
}