const Expense = require('./budgetDatabase').expenses

// Create a new expense for a user
exports.createExpense = function(req, res) {
	req.body.username = req.params.username;
	const newExpense = new Expense(req.body);
	newExpense.save((err) => {
		if(err) {
			return res.status(500).send({ auth: true, message: "Error: Could not create an expense"});
		} else {
			return res.send({ auth: true, message: "Success"});
		}
	});
}

function queryProcess(req) {
	var query = Expense.where('username').equals(req.params.username);
	// Filter by
	if(req.query.store) {
		query = query.where('store').equals(req.query.store)
	}
	if(req.query.brand) {
		query = query.where('brand').equals(req.query.brand)
	}
	if(req.query.item) {
		query = query.where('item').equals(req.query.item)
	}
	if(req.query.category) {
		query = query.where('category').equals(req.query.category)
	}
	if(req.query.price) {
		query = query.where('price').equals(req.query.price)
	}
	// Date range
	if(req.query.startdate && req.query.enddate) {
		query = query.where('date').gte(req.query.startdate).lt(req.query.enddate)
	}
	// Sort by
	if(req.query.sort) {
		if(req.query.orderby == 'desc') {
			query = query.sort('-' + req.query.sort);
		} else {
			query = query.sort(req.query.sort);
		}
	}

	return query
}

// Query for expenses
// Sort by price, date, and size
// Filter by username, store, brand, item, date, date range, and category
exports.getExpenses = function(req, res) {
	if(req.query.page) {
		queryProcess(req).countDocuments({}, function(err, count) {
			if(err) {
				return res.status(500).send({ auth: true, message: "Error: Could not query"});
			} else {
				query = queryProcess(req)

				// Skip and limit
				if(req.query.page) {
					query = query.skip(20 * (req.query.page - 1)).limit(20)
				}

				query.exec(function(err, result) {
					if(err) {
						return res.status(500).send({ auth: true, message: "Error: Could not query"});
					} else {
						return res.send({
							data: result, 
							pages: Math.ceil(count / 20),
							expenses: count
						});
					}
				});
			}
		});
	} else {
		var query = queryProcess(req)

		if(req.query.limit) {
			query.limit(parseInt(req.query.limit))
		}

		query.exec(function(err, result) {
			if(err) {
				console.log(err)
				return res.status(500).send({ auth: true, message: "Error: Could not query"});
			} else {
				return res.send({
					data: result,
					pages: 1
				});
			}
		});
	}
}

// Change the category, store, item, price, brand, size, unit, date, or comment of an expense given the id
exports.putExpense = function(req, res) {
	var updater = {}
	if(req.body.category) {
		updater.category = req.body.category;
	}
	if(req.body.store) {
		updater.store = req.body.store;
	}
	if(req.body.item) {
		updater.item = req.body.item;
	}
	if(req.body.price) {
		updater.price = req.body.price;
	}
	if(req.body.brand) {
		updater.brand = req.body.brand;
	}
	if(req.body.size) {
		updater.size = req.body.size;
	}
	if(req.body.unit) {
		updater.unit = req.body.unit;
	}
	if(req.body.date) {
		updater.date = req.body.date;
	}
	if(req.body.comment) {
		updater.comment = req.body.comment;
	}

	Expense.findOneAndUpdate({username: req.params.username, _id: req.params.id}, updater, function(err, user) {
		if(err) {
			return res.status(500).send({ auth: true, message: "Error: Could not get the expense" });
		}
		return res.status(200).send({ auth: true, message: 'Success: Expense has been updated' });
	});
}

// Delete an expense given it's id
exports.deleteExpense = function(req, res) {
	Expense.findOneAndRemove({ _id: req.params.id }, function(err, expense) {
		if(err) {
			 return res.status(500).send({ auth: true, message: "Error: failed to delete"})
		} else {
			return res.status(200).send({ auth: true, message: 'Success'});
		}
	});
}



