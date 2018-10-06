const Budget = require('./budgetDatabase').budgets
const User = require('./budgetDatabase').users
const Expense = require('./budgetDatabase').expenses

function maxIndex(array) {
	var maxIndex = 0
	for(var i = 1; i < array.length; i++) {
		if(array[maxIndex] < array[i]) {
			maxIndex = i
		}
	}
	return maxIndex
}

function lastSixMonths(username, month, year) {
	var currMonth = month
	var currYear = year
	var temp = []

	for(var i = 0; i < 6; i++) {
		temp.push({
			username: username,
			year: currYear,
			month: currMonth
		})

		currMonth--
		if(currMonth == 0) {
			currMonth = 12
			currYear--
		}
	}

	return temp
}

// Days in the given month
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Get all user budgets
allUserBudgets = function(username, callback) {
	var query = Budget.where('username').equals(username);

	query.exec(function(err, result) {
		if(err) {
			return callback(err, null)
		} else {
			Promise.all(result.map(promiseUserBudget)).then(function(result) {
				callback(null, result)
			})
			.catch((err) => callback(err, null))
		}
	});
}

// Get the user budget given the month via a promise
promiseUserBudget = function(budget) {
	return new Promise(
		function(resolve, reject) {
			userBudget(budget.username, budget.month, budget.year, function(err, result) {
				if(err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		}
	)
}

// Get the user budget for the given month
userBudget = function(username, month, year, callback) {
	// Query for existing budget
	var query = Budget.where('username').equals(username);
	query = query.where('month').equals(month);
	query = query.where('year').equals(year);

	query.countDocuments({}, function(err, count) {
		if(err) {
			return callback(err, null)
		} else {
			if(count == 0) {
				// Create a new budget if one doesn't exist
				User.findOne({username: username}, function(err, user) {
					if(err) {
						return callback(err, null)
					} else {
						const newBudget = new Budget({
							username: username,
							budget: user.budget,
							expense: 0,
							categoryExpense: Array(14).fill(0),
							dailyExpense: Array(daysInMonth(month, year)).fill(0),
							month: month,
							year: year,
							needsUpdate: false,
							total: 0
						});
						newBudget.save((err, budget) => {
							if(err) {
								return callback(err, null)
							} else {
								update(username, month, year, function(err, budget) {
									if(err) {
										return callback(err, null)
									} else {
										return callback(null, budget);
									}
								});
							}
						});
					}
				});
			} else {
				// Check if the budget needs updating, if so update
				Budget.findOne({username: username, month: month, year: year}, function(err, budget) {
					if(err) {
						return callback(err, null)
					} else {
						if(budget.needsUpdate) {
							update(username, month, year, function(err, budget) {
								if(err) {
									return callback(err, null)
								} else {
									return callback(null, budget);
								}
							});
						} else {
							return callback(null, budget);
						}
					}
				});
			}
		}
	})
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

			updater.total = result.length

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
		updater.budget = parseInt(req.body.budget)
	}

	Budget.findOneAndUpdate({year: req.params.year, month: req.params.month, username: req.params.username}, updater, function(err) {
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
	userBudget(req.params.username, req.params.month, req.params.year, function(err, budget) {
		if(err) {
			return res.status(400).send({auth: true, message: "Error: Please try again"});
		} else {
			return res.send(budget);
		}
	})
}


// Get statistics reguarding the budget data
// Times meeting budget
// Consecutive times budget was met
// Total dollars tracked
// Total expenses tracked
// Total months tracked
// Past 6 months spending (By total and category)
// Most spent category
// Average over or under budget
// Average spent per day
exports.getBudgetStatistics = function(req, res) {
	var stats = {
		categoryExpense: Array(14).fill(0),
		budgetGoal: 0,
		totDollars: 0,
		totExpenses: 0,
		avgBudget: 0,
		avgExpenses: 0,
		avgSpentDaily: 0,
		avgDiffBudget: 0,
		months: 0,
		maxCategory: 0,
		lastSixExpense: Array(6).fill(0),
		lastSixCategoryExpense: Array(14).fill(0)
	}

	allUserBudgets(req.params.username, function(err, result) {
		if(err) {
			console.log(err)
			return res.status(400).send({auth: true, message: "Error: Please try again"});
		} else {
			// All time
			for(var i = 0; i < result.length; i++) {
				var budget = result[i]
				if(budget.expense != 0) {
					stats.months++
					var budget = result[i]
					if(budget.budget >= budget.expense) {
						stats.budgetGoal += 1
					}

					stats.totDollars += budget.expense
					stats.totExpenses += budget.total
					stats.avgBudget += budget.budget
					stats.avgExpenses += budget.expense
					stats.avgDiffBudget = budget.budget - budget.expense

					for(var j = 0; j < stats.categoryExpense.length; j++) {
						stats.categoryExpense[j] += budget.categoryExpense[j]
					}
				}
			}
			stats.avgBudget = stats.avgBudget / stats.months
			stats.avgExpenses = stats.avgExpenses / stats.months
			stats.avgDiffBudget = stats.avgDiffBudget / stats.months
			stats.avgSpentDaily = stats.avgExpenses / 30
			stats.maxCategory = maxIndex(stats.categoryExpense)

			// Last 6 months
			Promise.all(lastSixMonths(req.params.username, 10, 2018).map(promiseUserBudget))
			.then(function(result) {
				for(var i = 0; i < result.length; i++) {
					var expense = result[result.length - i - 1]
					stats.lastSixExpense[i] = expense.expense
					for(var j = 0; j < stats.lastSixCategoryExpense.length; j++) {
						stats.lastSixCategoryExpense[j] += expense.categoryExpense[j]
					}
				}

				res.status(200).send(stats)
			})
			.catch(function(err) { 
				console.log(err)
				res.status(400).send({auth: true, message: "Error: Please try again"})
			})
		}
	})
}

















