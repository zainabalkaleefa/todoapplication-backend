const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//////////////////////////////////// connect to the database    //////////////////////////////////
const connection = mysql.createConnection({
  host: "tech-returner-rds-instance.czejbfcwo5hq.eu-west-2.rds.amazonaws.com",
  user: "adminzainab",
  password: "Thepeace1!",
  database: "todos"                      // The DS that I created in mysql



})

//////////////////////////////////////   Get    ////////////////////////////////////////////
app.get("/tasks", function (req, res) {
  // const Tasks =[
  //   { text: "Task1", completed: false, id: 1, date: "2020-07-01"},
  //   { text: "Task2", completed: false, id: 2, date: "2020-07-01"},
  //   { text: "Task3", completed: false, id: 3, date: "2020-07-01"}
  // ];
  const query = "SELECT * FROM Tasks;";
  connection.query(query, function (error, data) {
    if (error) {
      console.timeLog("Error fetching tasks", error);
      res.status(500).json({ error: error })
    } else {
      res.status(200).json({ Tasks: data })

    }
  });
  // res.json(Tasks);
});

//////////////////////////////////////   Delete    ////////////////////////////////////////////

app.delete("/tasks/:taskId", function (req, res) {
  const taskIdDeleted = "DELETE FROM Tasks WHERE taskId=?";
  const taskDeleted = "SELECT * FROM Tasks;";
  connection.query(taskIdDeleted, [req.params.taskId], function (error, data) {
    if (error) {
      console.log("Error deleting the task", error);
      res.status(500).json({ error: error })
    } else {
      connection.query(taskDeleted, function (error, data) {
        if (error) {
          console.log("Error deleting the task from the list", error);
          res.status(500).json({ error: error })
        } else {
          res.status(200).json({ tasks: data })
        }

      })
    }

  })
});

// app.delete("/tasks/:taskId", function (req, res) {
// const taskIdDeleted= req.params.taskId;
// let aResponse = {
//   messege: "Delete task which has id = " + taskIdDeleted
// };
// if (taskIdDeleted > 3) {
//   aResponse = { messege: "Task " + taskIdDeleted + " is not valid" };
// }
// res.json(aResponse);
//});

//////////////////////////////////////   Post    ////////////////////////////////////////////
// request includes : text, completed, dueDate, userId

app.post("/tasks", function (req, res) {
  const query = "INSERT INTO Tasks (text, completed, dueDate, userId) VALUES (?, ?, ?, ?);";
  const queryTask = "SELECT * FROM Tasks WHERE taskId = ?";
  connection.query(query, [req.body.text, req.body.completed, req.body.dueDate, req.body.userId], function (error, data) {
    if (error) {
      console.log("Error adding the task", error);
      res.status(500).json({ error: error })
    } else {
      connection.query(queryTask, [data.insertId], function (error, data) {
        if (error) {
          console.log("Error retreiving the task", error);
          res.status(500).json({ error: error })
        } else {
          res.status(201).json({ task: data })
        }
      })
    }
  })
});


// app.post("/tasks", function (req, res) {
// const text = req.body.text;
// const date = req.body.date;
// res.json({
//   message: `Received a request to add task ${text} with date ${date}`
// });

//////////////////////////////////////   Put   ////////////////////////////////////////////

app.put("/tasks/:taskId", function (req, res) {
  const taskIdUpdated = "UPDATE Tasks SET text=?, completed=?, dueDate=?, userId=? WHERE taskId=?;";
  const taskUpdated = "SELECT * FROM Tasks;";
  connection.query(taskIdUpdated, [req.body.text, req.body.completed, req.body.dueDate, req.body.userId, req.params.taskId], function (error, date) {
    if (error) {
      console.log("Error updating the task", error);
      res.status(500).json({ error: error })
    } else {
      connection.query(taskUpdated, function (error, data) {
        if (error) {
          console.log("Error updating the task from the list", error);
          res.status(500).json({ error: error })
        } else {
          res.status(200).json({ tasks: data })
        }
      })
    }
  })
});


// app.put("/tasks/:taskId", function (req, res) {
//   const taskIdchanged = req.body.id;
//   let aResponse = { messege: "You issued a put request for id : " + taskIdchanged };
//   if (taskIdchanged > 3) {
//     aResponse = { messege: "Task with id= " + taskIdchanged + " is not valid" };
//   }
//   res.json(aResponse);
// });


module.exports.tasks = serverless(app);
