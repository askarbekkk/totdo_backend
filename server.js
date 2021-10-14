const uniqid = require('uniqid');
const express = require('express')
const fs = require("fs");

const server = express()

server.use(express.json())
const {readFileSync, writeFileSync, writeFile, stat, unlink} = require('fs')

function getData(category) {
    console.log(__dirname)
    try {
        return JSON.parse(fs.readFileSync(`./tasks/${category}.json`, 'utf8'))
    } catch (err) {
        return []
    }
}

server.get('/api/v1/tasks/:category', async (req, res) => {
//
    const {category} = req.params
    // console.log(req.params)
    // let task = await getData(category)
    const task = withoutUnderline(await getData(category))

    res.json(task)
})

server.post('/api/v1/tasks/:category', async (req, res) => {

    let newTask = {
        taskId: uniqid(),
        title: req.body.title,
        status: 'new',
        _isDeleted: false,
        _createdAt: +new Date(),
        _deletedAt: null
    }
    const {category} = req.params
    let tasks = getData(category)
    let newTasks = [...tasks, newTask]
    fs.writeFile(`./tasks/${category}.json`, JSON.stringify(newTasks, null, 2), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    res.json({status: 'added successfully'})
})

server.patch('/api/v1/tasks/:category/:id', (req, res) => {
    const {category} = req.params
    let task = getData(category )
    let id = req.params.id
    let newTask = task.map(el => el.taskId === req.params.id ? {...el, ...req.body} : el)
    fs.writeFileSync(`./tasks/${category}.json`, JSON.stringify(newTask, null, 2))
    res.json({status: 'Updated'})
})

// server.get('*', (req, res) => {
//     res.status(404).send('Not found')
// })

server.delete('/api/v1/tasks/:category/', (req, res) => {
    const {category} = req.params
    fs.writeFileSync(`./tasks/${category}.json`, "[]")
    res.json({status: 'All tasks are deleted'})

})

server.delete('/api/v1/tasks/:category/:id', (req, res) => {

    const {category,id} = req.params
    let tasks = getData(category)
    let newTasks = tasks.filter(el => el.taskId !== id)
    fs.writeFileSync(`./tasks/${category}.json/`, JSON.stringify(newTasks,null,2))
    res.json({status: 'task is deleted'})

})


server.put('/api/v1/tasks/:category/', (req, res) => {
    const {category} = req.params
    let task = getData(category )
    console.log(req.params)
    fs.writeFileSync(`./tasks.${category}/${category}.json`, JSON.stringify(task, null, 2))
    res.json({status: 'tasks were updated'})
})

server.listen( 8000, () => console.log('Server is started'))


// //const tasks = JSON.parse(fs.readFileSync(('./tasks/shop.json').resolve(__dirname, 'shop.json'), 'utf-8'))

const withoutUnderline = (array) => {
    return array.filter(el => !el._isDeleted).map(el => {
        return {taskId: el.taskId, title: el.title, status: el.status}
    })
}

server.get('/api/v1/tasks/:category/:id', async (req, res) => {
//
    const {category} = req.params
    console.log(req.params)
    let task = withoutUnderline(await getData(category))
    res.json(task)
})

