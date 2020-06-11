const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();


app.use(cors());
app.use(bodyParser.json());

//////////////////////////////////////   Get    ////////////////////////////////////////////
app.get("/tasks", function(req, res) {
  const Tasks =[
    { text: "Task1", completed: false, id: 1, date: "2020-07-01"},
    { text: "Task2", completed: false, id: 2, date: "2020-07-01"},
    { text: "Task3", completed: false, id: 3, date: "2020-07-01"}
  ];
  res.json(Tasks);
})

//////////////////////////////////////   Delete    ////////////////////////////////////////////
app.delete("/tasks/:taskId", function(req, res) {
  
  const taskIdDeleted = req.params.taskId;
  let aResponse= {
     messege: "Delete task which has id = " + taskIdDeleted 
     };

     if (taskIdDeleted > 3){
      aResponse ={ messege: "Task " + taskIdDeleted +" is not valid"};
     }
  res.json(aResponse);

});

//////////////////////////////////////   Post    ////////////////////////////////////////////
app.post("/tasks", function(req, res) {
  const text = req.body.text;
  const date = req.body.date;
  

  res.json({
    message: `Received a request to add task ${text} with date ${date}`
  });
});


//////////////////////////////////////   Put   ////////////////////////////////////////////

app.put("/tasks/:taskId", function(req, res) {
  
  const taskIdchanged = req.body.id;
  let aResponse= {messege: "You issued a put request for id : " + taskIdchanged };

  if (taskIdchanged > 3){
    aResponse ={ messege: "Task " + taskIdchanged +" is not valid"};
   }
  res.json(aResponse);

});

module.exports.tasks = serverless(app);
