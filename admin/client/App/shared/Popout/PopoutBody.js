/**
 * Render the body of a popout
 */

import PropTypes from 'prop-types';

import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

class PopoutBody extends React.Component {
	render () {
		const className = classnames('Popout__body', {
			'Popout__scrollable-area': this.props.scrollable,
		}, this.props.className);
		const props = blacklist(this.props, 'className', 'scrollable');

		return (
			<div className={className} {...props} />
		);
	}
}

PopoutBody.displayName = 'PopoutBody';

PopoutBody.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	scrollable: PropTypes.bool,
};

module.exports = PopoutBody;
