/**
 * Render a popout list heading
 */

import PropTypes from 'prop-types';

import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

class PopoutListHeading extends React.Component {
	render () {
		const className = classnames('PopoutList__heading', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	}
}

PopoutListHeading.displayName = 'PopoutListHeading';

PopoutListHeading.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

module.exports = PopoutListHeading;
