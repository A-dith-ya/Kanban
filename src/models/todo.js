const mongoose = require('mongoose')
const { Schema } = mongoose;

const TodoSchema = new Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        enum: ['TODO', 'IN PROGRESS', 'DONE'],
        default: 'TODO'
    }
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo