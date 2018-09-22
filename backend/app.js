const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const userExpenses = require('./userExpenses-routes');
const bodyParser = require('body-parser')
const tokenCheck = require('./tokenCheck')

app.use(bodyParser.urlencoded({extended: true}))
app.use(require("body-parser").json())

// Session
app.post('/api/session', userExpenses.createSession);

// Users
app.post('/api/users', userExpenses.createUser);
app.get('/api/users/:user', tokenCheck.tokenCheck, userExpenses.getUser);

// Expenses
app.post('/api/expenses/:user', tokenCheck.tokenCheckUser, userExpenses.createExpense);

if(!module.parent) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}