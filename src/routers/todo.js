const express = require('express')
const Todo = require('../models/todo')
const auth = require('../middleware/auth')

const router = new express.Router()

// Create task
router.post('', auth, async (req, res) => {
    const item = new Todo({
        ...req.body,
        account_id: req.account._id
    })

    try {
        await item.save()
        res.status(201).send(item)
    } catch (e) {
        res.status(400).send()
    }
})

// Read tasks
router.get('', auth, async (req, res) => {
    try {
        // const items = await Todo.find({ account_id: req.account.id })
        // res.status(200).send(items)
        await req.account.populate('items')
        res.status(200).send(req.account.items)
    } catch (e) {
        res.status(500).send()
    }
})

// Update task
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdated = ['title', 'description', 'state']
    const isValidOperation = updates.every((update) => allowedUpdated.includes(update))

    if (!isValidOperation)
        res.status(400).send({ error: 'Invalid update' })

    try {
        const item = await Todo.findOne({ _id: req.params.id, account_id: req.account.id })

        if (!item)
            res.status(404).send()

        updates.forEach((update) => item[update] = req.body[update])
        await item.save()

        res.status(201).send(item)
    } catch (e) {
        res.status(400).send()
    }
})

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Todo.findOneAndDelete({ _id: req.params.id, owner: req.account._id })

        if (!item)
            res.status(404).send()

        res.status(200).send(item)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router