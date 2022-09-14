const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB");

const PostSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Blog",PostSchema);

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));


const homeStartingContent = "Welcome to your Daily Journal. Click on the Post to read . Go to /compose to create new post. Goto /delete to delete existing Post "
const aboutContent = "Hey there! This project has been made using HTML,CSS,Node,Express,MongoDB,EJS . It is a fun small project to learn stuff and implement it.";
const contactContent = "Hi there! My name is Aditya and I am web devloper in learning. Feel free to contact me @ adityakhattri112233@gmail.com or try to connect with me at my GitHub :adityakhattri21";

app.get("/" ,(req,res)=>{
  Post.find({} , (err ,foundPosts)=>{
    if(err)
    console.log(err);
    else{
      res.render("home" , {startContent: homeStartingContent , newPost: foundPosts});
    }
  })
})

app.get("/about", (req,res)=>{
  res.render("about",{startContent: aboutContent})
});

app.get("/contact" , (req,res)=>{
  res.render("contact" , {startContent:contactContent})
});

app.get("/compose" , (req,res) =>{
  res.render("compose")
});

app.get("/posts/:postID" , (req,res)=>{
  const postID = req.params.postID
  Post.findById(postID , (err,foundPost) =>{
    if(err)
    console.log(err);
    else
    res.render("post" , {title: foundPost.title , postContent: foundPost.content})
  })
});

app.get("/delete" , (req,res) =>{
  Post.find({} , (err,posts) =>{
    if(err)
    console.log(err);
  else if(posts.length === 0)
  res.render("delno")
  else
  res.render("delete" ,{newPost:posts})
 })
});

app.post("/compose" , (req,res)=>{
  const postTitle = req.body.postTitle
  const postContent = req.body.postBody

  const post = new Post ({
    title: postTitle,
    content: postContent
  })
  post.save()
  res.redirect("/")
})

app.post("/delete" ,(req,res)=>{
  const delTitle = req.body.deletePost
  Post.findOneAndDelete({title: delTitle} , (err)=>{
    if(!err)
    res.redirect("/")
  })
})





app.listen(3000 , () =>{
  console.log("Server started at port 3000");
});
