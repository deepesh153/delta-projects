const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main().then((res) =>{
 console.log(res);
 console.log(`connection successful`);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/",(req,res)=>{
 res.send("Working");
});

// INDEX ROUTE
app.get("/chats",async(req,res)=>{
 let chats = await Chat.find();
//  console.log(chats);
 res.render("index.ejs",{chats});
});

// New Route
app.get("/chats/new",(req,res) => {
  res.render("new.ejs");
});

// Create Route
app.post("/chats",(req,res)=>{
  let {from,to,msg} = req.body;
  let newChat = new Chat({
    from : from,
    to : to,
    message : msg,
    created_at : new Date(),
    updated_at : new Date()
  });
  newChat.save().then(res =>{
    console.log("chat was saved");
  }).catch(err =>{
    console.log(err);
  });
  res.redirect("/chats");;
});

// Edit route

app.get("/chats/:id/edit",async(req,res) =>{
  let {id} = req.params;
  let chat =  await Chat.findById(id);
  res.render("edit.ejs",{chat});
});

// Update route
app.put("/chats/:id",async(req,res)=>{
  let {id} = req.params;
  let {msg : newMsg} = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(id, {message:newMsg},{runValidators : true , new :true});
  console.log(updatedChat);
  res.redirect("/chats");
});

// DESTRY ROUTE
app.delete("/chats/:id",async(req,res)=>{
  let {id} = req.params;
 let deletedChat =await Chat.findByIdAndDelete(id);
 console.log(deletedChat);
 res.redirect("/chats");
});

app.listen(8080,()=>{
 console.log("server is listening on port 8080")
});