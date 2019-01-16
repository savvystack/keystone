/**
 * Render a header for a popout
 */

import PropTypes from 'prop-types';

import React from 'react';
import Transition from 'react-addons-css-transition-group';

class PopoutHeader extends React.Component {
    static displayName = 'PopoutHeader';

    static propTypes = {
		leftAction: PropTypes.func,
		leftIcon: PropTypes.string,
		title: PropTypes.string.isRequired,
		transitionDirection: PropTypes.oneOf(['next', 'prev']),
	};

    render() {
		// If we have a left action and a left icon, render a header button
		var headerButton = (this.props.leftAction && this.props.leftIcon) ? (
			<button
				key={'button_' + this.props.transitionDirection}
				type="button"
				className={'Popout__header__button octicon octicon-' + this.props.leftIcon}
				onClick={this.props.leftAction}
			/>
		) : null;
		// If we have a title, render it
		var headerTitle = this.props.title ? (
			<span
				key={'title_' + this.props.transitionDirection}
				className="Popout__header__label"
			>
				{this.props.title}
			</span>
		) : null;

		return (
			<div className="Popout__header">
				<Transition
					transitionName="Popout__header__button"
					transitionEnterTimeout={200}
					transitionLeaveTimeout={200}
				>
					{headerButton}
				</Transition>
				<Transition
					transitionName={'Popout__pane-' + this.props.transitionDirection}
					transitionEnterTimeout={360}
					transitionLeaveTimeout={360}
				>
					{headerTitle}
				</Transition>
			</div>
		);
	}
}

module.exports = PopoutHeader;
