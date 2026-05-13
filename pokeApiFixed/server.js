const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use("/pub", express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("pokeApi")
})

app.get("/", (req, res) => {
  res.render("header");
});

app.get("/", (req, res) => {
  res.render("footer");
});

app.get("/gen/:id", async (req, res) => {
  try {
    const gen = req.params.id
    
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`)
    const data = await response.json()

    const pokemons = data.pokemon_species

    res.render("gen", { pokemons })
  } catch (err) {
    console.error(err)
    res.send("Error fetching Pokémon")
  }
});

app.get("/pokemonPage/:id", async (req, res) => {
  try {
    const pokemonName = req.params.id

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const data = await response.json()

    res.render("pokemonPage", { pokemon: data });
  } catch (err) {
    console.error(err);
    res.send("Error fetching Pokémon");
  }
});

app.post("/genSelected", (req, res) => {
  const choice = req.body.genSelect
  
  res.redirect(`/gen/${choice}`)
})

app.post("/pokemonSelected", (req, res) => {
  const choice = req.body.pokemonSelect
  
  res.redirect(`/pokemonPage/${choice}`)
})


app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
