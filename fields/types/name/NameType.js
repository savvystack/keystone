// Savvy Stack: added support for middle name

var _ = require('lodash');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var displayName = require('display-name');

/**
 * Name FieldType Constructor
 * @extends Field
 * @api public
 */
function name (list, path, options) {
	this._fixedSize = 'full';
	this._properties = ['middle'];
	this.middle = options.middle === true;
	options.default = { first: '', last: ''};
	if (this.middle) {
		options.default['middle'] = '';
	}
	name.super_.call(this, list, path, options);
}
name.properName = 'Name';
util.inherits(name, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds String properties for .first, .last and .middle name, and a virtual
 * with get() and set() methods for .full
 *
 * @api public
 */
name.prototype.addToSchema = function (schema) {
	var paths = this.paths = {
		first: this.path + '.first',
		last: this.path + '.last',
		middle: this.path + '.middle',
		full: this.path + '.full',
	};

	schema.nested[this.path] = true;
	schema.add({
		first: String,
		last: String,
		middle: String,
	}, this.path + '.');

	schema.virtual(paths.full).get(function () {
		let first = this.get(paths.first),
			last = this.get(paths.last),
			middle = this.get(paths.middle);
		if (!this.middle || !middle) {
			return displayName(this.get(paths.first), this.get(paths.last));
		} else {
			return `${first} ${middle} ${last}`.trim().replace(/\s+/gi, ' ');
		}
	});

	schema.virtual(paths.full).set(function (value) {
		this.set(paths.middle, undefined);
		if (typeof value !== 'string') {
			this.set(paths.first, undefined);
			this.set(paths.last, undefined);
			return;
		}
		var split = value.split(' ');
		this.set(paths.first, split.shift());
		if (this.middle && split.length >= 2) {
			this.set(paths.last, split.pop());
			this.set(paths.middle, split.join(' '));
		} else {
			this.set(paths.last, split.join(' ') || undefined);
		}
	});

	this.bindUnderscoreMethods();
};

/**
 * Gets the string to use for sorting by this field
 */
name.prototype.getSortString = function (options) {
	if (options.invert) {
		return '-' + this.paths.first + ' -' + this.paths.last + (this.middle ? (' -' + this.paths.middle) : '');
	}
	return this.paths.first + ' ' + this.paths.last + (this.middle ? (' ' + this.paths.middle) : '');
};

/**
 * Add filters to a query
 */
name.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (filter.mode === 'exactly' && !filter.value) {
		query[this.paths.first] = query[this.paths.last] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		if (this.middle) {
			query[this.paths.middle] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		}
		return query;
	}
	var value = utils.escapeRegExp(filter.value);
	if (filter.mode === 'beginsWith') {
		value = '^' + value;
	} else if (filter.mode === 'endsWith') {
		value = value + '$';
	} else if (filter.mode === 'exactly') {
		value = '^' + value + '$';
	}
	value = new RegExp(value, filter.caseSensitive ? '' : 'i');
	if (filter.inverted) {
		query[this.paths.first] = query[this.paths.last] = { $not: value };
		if (this.middle) {
			query[this.paths.middle] = { $not: value };
		}
	} else {
		var first = {}; first[this.paths.first] = value;
		var last = {}; last[this.paths.last] = value;
		query.$or = [first, last, middle];
		if (this.middle) {
			var middle = {}; middle[this.paths.middle] = value;
			query.$or.push(middle);
		}
	}
	return query;
};

/**
 * Formats the field value
 */

name.prototype.format = function (item) {
	return item.get(this.paths.full);
};

/**
 * Get the value from a data object; may be simple or a pair of fields
 */
name.prototype.getInputFromData = function (data) {
	// this.getValueFromData throws an error if we pass name: null
	if (data[this.path] === null) {
		return null;
	}
	var first = this.getValueFromData(data, '_first');
	if (first === undefined) first = this.getValueFromData(data, '.first');
	var last = this.getValueFromData(data, '_last');
	if (last === undefined) last = this.getValueFromData(data, '.last');
	var middle = this.getValueFromData(data, '_middle');
	if (middle === undefined) middle = this.getValueFromData(data, '.middle');
	if (first !== undefined || last !== undefined || middle !== undefined) {
		return {
			first: first,
			last: last,
			middle: middle,
		};
	}
	return this.getValueFromData(data) || this.getValueFromData(data, '.full');
};

/**
 * Validates that a value for this field has been provided in a data object
 */
name.prototype.validateInput = function (data, callback) {
	var value = this.getInputFromData(data);
	var result = value === undefined
		|| value === null
		|| typeof value === 'string'
		|| (typeof value === 'object' && (
			typeof value.first === 'string'
			|| value.first === null
			|| typeof value.last === 'string'
			|| value.last === null
			|| typeof value.middle === 'string'
			|| value.middle === null)
		);
	utils.defer(callback, result);
};

/**
 * Validates that input has been provided
 */
name.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getInputFromData(data);
	var result;
	if (value === null) {
		result = false;
	} else {
		// Savvy Stack: TODO: skip middle name for validation?
		result = (
			typeof value === 'string' && value.length
			|| typeof value === 'object' && (
				typeof value.first === 'string' && value.first.length
				|| typeof value.last === 'string' && value.last.length)
			|| (item.get(this.paths.full)
				|| item.get(this.paths.first)
				|| item.get(this.paths.last)) && (
					value === undefined
					|| (value.first === undefined
						&& value.last === undefined))
			) ? true : false;
	}
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
name.prototype.inputIsValid = function (data, required, item) {
	// Input is valid if none was provided, but the item has data
	if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item && item.get(this.paths.full)) return true;
	// Input is valid if the field is not required
	if (!required) return true;
	// Otherwise check for valid strings in the provided data,
	// which may be nested or use flattened paths.
	if (_.isObject(data[this.path])) {
		return (data[this.path].full || data[this.path].first || data[this.path].last) ? true : false;
	} else {
		return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
	}
};

/**
 * Detects whether the field has been modified
 *
 * @api public
 */
name.prototype.isModified = function (item) {
	return item.isModified(this.paths.first) || item.isModified(this.paths.last) || (this.middle && item.isModified(this.paths.middle));
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */
name.prototype.updateItem = function (item, data, callback) {
	var paths = this.paths;
	var value = this.getInputFromData(data);
	if (typeof value === 'string' || value === null) {
		item.set(paths.full, value);
	} else if (typeof value === 'object') {
		if (typeof value.first === 'string' || value.first === null) {
			item.set(paths.first, value.first);
		}
		if (typeof value.last === 'string' || value.last === null) {
			item.set(paths.last, value.last);
		}
		if (this.middle && (typeof value.middle === 'string' || value.middle === null)) {
			item.set(paths.middle, value.middle);
		}
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = name;
