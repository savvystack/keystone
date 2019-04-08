// const _ = require('lodash');

// module.exports = function initList (req, res, next) {
// 	var //nav = req.keystone.get('nav'),
// 		accessRequest = parseRequest(req);

// 	req.list = accessRequest.list;
// 	if (!req.list) {
// 		return reportError(req, res, 404, `Invalid list path`, `List ${req.params.list} could not be found.`);

// 	// Savvy Stack: admin can access everything
// 	} else if (req.user && req.user.isAdmin) {
// 		return next();

// 	// Savvy Stack: if list has method "canAccessInAdminUI()", call it to determine accessibility
// 	} else if (req.list.model.canAccessInAdminUI) {
// 		req.list.model.canAccessInAdminUI(accessRequest, req)
// 			.then(allowed => {
// 				if (allowed) {
// 					return next();
// 				} else {
// 					return reportError(req, res, 403, `No access`, `Need permission to ${accessRequest.action} ${req.params.list}${accessRequest.id ? '(' + accessRequest.id + ')' : ''}.`);
// 				}
// 			})
// 			.catch(err => {
// 				return reportError(req, res, 404, `Invalid ID`, `List document ${req.params.list}${accessRequest.id ? '(' + accessRequest.id + ')' : ''} could not be found.`);
// 			});

// 	// Savvy Stack: all other situations, not allowed
// 	} else {
// 		return reportError(req, res, 403, `No access`, `Need permission to ${accessRequest.action} ${req.params.list}${accessRequest.id ? '(' + accessRequest.id + ')' : ''}.`);
// 	}
// };

// // Savvy Stack: parse parameters on URL
// const parseRequest = (req) => {
// 	let ids = req.params.id && req.params.id.length > 0 ? req.params.id :
// 		req.body.id && req.body.id.length > 0 ? req.body.id :
// 		req.body.ids && req.body.ids.length > 0 ? req.body.ids : null;
// 	if (ids && !req.keystone.utils.isArray(ids)) {
// 		ids = [ids];
// 	}

// 	let results = {
// 		url: req.originalUrl,
// 		user: req.user,
// 		list: req.keystone.list(req.params.list) || null,
// 		ids: ids,
// 		// format: req.params.format || null,
// 		// sortOrder: req.params.sortOrder || null,
// 		// newOrder: req.params.newOrder || null,
// 		action: req.path.endsWith('/create') ? 'create' :
// 				req.path.endsWith('/update') ? 'update' :
// 				req.path.endsWith('/delete') ? 'delete' :
// 				req.path.indexOf('/sortOrder/') > 0 ? 'sort' : null
// 	};
// 	if (!results.action) {
// 		if (req.params.format) {
// 			results.action = 'download';
// 		} else if (results.id !== null && req.method == 'POST') {
// 			results.action = 'update';
// 		} else {
// 			results.action = 'get';
// 		}
// 	}
// 	return results;
// };

// // Savvy Stack: extract error reporting funictionally into function to reuse
// const reportError = (req, res, statusCode, jsonMessage, flashMessage) => {
// 	let msg = `${jsonMessage}: ${flashMessage}`;
// 	if (req.headers.accept === 'application/json' || req.originalUrl.indexOf('/api/') >= 0) {
// 		return res.status(statusCode).json({ error: msg, message: msg });
// 	} else {
// 		req.flash('error', msg);
// 		return res.redirect('/' + req.keystone.get('admin path'));
// 	}
// };

module.exports = function initList (req, res, next) {
	var keystone = req.keystone;
	req.list = keystone.list(req.params.list);
	if (!req.list) {
		if (req.headers.accept === 'application/json') {
			return res.status(404).json({ error: 'invalid list path' });
		}
		req.flash('error', 'List ' + req.params.list + ' could not be found.');
		return res.redirect('/' + keystone.get('admin path'));
	}
	next();
};
