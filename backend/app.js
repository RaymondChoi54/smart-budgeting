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
app.get('/api/users/:username', tokenCheck.tokenCheck, userExpenses.getUser);
app.put('/api/users/:username', tokenCheck.tokenCheckUser, userExpenses.putUser);

// Expenses
app.post('/api/expenses/:username', tokenCheck.tokenCheckUser, userExpenses.createExpense);

if(!module.parent) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}