const request = require('supertest')
const app = require('../app')
const Todo = require('../models/todo')
const { accountOne, todoOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create individual task', async () => {
    const response = await request(app)
        .post('/todo')
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send({
            title: "Wash the car"
        })
        .expect(201)

    const task = await Todo.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should read all todos', async () => {
    const response = await request(app)
        .get('/todo')
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should update todo', async () => {
    const response = await request(app)
        .patch(`/todo/${todoOne._id}`)
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send({
            state: 'DONE'
        })
        .expect(201)

    const task = await Todo.findById(response.body._id)
    expect(task.state).toBe('DONE')
})

test('Should delete todo', async () => {
    const response = await request(app)
        .delete(`/todo/${todoOne._id}`)
        .set('Authorization', `Bearer ${accountOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Todo.findById(todoOne._id)
    expect(task).toBeNull()
})