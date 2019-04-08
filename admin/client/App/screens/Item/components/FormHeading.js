import PropTypes from 'prop-types';
import React from 'react';
import evalDependsOn from '../../../../../../fields/utils/evalDependsOn';

class FormHeading extends React.Component {
	render () {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		return <h3 className="form-heading">{this.props.content}</h3>;
	}
};

FormHeading.displayName = 'FormHeading';

FormHeading.propTypes = {
	options: PropTypes.object,
};

module.exports = FormHeading;
