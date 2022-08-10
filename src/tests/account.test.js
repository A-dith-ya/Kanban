const request = require('supertest')
const app = require('../app')
const Account = require('../models/account')
const { accountOneId, accountOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup new user', async () => {
    const response = await request(app)
        .post('/account')
        .send({
            name: 'Finn',
            email: 'Finn@gmail.com',
            password: 'Finn123qwer'
        })
        .expect(201)

    const account = await Account.findById(response.body.account._id)
    expect(account).not.toBeNull()
})

test('Should fail duplicate signup user', async () => {
    const response = await request(app)
        .post('/account')
        .send({
            name: accountOne.name,
            email: accountOne.email,
            password: accountOne.password
        })
        .expect(400)
})

test('Should login existing account', async () => {
    const response = await request(app)
        .post('/account/login')
        .send({
            email: accountOne.email,
            password: accountOne.password
        })
        .expect(200)

    const account = await Account.findById(response.body.account._id)
    // Verify jwt saved to database
    expect(response.body.token).toBe(account.tokens[1].token)
})

test('Should retrieve account info', async () => {
    const response = await request(app)
        .get('/account')
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should update account fields', async () => {
    const response = await request(app)
        .patch('/account')
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send({
            name: 'John Kick'
        })
        .expect(200)

    const account = await Account.findById(accountOneId)
    expect(account.name).toEqual('John Kick')
})

test('Should logout account', async () => {
    const response = await request(app)
        .post('/account/logout')
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send()
        .expect(200)

    const account = await Account.findById(accountOneId)
    // Verify deleted jwt
    expect(account.tokens).toEqual([])
})

test('Should delete account', async () => {
    const response = await request(app)
        .delete('/account')
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send()
        .expect(200)

    const account = await Account.findById(accountOneId)
    expect(account).toBeNull()
})