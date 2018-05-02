var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var counts = {};
	async.each(keystone.lists, function (list, next) {
		// Savvy Stack: Add request states into query object, so that pre/post:find hooks can modify the query based on particular request
		var query = list.model.count();
		query = keystone.get('set request states')(query, req);
		query.exec(function (err, count) {
			counts[list.key] = count;
			next(err);
		});
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};
