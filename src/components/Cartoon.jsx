import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';

const Cartoon = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const header = this.props.cartoonState.get('header');
    const imageUrl = this.props.cartoonState.get('imageUrl');
    return (
        <div>
            <h1>{header}</h1>
            <img src={imageUrl} />
        </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    cartoonState: state.get('cartoonState')
  };
}

export const CartoonContainer = connect(mapStateToProps)(Cartoon);