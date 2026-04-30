const express = require("express");
const app = express();
require('dotenv').config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const { render } = require("ejs");



const dbiURI = process.env.MONGO_URI;


mongoose.connect(dbiURI)
    .then((result) => app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    }))
    .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res)=> {
    res.redirect('/blogs');
    //res.render('index', {title: 'Home', blogs});
});

app.get("/about", (req, res)=> {
    res.render('about', {title: "About"});
});

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort( {createdAt: -1} )
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => console.log(err));
});

//post handler
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => console.log(err));
});


app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            if (!result) {
                return res.status(404).render('404', { title: 'Blog not found' });
            }
            res.render('details', { title: 'Blog details', blog: result });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send('Server error');
        });
});


app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/blogs' });
         })
        .catch((err) => console.log(err));
}); 

//404 page
app.use((req, res) => {
    res.status(404).render('404', {title: "404"});
});
