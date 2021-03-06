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

// If deployed, use the deployed database. Otherwise use the local scrapdb database
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

function scrapeArticles() {
    axios.get("https://www.theonion.com/").then(function(response) {
        let $ = cheerio.load(response.data);
        //console.log($);
        $("article").each(function(i, element) {
            let result = {};
            result.id = i;
            result.title = $(this).children("header").children("h1.headline").children("a").text();
            result.content = $(this).children("div.item__content").children("div.excerpt").children("p").text();
            result.imgLink = $(this).children("div.item__content").children("figure").children("a").children(".img-wrapper").children("picture").children("source").attr("data-srcset");
            result.link = $(this).children("header").children("h1.headline").children("a").attr("href");
            db.Scrap.create(result)
            .then(function(dbArticle) {
                scrapeArticle(result.link);
                //console.log(dbArticle);
            })
            .catch(function(err) {
                //console.error(err);
            });
        });
    })
}

function scrapeArticle(URL) {
    axios.get(URL).then(function(response) {
        let $ = cheerio.load(response.data);
        $("div.entry-content").each(function(i, element) {
            let fullContent = $(this).children("p").text();
            console.log(fullContent);
            db.Scrap.findOneAndUpdate({link: URL},
                {$set: {fullContent: fullContent}}).exec(function(err, book){
                if(err) {
                    // console.log(err);
                    // res.status(500).send(err);
                } else {
                    // res.status(200).send(book);
                };
            });
        })
    })
}

// scrapeArticle("https://www.theonion.com/chicago-police-credit-their-extensive-experience-falsif-1832825796");
//routes
app.get('/', (req, res) => {
    res.render('index');
    scrapeArticles();
});


app.get("/articles", (req, res) => {
    db.Scrap.find({})
    .populate("comments")
    .then(function(data) {
        res.json(data);
    })
    .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
    });
});

app.get("/article/:id", (req, res) => {
    db.Scrap.find({_id:req.params.id})
    .then(function(data) {
        res.send(data);
    })
    .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
    });
});

app.get('/comment/:id', (req, res) => {
    db.Comment.find({article_id: req.params.id}).then(function(comments) {
        res.send(comments);
    })
    .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
    });
})

app.post('/comment/:id', (req, res) => {
    db.Comment.create({
        body: req.body.body,
        username: req.body.username,
        article_id: req.params.id
    }).then(function(data) {
        res.send(data);
    })
    .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
    });
});

app.delete("/comment/:id", (req, res) => {
    db.Comment.deleteOne({_id: req.params.id}).then(function(result) {
        console.log(result);
        res.send('deleted');
    }).catch(function(err) {
        console.log(err);
    });
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


// function findAll() {
//     db.Scrap
//         .find({id:"1"})
//         .populate('comments')
//         .exec(function (err, results) {
//         if (err) {
//             console.log("An error occured when receiving all rounds!", err);
//         }
//         console.log(results);
//     });
// }

// findAll();