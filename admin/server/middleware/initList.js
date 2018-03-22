const _ = require('lodash');

module.exports = function initList (req, res, next) {
	var keystone = req.keystone,
		nav = keystone.get('nav'),
		request = parseRequest(req);

	req.list = request.list;
	if (!req.list) {
		return reportError(req, res, `invalid list path`, `List ${req.params.list} could not be found.`);

	// Savvy Stack: if list has method "canAccess()", call it to determine accessibility
	} else if (!req.list.model.canAccess || !req.list.model.canAccess(request)) {
		return reportError(req, res, `no access`, `Need permission to ${request.action} ${req.params.list}${request.id ? '(' + request.id + ')' : ''}.`);

	// Savvy Stack: "organizers" are only authrized to access conference/talk/user related models
	} else if (req.user.isOrganizer && req.params.list !== 'users' &&
		_.indexOf(nav.conferences, req.params.list) < 0 && _.indexOf(nav['conference talks'], req.params.list) < 0) {
		return reportError(req, res, `no access`, `Need permission to ${request.action} ${req.params.list}${request.id ? '(' + request.id + ')' : ''}.`);

	} else {
		next();
	}
};

// Savvy Stack: parse parameters on URL
const parseRequest = (req) => {
	let results = {
		req: req,
		list: keystone.list(req.params.list) || null,
		id: req.params.id || null,
		// format: req.params.format || null,
		// sortOrder: req.params.sortOrder || null,
		// newOrder: req.params.newOrder || null,
		action: req.path.endsWith('/create') ? 'create' :
				req.path.endsWith('/update') ? 'update' :
				req.path.endsWith('/delete') ? 'delete' :
				req.path.indexOf('/sortOrder/') > 0 ? 'sort' : null
	};
	if (!results.action) {
		if (req.params.format) {
			results.action = 'download';
		} else if (results.id !== null && req.method == 'POST') {
			results.action = 'update';
		} else {
			results.action = 'get';
		}
	}
	return results;
};

// Savvy Stack: extract error reporting funictionally into function to reuse
const reportError = (req, res, jsonMessage, flashMessage) => {
	if (req.headers.accept === 'application/json') {
		return res.status(404).json({ error: jsonMessage });
	} else {
		req.flash('error', flashMessage);
		return res.redirect('/' + req.keystone.get('admin path'));
	}
};
