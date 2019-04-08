/**
 * A list item of the mobile navigation
 */

import PropTypes from 'prop-types';

import React from 'react';
import { Link } from 'react-router';

class MobileListItem extends React.Component {
	render () {
		return (
			<Link
				className={this.props.className}
				to={this.props.href}
				onClick={this.props.onClick}
				tabIndex="-1"
			>
				{this.props.children}
			</Link>
		);
	}
}

MobileListItem.displayName = 'MobileListItem';

MobileListItem.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	href: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

module.exports = MobileListItem;
