import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';

const Buttons = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const state = this.props.buttonsState;
    return (
      <div>
        <img src={state.get('isInMultiplicationMode') 
          ? state.get('isModeLocked') ? "/images/multiply_gray.png" : "/images/multiply.png"
          : state.get('isModeLocked') ? "/images/plus_gray.png" : "/images/plus.png"}
          onClick={this.props.toggleMode} />

        <img src={state.get('isResetDown') ? "/images/restart_pressed.png" : "/images/restart.png"}
          onClick={this.props.resetAndSelectNewCell} 
          onMouseDown={this.props.resetDown} 
          onMouseUp={this.props.resetUp}
          onDragEnd={this.props.resetUp} />

        <h1 className={state.get('errorCount') ? "error" : null}>
          {state.get('errorCount')}
        </h1>

        {state.get('checkboxes').map((cb, i) =>
          <div key={i}>
            <label>
              {cb.get('id')} <input
                type="checkbox"
                checked={cb.get('checked')} 
                onChange={() => this.props.toggleCheckbox(i)} />
            </label>
          </div>
        )}

        {state.has('cartoon') ? <img src={state.get('cartoon')} /> : null}

      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    buttonsState: state.get('buttonsState')
  };
}

export const ButtonsContainer = connect(
  mapStateToProps, actionCreators)(Buttons);