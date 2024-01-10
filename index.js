const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'Rishi',
  password: "$Rr01010010"
});


let getUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = "select count(*) from user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.get("/users", (req, res) => {
  let q = "select * from user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("user.ejs", { users });
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpass, username: newUsername } = req.body;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formpass != user.password) {
        res.send("wrong password");
      }
      else {
        let q2 = `update user set username='${newUsername}' where id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});


app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});



app.delete("/user/:id", (req,res)=>{
  let { id } = req.params;
  let { password: formpass, email: email } = req.body;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formpass != user.password && email!=user.email) {
        res.send("wrong Credentials");
      }
      else {
        let q2 = `delete from user where id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in db");
  }
})

app.get("/newUser", (req, res) => {
  res.render("new.ejs");
});

app.put("/users/add", (req, res) => {
  let id  = uuidv4();
  let { username: username, email: email, password: password } = req.body;
  let q= `insert into user (id, username, email, password) values (?,?,?,?)`;
  let values = [id,username,email,password];
  try {
    connection.query(q, values, (err, result) => {
      if (err) throw err;
      console.log(err);
      res.redirect("/users");
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in db");
  }
});

app.listen("8080", () => {
  console.log("server is listening to port 8080");
});