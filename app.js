const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB");

//let items = [];

const itemSchema = {
  name : String
};

const Item = mongoose.model("Item", itemSchema);

// const item1 = new Item({
//   name : "Welcome! to your todoList"
// });
//
// const item2 = new Item({
//   name : "Hit the + button to add a new item"
// });
//
// const item3 = new Item({
//   name : "Hit the checkbox to delete item"
// });
//
// const defaultItems = [item1,item2,item3];

// Item.insertMany(defaultItems, function(err){
//   if(err){
//     console.log(err);
//   } else{
//     console.log("Default items inserted successfully");
//   }
// });

app.get("/",function(request,response){

  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  let day = today.toLocaleDateString("en-GB", options);

  Item.find({},function(err,foundItems){
    if(err){
      console.log(err);
    } else{
      response.render("list", {dayType : day,newItems : foundItems});
    }
  });

  // response.render("list", {dayType : day,newItems : item});
});

app.post("/", function(request,response){

  const itemName = request.body.newItem;
  //console.log(itemName);

  const newItem = new Item({
    name : itemName
  });

  newItem.save();

  response.redirect("/");

});

app.post("/delete", function(request, response){

  const checkedId = request.body.checkbox;

  Item.deleteOne({_id : checkedId}, function(err){
    if(err){
      console.log(err);
    }
    else {
      response.redirect("/");
    }
  });
  //response.redirect("/");

})

// app.get("/:userid", function(request, response){
//   console.log(request.params.userid);
// });

app.get("/about", function(request, response){
  response.render("about");
})

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
