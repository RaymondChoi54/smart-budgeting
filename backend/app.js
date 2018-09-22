const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const session = require('./session-routes');
const user = require('./user-routes');
const expense = require('./expense-routes');
const bodyParser = require('body-parser')
const tokenCheck = require('./tokenCheck')

app.use(bodyParser.urlencoded({extended: true}))
app.use(require("body-parser").json())

// Session
app.post('/api/session', session.createSession);

// Users
app.post('/api/users', user.createUser);
app.get('/api/users/:username', tokenCheck.tokenCheck, user.getUser);
app.put('/api/users/:username', tokenCheck.tokenCheckUser, user.putUser);

// Expenses
app.post('/api/expenses/:username', tokenCheck.tokenCheckUser, expense.createExpense);

if(!module.parent) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}