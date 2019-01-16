/**
 * The primary (i.e. uppermost) navigation on desktop. Renders all sections and
 * the home-, website- and signout buttons.
 */

import PropTypes from 'prop-types';

import React from 'react';
import { Container } from '../../../elemental';
import PrimaryNavItem from './NavItem';

class PrimaryNavigation extends React.Component {
    static displayName = 'PrimaryNavigation';

    static propTypes = {
		brand: PropTypes.string,
		currentSectionKey: PropTypes.string,
		sections: PropTypes.array.isRequired,
		signoutUrl: PropTypes.string,
	};

    state = {};

    // Handle resizing, hide this navigation on mobile (i.e. < 768px) screens
    componentDidMount() {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	}

    componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

    handleResize = () => {
		this.setState({
			navIsVisible: window.innerWidth >= 768,
		});
	};

    // Render the sign out button
    renderSignout = () => {
		if (!this.props.signoutUrl) return null;

		return (
			<PrimaryNavItem
				label="octicon-sign-out"
				href={this.props.signoutUrl}
				title="Sign Out"
			>
				<span className="octicon octicon-sign-out" />
			</PrimaryNavItem>
		);
	};

    // Render the back button
    renderBackButton = () => {
		if (!Keystone.backUrl) return null;

		return (
			<PrimaryNavItem
				label="octicon-globe"
				href={Keystone.backUrl}
				title={'Front page - ' + this.props.brand}
			>
				<span className="octicon octicon-globe" />
			</PrimaryNavItem>
		);
	};

    // Render the link to the webpage
    renderFrontLink = () => {
		return (
			<ul className="app-nav app-nav--primary app-nav--right">
				{this.renderBackButton()}
				{this.renderSignout()}
			</ul>
		);
	};

    renderBrand = () => {
		// TODO: support navbarLogo from keystone config

		const { brand, currentSectionKey } = this.props;
		const className = currentSectionKey === 'dashboard' ? 'primary-navbar__brand primary-navbar__item--active' : 'primary-navbar__brand';

		return (
			<PrimaryNavItem
				className={className}
				label="octicon-home"
				title={'Dashboard - ' + brand}
				to={Keystone.adminPath}
			>
				<span className="octicon octicon-home" />
			</PrimaryNavItem>
		);
	};

    // Render the navigation
    renderNavigation = () => {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			// Get the link and the class name
			const to = !section.lists[0].external && `${Keystone.adminPath}/${section.lists[0].path}`;
			const href = section.lists[0].external && section.lists[0].path;
			const isActive = this.props.currentSectionKey && this.props.currentSectionKey === section.key;
			const className = isActive ? 'primary-navbar__item--active' : null;

			return (
				<PrimaryNavItem
					active={isActive}
					key={section.key}
					label={section.label}
					className={className}
					to={to}
					href={href}
				>
					{section.label}
				</PrimaryNavItem>
			);
		});
	};

    render() {
		if (!this.state.navIsVisible) return null;

		return (
			<nav className="primary-navbar">
				<Container clearFloatingChildren>
					<ul className="app-nav app-nav--primary app-nav--left">
						{this.renderBrand()}
						{this.renderNavigation()}
					</ul>
					{this.renderFrontLink()}
				</Container>
			</nav>
		);
	}
}

module.exports = PrimaryNavigation;
