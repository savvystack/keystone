// Savvy Stack: added support for middle name

import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';
import displayName from 'display-name';

var NameColumn = React.createClass({
	displayName: 'NameColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
	},
	renderValue () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || (!value.first && !value.last)) return '(no name)';
		if (!this.props.middle || !value.middle) {
			return displayName(value.first, value.last);
		} else {
			return `${value.first} ${value.middle} ${value.last}`.trim().replace(/\s+/gi, ' ');
		}
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue to={this.props.linkTo} padded interior field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = NameColumn;
