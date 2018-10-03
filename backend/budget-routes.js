const Budget = require('./budgetDatabase').budgets
const User = require('./budgetDatabase').users
const Expense = require('./budgetDatabase').expenses

// Days in the given month
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Update the budget
function update(username, month, year, callback) {
	var updater = {
		expense: 0,
		categoryExpense: Array(14).fill(0),
		dailyExpense: Array(daysInMonth(month, year)).fill(0),
		needsUpdate: true
	}
	// Dates
	var minDate = new Date(Date.UTC(year, (month - 1), 1))
	var maxDate = new Date(Date.UTC(year, (month - 1), daysInMonth(month, year)))
	// Query for all expenses during the budget period
	var query = Expense.where('username').equals(username);
	query = query.where('date').gte(minDate).lte(new Date(maxDate));

	query.exec(function(err, result) {
		if(err) {
			return callback(err, null)
		} else {
			// Modify the updater
			for(var i = 0; i < result.length; i++) {
				updater.expense += result[i].price
				updater.categoryExpense[result[i].category] += result[i].price
				updater.dailyExpense[parseInt(result[i].date.toUTCString().split(" ")[1]) - 1] += result[i].price
			}

			// Find the budget to update and update budget based on expenses
			Budget.findOneAndUpdate({username: username, month: month, year: year}, updater, {new: true}, function(err, budget) {
				if(err) {
					return callback(err, null);
				} else {
					return callback(null, budget);
				}
			});
		}
	});
}

// Edit the budget
exports.putBudget = function(req, res) {
	var updater = {}
	if(req.body.budget) {
		updater.budget = req.body.budget
	}

	Budget.findOneAndUpdate({year: req.params.body, month: req.params.month, username: req.params.username}, updater, function(err) {
		if(err) {
			return res.status(400).send({auth: true, message: "Error: Please try again"});
		} else {
			return res.status(200).send({auth: true, message: "Success"})
		}
	});
}

// Set budget to require update, if budget doesn't exist do nothing
exports.setUpdate = function(username, month, year, callback) {
	var query = Budget.where('username').equals(username);
	query = query.where('month').equals(month);
	query = query.where('year').equals(year);

	query.countDocuments({}, function(err, count) {
		if(err) {
			return callback(err)
		} else {
			if(count == 0) {
				return callback(null)
			} else {
				Budget.findOneAndUpdate({username: username, month: month, year: year}, {needsUpdate: true}, function(err) {
					if(err) {
						return callback(err)
					} else {
						return callback(null)
					}
				});
			}
		}
	})
}

// Get the budget info for the given month and year
// If there isn't existing budget info, create a new one
exports.getBudget = function(req, res) {
	// Query for existing budget
	var query = Budget.where('username').equals(req.params.username);
	query = query.where('month').equals(req.params.month);
	query = query.where('year').equals(req.params.year);

	query.countDocuments({}, function(err, count) {
		if(err) {
			return res.status(400).send({auth: true, message: "Error: Please try again"});
		} else {
			if(count == 0) {
				// Create a new budget if one doesn't exist
				User.findOne({username: req.params.username}, function(err, user) {
					if(err) {
						return res.status(400).send({auth: true, message: "Error: Please try again"});
					} else {
						const newBudget = new Budget({
							username: req.params.username,
							budget: user.budget,
							expense: 0,
							categoryExpense: Array(14).fill(0),
							dailyExpense: Array(daysInMonth(req.params.month, req.params.year)).fill(0),
							month: req.params.month,
							year: req.params.year,
							needsUpdate: false
						});
						newBudget.save((err, budget) => {
							if(err) {
								return res.status(400).send({auth: true, message: "Error: Please try again"});
							} else {
								update(req.params.username, req.params.month, req.params.year, function(err, updatedBudget) {
									if(err) {
										return res.status(400).send({auth: true, message: "Error: Please try again"});
									} else {
										return res.send(updatedBudget);
									}
								});
							}
						});
					}
				});
			} else {
				// Check if the budget needs updating, if so update
				Budget.findOne({username: req.params.username, month: req.params.month, year: req.params.year}, function(err, budget) {
					if(err) {
						return res.status(400).send({auth: true, message: "Error: Please try again"});
					} else {
						if(budget.needsUpdate) {
							update(req.params.username, req.params.month, req.params.year, function(err, budget) {
								if(err) {
									return res.status(400).send({auth: true, message: "Error: Please try again"});
								} else {
									return res.send(budget);
								}
							});
						} else {
							return res.send(budget)
						}
					}
				});
			}
		}
	})
}