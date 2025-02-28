const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const postsFile = 'posts.json';

// Function to read posts from file
const getPosts = () => {
    try {
        const data = fs.readFileSync(postsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Function to write posts to file
const savePosts = (posts) => {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
};

// Route to display all posts
app.get('/posts', (req, res) => {
    const posts = getPosts();
    res.render('home', { posts });
});

// Route to display a single post
app.get('/post', (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (post) {
        res.render('post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

// Route to show form for adding a new post
app.get('/add-post', (req, res) => {
    res.render('addPost');
});

// Route to handle new post submission
app.post('/add-post', (req, res) => {
    const { title, content } = req.body;
    const posts = getPosts();
    const newPost = { id: posts.length + 1, title, content };
    posts.push(newPost);
    savePosts(posts);
    res.redirect('/posts');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
