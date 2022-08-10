const express = require('express')
const Account = require('../models/account')
const auth = require('../middleware/auth')

const router = new express.Router()

// Create new account
router.post('', async (req, res) => {
    const account = new Account(req.body)

    try {
        await account.save()
        const token = await account.generateAuthToken()
        res.status(201).send({ account, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Login existing account
router.post('/login', async (req, res) => {
    try {
        const account = await Account.findAccount(req.body.email, req.body.password)
        const token = await account.generateAuthToken()
        res.status(200).send({ account, token })
    } catch (e) {
        res.status(400).send()
    }
})

// Read profile
router.get('', auth, async (req, res) => {
    res.status(200).send(req.account)
})

// Update profile
router.patch('', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' })

    try {
        updates.forEach((update) => req.account[update] = req.body[update])
        await req.account.save()
        res.status(200).send(req.account)
    } catch (e) {
        res.send(400).send()
    }
})

// Logout
router.post('/logout', auth, async (req, res) => {
    try {
        req.account.tokens = req.account.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.account.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Delete account
router.delete('', auth, async (req, res) => {
    try {
        await req.account.remove()
        res.status(200).send(req.account)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router