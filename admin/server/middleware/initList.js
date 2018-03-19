const _ = require('lodash');

module.exports = function initList (req, res, next) {
	var keystone = req.keystone;
	req.list = keystone.list(req.params.list);
	if (!req.list) {
		return reportError(req, res, `invalid list path`, `List ${req.params.list} could not be found.`);
	}
	// Savvy Stack: "organizers" are only authrized to access conference/talk/user related models
	var nav = keystone.get('nav');
	if (req.user.isOrganizer && req.params.list !== 'users' &&
		_.indexOf(nav.conferences, req.params.list) < 0 && _.indexOf(nav['conference talks'], req.params.list) < 0) {
		return reportError(req, res, `no access`, `Need permission to access list ${req.params.list}.`);
	}
	next();
};

// Savvy Stack: extract error reporting funictionally into function to reuse
const reportError = (req, res, jsonMessage, flashMessage) => {
	var keystone = req.keystone;
	if (req.headers.accept === 'application/json') {
		return res.status(404).json({ error: jsonMessage });
	}
	req.flash('error', flashMessage);
	return res.redirect('/' + keystone.get('admin path'));
};
