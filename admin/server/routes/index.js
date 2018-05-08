var _ = require('lodash');
var ejs = require('ejs');
var path = require('path');

var templatePath = path.resolve(__dirname, '../templates/index.html');

// Savvy Stack
// TODO: move this into list schema
const Permission = {
	organizer: {
		// Permissions for actions
		access: ['AttendeeType', 'Conference', 'ConferenceType', 'OrderItemConference', 'ProductConference', 'RegistrationStage', 'Talk', 'TalkTopic', 'TalkTopicCategory'],
		create: ['ProductConference', 'Talk'],
		edit: ['Conference', 'ProductConference', 'Talk'],
		delete: ['ProductConference', 'Talk'],
		// Permissions for sections on Amdin UI home page
		sections: ['conferences', 'conference talks']
	}
};

module.exports = function IndexRoute (req, res) {
	var keystone = req.keystone;
	var lists = {};
	var organizer = req.user && !req.user.isAdmin && req.user.isOrganizer;
	_.forEach(keystone.lists, function (list, key) {
		// Savvy Stack
		// Backup original permissions
		if (list.options._hidden !== true && list.options._hidden !== false) {
			list.options._hidden = list.options.hidden === true;
			list.options._nocreate = list.options.nocreate === true;
			list.options._noedit = list.options.noedit === true;
			list.options._nodelete = list.options.nodelete === true;
		}
		// Set accessiblity for lists
		if (organizer) {
			list.options.hidden = Permission.organizer.access.indexOf(key) < 0;
			list.options.nocreate = list.options.hidden || Permission.organizer.create.indexOf(key) < 0;
			list.options.noedit = list.options.hidden || Permission.organizer.edit.indexOf(key) < 0;
			list.options.nodelete = list.options.hidden || Permission.organizer.delete.indexOf(key) < 0;
		} else {
			list.options.hidden = list.options._hidden;
			list.options.nocreate = list.options._nocreate;
			list.options.noedit = list.options._noedit;
			list.options.nodelete = list.options._nodelete;
		}

		lists[key] = list.getOptions();
	});

	var UserList = keystone.list(keystone.get('user model'));

	var orphanedLists = keystone.getOrphanedLists().map(function (list) {
		return _.pick(list, ['key', 'label', 'path']);
	});

	var backUrl = keystone.get('back url');
	if (backUrl === undefined) {
		// backUrl can be falsy, to disable the link altogether
		// but if it's undefined, default it to "/"
		backUrl = '/';
	}

	// Savvy Stack
	// Modify keystone.nav based on user's role
	// Hardcodded for now: organizers can only see conferences and talks
	let userNav = keystone.nav,
		userOrphanedLists = orphanedLists;
	if (organizer) {
		userNav = {
			sections: _.reduce(keystone.nav.sections, (sections, section) => {
				if (Permission.organizer.sections.indexOf(section.key) >= 0) {
					section.lists = _.reduce(section.lists, (lists, list) => {
						if (Permission.organizer.access.indexOf(list.key) >= 0) {
							lists.push(list);
						}
						return lists;
					}, []),
					sections.push(section);
				}
				return sections;
			}, []),
			by: {
				list: _.reduce(keystone.nav.by.list, (listMap, listOptions, key) => {
					if (Permission.organizer.access.indexOf(key) >= 0) {
						listOptions.lists = _.reduce(listOptions.lists, (lists, list) => {
							if (Permission.organizer.access.indexOf(list.key) >= 0) {
								lists.push(list);
							}
							return lists;
						}, []),
						listMap[key] = listOptions;
					}
					return listMap;
				}, {}),
				section: _.reduce(keystone.nav.by.section, (sections, section, key) => {
					if (Permission.organizer.sections.indexOf(key) >= 0) {
						section.lists = _.reduce(section.lists, (lists, list) => {
							if (Permission.organizer.access.indexOf(list.key) >= 0) {
								lists.push(list);
							}
							return lists;
						}, []),
						sections[key] = section;
					}
					return sections;
				}, {}),
			}
		};
		userOrphanedLists = [];
	}
	
	var keystoneData = {
		adminPath: '/' + keystone.get('admin path'),
		appversion: keystone.get('appversion'),
		backUrl: backUrl,
		brand: keystone.get('brand'),
		csrf: { header: {} },
		devMode: !!process.env.KEYSTONE_DEV,
		lists: lists,
		// Savvy Stack
		nav: userNav,
		orphanedLists: userOrphanedLists,
		// nav: keystone.nav,
		// orphanedLists: orphanedLists,
		signoutUrl: keystone.get('signout url'),
		user: {
			id: req.user.id,
			name: UserList.getDocumentName(req.user) || '(no name)',
		},
		userList: UserList.key,
		version: keystone.version,
		wysiwyg: { options: {
			enableImages: keystone.get('wysiwyg images') ? true : false,
			enableCloudinaryUploads: keystone.get('wysiwyg cloudinary images') ? true : false,
			enableS3Uploads: keystone.get('wysiwyg s3 images') ? true : false,
			additionalButtons: keystone.get('wysiwyg additional buttons') || '',
			additionalPlugins: keystone.get('wysiwyg additional plugins') || '',
			additionalOptions: keystone.get('wysiwyg additional options') || {},
			overrideToolbar: keystone.get('wysiwyg override toolbar'),
			skin: keystone.get('wysiwyg skin') || 'keystone',
			menubar: keystone.get('wysiwyg menubar'),
			importcss: keystone.get('wysiwyg importcss') || '',
		} },
	};
	keystoneData.csrf.header[keystone.security.csrf.CSRF_HEADER_KEY] = keystone.security.csrf.getToken(req, res);

	var codemirrorPath = keystone.get('codemirror url path')
		? '/' + keystone.get('codemirror url path')
		: '/' + keystone.get('admin path') + '/js/lib/codemirror';

	var locals = {
		adminPath: keystoneData.adminPath,
		cloudinaryScript: false,
		codemirrorPath: codemirrorPath,
		env: keystone.get('env'),
		fieldTypes: keystone.fieldTypes,
		ga: {
			property: keystone.get('ga property'),
			domain: keystone.get('ga domain'),
		},
		keystone: keystoneData,
		title: keystone.get('name') || 'Keystone',
	};

	var cloudinaryConfig = keystone.get('cloudinary config');
	if (cloudinaryConfig) {
		var cloudinary = require('cloudinary');
		var cloudinaryUpload = cloudinary.uploader.direct_upload();
		keystoneData.cloudinary = {
			cloud_name: keystone.get('cloudinary config').cloud_name,
			api_key: keystone.get('cloudinary config').api_key,
			timestamp: cloudinaryUpload.hidden_fields.timestamp,
			signature: cloudinaryUpload.hidden_fields.signature,
		};
		locals.cloudinaryScript = cloudinary.cloudinary_js_config();
	};

	ejs.renderFile(templatePath, locals, {}, function (err, str) {
		if (err) {
			console.error('Could not render Admin UI Index Template:', err);
			return res.status(500).send(keystone.wrapHTMLError('Error Rendering Admin UI', err.message));
		}
		res.send(str);
	});
};
