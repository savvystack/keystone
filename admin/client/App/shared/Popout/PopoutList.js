/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */

import PropTypes from 'prop-types';

import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

class PopoutList extends React.Component {
    static displayName = 'PopoutList';

    static propTypes = {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
	};

    render() {
		const className = classnames('PopoutList', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	}
}

module.exports = PopoutList;

// expose the child to the top level export
module.exports.Item = require('./PopoutListItem');
module.exports.Heading = require('./PopoutListHeading');
