const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Todo = require('./todo')

const accountSchema = new Schema({
    name: {
        type: String,
        required: true,
    }, email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is invalid')
            }
        }
    }, password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// All items created by account
accountSchema.virtual('items', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'account_id'
})

// Account details left out before returning
accountSchema.methods.toJSON = function () {
    const account = this
    const accountObject = account.toObject()

    delete accountObject.password
    delete accountObject.tokens

    return accountObject
}

// Create JSON Web Token
accountSchema.methods.generateAuthToken = async function () {
    const account = this
    const token = jwt.sign({ _id: account.id.toString() }, process.env.JWT_SECRET)

    account.tokens = account.tokens.concat({ token })
    await account.save()

    return token
}

// Find account in accounts collection
accountSchema.statics.findAccount = async (email, password) => {
    const account = await Account.findOne({ email })

    if (!account)
        throw new Error('Failed to login')

    // Check password
    const isMatch = await bcrypt.compare(password, account.password)

    if (!isMatch)
        throw new Error('Failed to login')

    return account
}

// Storing hashed password
accountSchema.pre('save', async function (next) {
    const account = this

    if (account.isModified('password'))
        account.password = await bcrypt.hash(account.password, 8)

    next()
})

// Delete all account tasks after account deletion
accountSchema.pre('remove', async function (next) {
    const account = this
    await Todo.deleteMany({ account_id: account._id })
    next()
})

const Account = mongoose.model('Account', accountSchema)

module.exports = Account