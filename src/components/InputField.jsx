import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';

const InputField = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const state = this.props.inputState;
    return (
      <input type="text" 
        autoFocus
        disabled={state.get('disabled')}
        value={state.get('text')} 
        onChange={this.props.textChanged}
        onKeyPress={this.props.keyPressed}
        onFocus={this.props.inputFocused}
        onBlur={this.props.inputBlurred}
        ref={this.setInput} />
    );
  },
  setInput: function(input) {
    this.input = input;
  },
  componentDidUpdate: function(prevProps) {
    if (this.props.shouldFocusInput) {
      setTimeout(() => this.input.focus(), 0);
    }
  }
});

function mapStateToProps(state) {
  return {
    inputState: state.get('inputState'),
    shouldFocusInput: state.getIn(['inputState', 'shouldFocusInput'])
  };
}

export const InputFieldContainer = connect(
  mapStateToProps, actionCreators)(InputField);