const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Account = require('../../models/account')
const Todo = require('../../models/todo')

const accountOneId = new mongoose.Types.ObjectId()
const accountOne = {
    _id: accountOneId,
    name: 'Random',
    email: 'Random@gmail.com',
    password: 'Randomly1',
    tokens: [{
        token: jwt.sign({ _id: accountOneId }, process.env.JWT_SECRET)
    }]
}

const todoOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Cook the plate',
    description: 'cooking..',
    account_id: accountOne._id
}

const setupDatabase = async () => {
    await Account.deleteMany()
    await Todo.deleteMany()
    await new Account(accountOne).save()
    await new Todo(todoOne).save()
}

module.exports = {
    accountOneId,
    accountOne,
    todoOne,
    setupDatabase
}