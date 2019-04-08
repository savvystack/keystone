/**
 * Render a few flash messages, e.g. errors, success messages, warnings,...
 *
 * Use like this:
 * <FlashMessages
 *   messages={{
 *	   error: [{
 *	     title: 'There is a network problem',
 *	     detail: 'Please try again later...',
 *	   }],
 *   }}
 * />
 *
 * Instead of error, it can also be hilight, info, success or warning
 */

import PropTypes from 'prop-types';

import React from 'react';
import _ from 'lodash';

import FlashMessage from './FlashMessage';

class FlashMessages extends React.Component {
    // Render messages by their type
    renderMessages = (messages, type) => {
		if (!messages || !messages.length) return null;

		return messages.map((message, i) => {
			return <FlashMessage message={message} type={type} key={`i${i}`} />;
		});
	};

    // Render the individual messages based on their type
    renderTypes = (types) => {
		return Object.keys(types).map(type => this.renderMessages(types[type], type));
	};

    render() {
		if (!this.props.messages) return null;

		return (
			<div className="flash-messages">
				{_.isPlainObject(this.props.messages) && this.renderTypes(this.props.messages)}
			</div>
		);
	}
}

FlashMessages.displayName = 'FlashMessages';

FlashMessages.propTypes = {
    messages: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            error: PropTypes.array,
            hilight: PropTypes.array,
            info: PropTypes.array,
            success: PropTypes.array,
            warning: PropTypes.array,
        }),
    ]),
};

module.exports = FlashMessages;
