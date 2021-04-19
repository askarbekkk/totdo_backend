const uniqid = require('uniqid');
const axios = require('axios')
const path = require('path')
const express = require('express')
const fs = require("fs");

const server = express()

server.use(express.json())
const {readFileSync, writeFileSync, stat, unlink} = require('fs')

function getData(category) {
    console.log(__dirname)
    return JSON.parse(fs.readFileSync(`./tasks/${category}.json`, 'utf8'))
}

server.get('/api/tasks/:category', async (req, res) => {
//
    const {category} = req.params
    console.log(req.params)
    let task = await getData(category)
    res.json(task)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
    const {category} = req.params
    let tasks = JSON.parse(fs.readFileSync(`./tasks/${category}.json`, 'utf8'))
    let newTask = {
        taskId: uniqid(),
        title: req.body.title,
        status: 'new',
        _isDeleted: false,
        _createdAt: +new Date(),
        _deletedAt: null
    }
    let newTasks = [...tasks, newTask]
    fs.writeFileSync(`./tasks/${category}.json`, JSON.stringify(newTasks, 1, 2))
    res.json({status: 'added successfully'})
})

server.patch('/api/v1/tasks/:category/:id', (req, res) => {
    const {category} = req.params
    let task = getData(category)
    let id = req.params.id
    let newTask = task.map(el => el.taskId === id ? {...el, ...req.body} : el)
    fs.writeFileSync(`./tasks/${category}.json`, JSON.stringify(newTask, null, 2))
    res.json({status: 'Updated'})
})

server.get('*', (req, res) => {
    res.status(404).send('Not found')
})

server.delete('/api/v1/tasks/:category/', (req, res) => {
    const {category} = req.params
    fs.writeFileSync(`./tasks/${category}.json`, "[]")
    res.json({status: 'All tasks are deleted'})

})


// server.put('/api/tasks/:category/', (req, res) => {
//     const {category} = req.params
//     let task = getData(category)
//     console.log(req.params)
//     fs.writeFileSync(`./tasks/${category}.json`, JSON.stringify(task, null, 2))
//     res.json({status: 'tasks were updated'})
// })

server.listen(8000, () => console.log('Server is started'))


// //const tasks = JSON.parse(fs.readFileSync(('./tasks/shop.json').resolve(__dirname, 'shop.json'), 'utf-8'))

const withoutUnderline = (array) => {
    return array.filter(el => !el._isDeleted).map(el => {
        return {taskId: el.taskId, title: el.title, status: el.status}
    })
}
