import Field from '../Field';
import React from 'react';
import EditorJs from '@editorjs/editorjs';
import { FormInput } from '../../../admin/client/App/elemental';
import evalDependsOn from '../../utils/evalDependsOn';

/**
 * TODO:
 * - Remove dependency on underscore
 */

var lastId = 0;

function getId () {
	return 'keystone-editorjs-' + lastId++;
}

module.exports = Field.create({

	displayName: 'EditorjsField',
	statics: {
		type: 'Editorjs',
	},

	getInitialState () {
		return {
			id: getId(),
			isFocused: false,
            wysiwygActive: false,
		};
	},

	initWysiwyg () {
        var self = this;

		this._currentValue = this.props.value;
		this.editor = new EditorJs({
            holderId: this.state.id,
            data: this.props.value,
            onReady: function() {
                var editor = self.editor;
                var editorElem = document.getElementById(editor.configuration.holderId);
                editorElem.addEventListener('focus', self.focusChanged.bind(self, true));
                editorElem.addEventListener('blur', self.focusChanged.bind(self, false));
            },
            onChange: this.valueChanged,
        });

		if (evalDependsOn(this.props.dependsOn, this.props.values)) {
			this.setState({ wysiwygActive: true });
		}
	},

	removeWysiwyg (state) {
		this.editor.destroy();
		this.setState({ wysiwygActive: false });
	},

	componentDidUpdate (prevProps, prevState) {
		if (prevState.isCollapsed && !this.state.isCollapsed) {
			this.initWysiwyg();
		}
	},

	componentDidMount () {
		this.initWysiwyg();
	},

    componentWillReceiveProps (nextProps) {
		if (this.editor && this._currentValue !== nextProps.value) {
			this.editor.blocks.render(nextProps.value);
		}
	},

	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		});
	},

	valueChanged (event) {
		if (this.editor) {
            var self = this;
			this.editor.save()
                .then(function (saveData) {
                    self._currentValue = saveData;
            		self.props.onChange({
            			path: self.props.path,
            			value: saveData,
            		});
                })
                .catch(function (err) {
                    throw err;
                });
		}
	},

	renderField () {
		var className = this.state.isFocused ? 'is-focused' : '';
		var style = {
			height: this.props.height,
		};
		return (
			<div
                id={this.state.id}
                style={style}
                className={className}
            >
            </div>
		);
	},

	renderValue () {
		return (
			<FormInput multiline noedit>
				{this.props.value}
			</FormInput>
		);
	},

});
