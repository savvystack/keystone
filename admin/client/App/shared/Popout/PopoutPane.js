/**
 * Render a popout pane, calls props.onLayout when the component mounts
 */

import PropTypes from 'prop-types';

import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

class PopoutPane extends React.Component {
	componentDidMount () {
		this.props.onLayout(this.refs.el.offsetHeight);
	}

	render () {
		const className = classnames('Popout__pane', this.props.className);
		const props = blacklist(this.props, 'className', 'onLayout');

		return (
			<div ref="el" className={className} {...props} />
		);
	}
}

PopoutPane.displayName = 'PopoutPane';

PopoutPane.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	onLayout: PropTypes.func,
};

PopoutPane.defaultProps = {
	onLayout: () => {},
};

module.exports = PopoutPane;
