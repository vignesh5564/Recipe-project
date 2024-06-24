const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/recipeDB'; 

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

const recipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    ingredients: String,
    instructions: String,
    imageUrl: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);


app.post('/submit_recipe', (req, res) => {
    const { recipeTitle, recipeDescription, recipeIngredients, recipeInstructions } = req.body;

    const newRecipe = new Recipe({
        title: recipeTitle,
        description: recipeDescription,
        ingredients: recipeIngredients,
        instructions: recipeInstructions,
        imageUrl: '' 
    });

    newRecipe.save()
        .then(() => {
            console.log('Recipe saved successfully');
            res.redirect('/submit_recipe.html'); 
        })
        .catch(err => {
            console.error('Error saving recipe:', err);
            res.status(500).send('Error saving recipe');
        });
});

app.get('/discover_recipes', (req, res) => {
    Recipe.find({})
        .then(recipes => {
            res.send(recipes); 
        })
        .catch(err => {
            console.error('Error fetching recipes:', err);
            res.status(500).send('Error fetching recipes');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
