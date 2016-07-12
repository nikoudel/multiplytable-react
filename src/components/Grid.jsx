import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {connect} from 'react-redux';
import Cell from './Cell';
import * as actionCreators from '../actions';

const Grid = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const rows = this.props.gridState;
    return (
      <table>
        <tbody>
          {rows.map((row, i) =>
            <tr key={i}>
              {row.map((cell, j) =>
                <Cell key={j} cell={cell}
                  cellMouseEnter={this.props.cellMouseEnter}
                  cellMouseLeave={this.props.cellMouseLeave} />
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
});

function mapStateToProps(state) {
  return {
    gridState: state.getIn(['gridState', 'grid'])
  };
}

export const GridContainer = connect(mapStateToProps, actionCreators)(Grid);