var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var counts = {};
	async.each(keystone.lists, function (list, next) {
		// Savvy Stack: If the list has field "organizers", and the user is organizer, only count authorized documents
		var conditions = list.fields.organizers && req.user.isOrganizer ? { organizers: req.user._id } : {};
		list.model.count(conditions, function (err, count) {
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
