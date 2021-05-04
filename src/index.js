import express from 'express';
import data from './data.json';
import cors from 'cors';

const app = express()  // instanciranje aplikacije
const port = 4000  // port na kojem će web server slušati

app.use(cors());
app.use(express.json());

//home
app.get('/', (req, res) => res.json(data.weekly_plan))
app.get('/:username', (req, res) => {
    let username = req.params.username; 
    res.json(data.weekly_plan.filter((x) => x.username == username))
})
app.get('/:username/daily_meal', (req, res) => {
    let username = req.params.username; 
    let weekly_plan = data.weekly_plan.filter((x) => x.username == username && x.start_day == "16-07-2021")
    //console.log(weekly_plan)
    let todays_meal = weekly_plan[0].daily_meal.filter((x) => x.day == "Monday")
    
    res.json(todays_meal)
})

//recipes
app.get('/recipes/:username', (req, res) => {
    let username = req.params.username;
    let recipe = data.recipes.filter((x) => x.username == username)
    res.json(recipe)})

//post new recipe
app.post('/recipes/:username', (req, res) => {
    let doc = req.body
    data.recipes.push(doc)
    console.log(data.recipes)
    res.json({status: "ok"})
})

//fridge
app.get("/fridge/:username", (req, res) => {
    let username = req.params.username; 
    console.log(data.fridge)
    let fridge = data.fridge.filter((x) => x.username == username)
    let fridge_items = fridge[0].fridge_items    
    res.json(fridge_items)    
})

//user
app.get("/account/:username", (req, res) => {
    let username = req.params.username;
    let user = data.user.filter((x) => x.username == username)
    res.json(user)
})

app.listen(port, () => console.log(`Slušam na portu ${port}!`))