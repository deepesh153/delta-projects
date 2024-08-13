const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Asmita@1807'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
}
// console.log(getRandomUser());
let query = "INSERT INTO user (id,username,email,password) VALUES ?";
let data = [];
for (let i = 1; i <= 100; i++) {
  data.push(getRandomUser());
}

// let query = "INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)";
// let users =[
//   ["123b","123_newuserb","abc@gmail.comb","abbc"],
//   ["123c","123_newuserc","abc@gmail.comc","abcc"]
// ];

// HOME ROUTE

app.get("/", (req, res) => {
  let query = `SELECT count(*) FROM user`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

// SHOW ROUTE
app.get(("/user"), (req, res) => {
  let query = `SELECT * FROM user`;
  try {
    connection.query(query, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
      // res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }

});

// EDIT ROUTE
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let query = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });

    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

// UPDATE(DB) ROUTE
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let query = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong password");
      }
      else {
        let query2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(query2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        })
      }

    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }

});

// DELETE
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let query = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });

    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, email: formEmail } = req.body;
  let query = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password & formEmail != user.email) {
        res.send("Wrong email & password");
      }
      else {
        let query2 = `DELETE FROM user WHERE id = '${id}'`;
        connection.query(query2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        })
      }
    });
  }
  catch (err) {
    console.log(err);
    res.send("some error in database");
  }
  
});

// NEW USER
app.get("/new", (req, res) => {
  res.render("new.ejs");
 });

app.post("/user",(req,res) =>{
  let id = uuidv4();
  let {username: formUsername, password: formPass, email: formEmail } = req.body;
  let query=`INSERT INTO user(id,username,email,password)
  VALUES ('${id}','${formUsername}','${formEmail}','${formPass}');`;
  try {
    connection.query(query, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }

  
});

app.listen("8080", () => {
  console.log("server is listening to port 8080");
});
