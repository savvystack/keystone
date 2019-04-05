var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');

function editorjs (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.height = options.height || 180;
	this._properties = ['height'];
	editorjs.super_.call(this, list, path, options);
}
editorjs.properName = 'Editorjs';
util.inherits(editorjs, FieldType);

editorjs.prototype.validateInput = TextType.prototype.validateInput;
editorjs.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
editorjs.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = editorjs;
