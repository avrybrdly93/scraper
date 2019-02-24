//dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//import models
const db = require('./models');

//middleware to allow json and strings/arrays
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static("public"));

//connect to mongodb

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapdb";

mongoose.connect(MONGODB_URI);

let database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error: '));
database.once('open', function() {
    console.log("connected!");
})




//use handlebars as templating engine
//app.set('views', path.join(__dirname, 'views'));
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );

app.set("view engine", "handlebars");

function scrape() {
    axios.get("https://www.theonion.com/").then(function(response) {
        let $ = cheerio.load(response.data);
        console.log($);
        $("article").each(function(i, element) {
            let result = {};
            result.title = $(this).children("header").children("h1.headline").children("a").text();
            result.content = $(this).children("div.item__content").children("div.excerpt").children("p").text();
            result.imgLink = $(this).children("div.item__content").children("figure").children("a").children(".img-wrapper").children("picture").children("source").attr("data-srcset");
            result.link = $(this).children("header").children("h1.headline").children("a").attr("href");
            db.Scrap.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
        });
    })
}
//routes
app.get('/', (req, res) => {
    res.render('index');
    // db.Scrap.create({
    //     title: "Test Title",
    //     content: "test content",
    //     link: "http:////////lolXD.com",
    //     imgLink: "photes"
    // }).then(function(dbLibrary) {
    //     // If saved successfully, print the new Library document to the console
    //     //console.log(dbLibrary);
    // })
    // .catch(function(err) {
    //     // If an error occurs, print it to the console
    //     console.log(err.message);
    // });
    // db.Scrap.deleteMany({}, function (err) {
    //     if (err) return handleError(err);
    //   });
     scrape();

});

app.get("/articles", (req, res) => {
    db.Scrap.find({})
    .then(function(data) {
        res.send(data);
    });
});

app.post('/comment/:id', (req, res) => {
    db.Comment.create({
        body: req.body.body,
        user: req.body.user,
        article_id: req.params.id
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});