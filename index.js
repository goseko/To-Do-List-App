const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();

const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://localhost:27017'; // Change this to your MongoDB URL
const dbName = 'todoApp'; // Change this to your database name
const collectionName = 'tasks'; // Change this to your collection name

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

// Connect to MongoDB and create the collection if it does not exist
const client = new MongoClient(mongoUrl);
client.connect().then(async () => {
    const db = client.db(dbName);
    const collections = await db.listCollections({name: collectionName}).toArray();
    if (collections.length === 0) {
        await db.createCollection(collectionName);
    }
}).catch(err => {
    console.error(err);
});

app.get("/", async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const tasks = await collection.find().toArray();
    res.render('index', { tasks });
});

app.post("/addtask", urlEncodedParser, async (req, res) => {
    const newTask = req.body.newtask;

    console.log("completedTasksId:", req.body.newtask);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne({
        Task: newTask,
        Completed: false
    });
    res.redirect("/");
});

app.post("/markcompleted", urlEncodedParser, async (req, res) => {
    let completedTasksId = req.body.completedtasks;
    console.log("completedTasksId:", req.body.completedtasks);
    
    if (!Array.isArray(completedTasksId)) {
        completedTasksId = [completedTasksId];
    }
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

    try {
        const objectIds = completedTasksId.map(id => new ObjectId(id));
        const result = await collection.updateMany(
            { _id: { $in: objectIds } },
            { $set: { Completed: true } }
        );
        res.redirect("/");
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).send('Internal Server Error');
    }
});




app.post("/deletetask", urlEncodedParser, async (req, res) => {
    const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

    try {
        const taskID = req.body.taskID;
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(taskID) }); // Use 'new' keyword
        res.redirect("/");
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).send('Internal Server Error');
    }
    
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
