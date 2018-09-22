const Expense = require('./budgetDatabase').expenses

// Create a new expense for a user
exports.createExpense = function(req, res) {
	const newExpense = new Expense(req.body);
	newExpense.save((err) => {
		if(err) {
			res.sendStatus(500).send("Error: Could not create an expense");;
		} else {
			res.sendStatus(200);
		}
	});
}