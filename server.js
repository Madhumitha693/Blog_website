const express = require('express');
const mongoose = require('mongoose');
const app = express();
const articleRouter = require("./routes/articles");
const Article = require('./models/article');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/BlogWebsiteDatabase');

app.set('view engine', 'ejs'); // Convert the ejs files to HTML files

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    const { query } = req.query; // Get the search term from the query string
    let articles;

    if (query) {
        // Find articles that match the search term
        articles = await Article.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Search in title (case insensitive)
                { description: { $regex: query, $options: 'i' } } // Search in description (case insensitive)
            ]
        }).sort({ createdAt: 'desc' }); // Sort by creation date
    } else {
        // If no query, fetch all articles
        articles = await Article.find().sort({ createdAt: 'desc' });
    }

    // Render the articles, include a message if no articles are found
    const message = articles.length === 0 ? 'No articles found.' : null;
    res.render('articles/index', { articles: articles, message: message });
});

app.use('/articles', articleRouter);

app.listen(3000);
