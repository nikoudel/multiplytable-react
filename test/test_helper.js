import jsdom from 'jsdom';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

chai.use(chaiImmutable);

export function getSelectedCell(store) {
  const locator = store.getState().getIn(['gridState', 'selectedCell']);
  return locator == null
    ? null 
    : store.getState().getIn(['gridState', 'grid', locator.get('row'), locator.get('col')]).toJS();
}

export function getFirstActiveCell(store) {
  const locator = store.getState().getIn(['gridState', 'activeCells', 0]);
  return locator == null
    ? null 
    : store.getState().getIn(['gridState', 'grid', locator.get('row'), locator.get('col')]).toJS();
}

export function getFirstCell(store) {
  return store.getState().getIn(['gridState', 'grid', 1, 1]).toJS();
}