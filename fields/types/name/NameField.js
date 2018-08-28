// Savvy Stack: added support for middle name

import Field from '../Field';
import React, { PropTypes } from 'react';
import {
	FormInput,
	Grid,
} from '../../../admin/client/App/elemental';

const NAME_SHAPE = {
	first: PropTypes.string,
	last: PropTypes.string,
	middle: PropTypes.string,
};

module.exports = Field.create({
	displayName: 'NameField',
	statics: {
		type: 'Name',
		getDefaultValue: () => ({
			first: '',
			last: '',
			middle: '',
		}),
	},
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		paths: PropTypes.shape(NAME_SHAPE).isRequired,
		value: PropTypes.shape(NAME_SHAPE).isRequired,
	},

	valueChanged: function (which, event) {
		const { value = {}, path, onChange } = this.props;
		onChange({
			path,
			value: {
				...value,
				[which]: event.target.value,
			},
		});
	},
	changeFirst: function (event) {
		return this.valueChanged('first', event);
	},
	changeLast: function (event) {
		return this.valueChanged('last', event);
	},
	changeMiddle: function (event) {
		return this.valueChanged('middle', event);
	},
	renderValue () {
		const inputStyle = { width: '100%' };
		const { value = {}, middle = false } = this.props;

		if (middle) {
			return (
				<Grid.Row small="one-third" gutter={10}>
					<Grid.Col>
						<FormInput noedit style={inputStyle}>
							{value.first}
						</FormInput>
					</Grid.Col>
					<Grid.Col>
						<FormInput noedit style={inputStyle}>
							{value.middle}
						</FormInput>
					</Grid.Col>
					<Grid.Col>
						<FormInput noedit style={inputStyle}>
							{value.last}
						</FormInput>
					</Grid.Col>
				</Grid.Row>
			);
		} else {
			return (
				<Grid.Row small="one-half" gutter={10}>
					<Grid.Col>
						<FormInput noedit style={inputStyle}>
							{value.first}
						</FormInput>
					</Grid.Col>
					<Grid.Col>
						<FormInput noedit style={inputStyle}>
							{value.last}
						</FormInput>
					</Grid.Col>
				</Grid.Row>
			);
		}
	},
	renderField () {
		const { value = {}, paths, autoFocus, middle = false } = this.props;
		if (middle) {
			return (
				<Grid.Row small="one-third" gutter={10}>
					<Grid.Col>
						<FormInput
							autoFocus={autoFocus}
							autoComplete="off"
							name={this.getInputName(paths.first)}
							onChange={this.changeFirst}
							placeholder="First name"
							value={value.first}
						/>
					</Grid.Col>
					<Grid.Col>
						<FormInput
							autoComplete="off"
							name={this.getInputName(paths.middle)}
							onChange={this.changeMiddle}
							placeholder="Middle name"
							value={value.middle}
						/>
					</Grid.Col>
					<Grid.Col>
						<FormInput
							autoComplete="off"
							name={this.getInputName(paths.last)}
							onChange={this.changeLast}
							placeholder="Last name"
							value={value.last}
						/>
					</Grid.Col>
				</Grid.Row>
			);
		} else {
			return (
				<Grid.Row small="one-half" gutter={10}>
					<Grid.Col>
						<FormInput
							autoFocus={autoFocus}
							autoComplete="off"
							name={this.getInputName(paths.first)}
							onChange={this.changeFirst}
							placeholder="First name"
							value={value.first}
						/>
					</Grid.Col>
					<Grid.Col>
						<FormInput
							autoComplete="off"
							name={this.getInputName(paths.last)}
							onChange={this.changeLast}
							placeholder="Last name"
							value={value.last}
						/>
					</Grid.Col>
				</Grid.Row>
			);
		}
	},
});
