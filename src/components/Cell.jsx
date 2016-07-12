import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default React.createClass({
  mixins: [PureRenderMixin],
  getClassName: function(cell) {
    
    if (!cell.get('isHeader')) return null;

    var headerClass = "header";

    if (cell.get('isActive')) headerClass += " active";
    if (cell.get('isExcluded')) headerClass += " excluded";

    return headerClass;
  },
  render: function() {
    const cell = this.props.cell;
    return (
      <td className={this.getClassName(cell)}>
        {cell.get('isHeader')
          ? cell.get('factor') 
          : cell.get('image') 
            ? <img src={cell.get('image')}
                onMouseEnter={() => this.props.cellMouseEnter(cell)}
                onMouseLeave={this.props.cellMouseLeave} /> 
            : null}
      </td>
    );
  }
});