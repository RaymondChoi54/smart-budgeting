const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const session = require('./session-routes');
const user = require('./user-routes');
const expense = require('./expense-routes');
const budget = require('./budget-routes');
const bodyParser = require('body-parser')
const tokenCheck = require('./tokenCheck')

app.use(bodyParser.urlencoded({extended: true}))
app.use(require("body-parser").json())
app.use(cors())

// Website
// app.get('/', function(req, res) {

// });

// Session
app.post('/api/session', session.createSession);
app.get('/api/session', tokenCheck.tokenCheck, session.getSession);

// Users
app.post('/api/users', user.createUser);
app.get('/api/users/:username', tokenCheck.tokenCheck, user.getUser);
app.put('/api/users/:username', tokenCheck.tokenCheckUser, user.putUser);

// Expenses
app.post('/api/expenses/:username', tokenCheck.tokenCheckUser, expense.createExpense);
app.get('/api/expenses/:username', tokenCheck.tokenCheckUser, expense.getExpenses);
app.put('/api/expenses/:username/:id', tokenCheck.tokenCheckUser, expense.putExpense);
app.delete('/api/expenses/:username/:id', tokenCheck.tokenCheckUser, expense.deleteExpense);

// Budget
app.get('/api/budget/:username/:year/:month', tokenCheck.tokenCheckUser, budget.getBudget);

if(!module.parent) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}