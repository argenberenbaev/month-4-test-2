
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPokemon = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );

        const pokemonList = response.data.results;

        const pokemonData = await Promise.all(
          pokemonList.map(async (item) => {
            const details = await axios.get(item.url);

            return {
              id: details.data.id,
              name: details.data.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.data.id}.png`,
            };
          })
        );

        setPokemon(pokemonData);
      } catch (err) {
        setError("Не удалось загрузить покемонов. Попробуйте ещё раз.");
      } finally {
        setLoading(false);
      }
    };

    getPokemon();
  }, []);

  if (loading) {
    return <h2>Загрузка покемонов...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="app">
      <h1>Покемоны</h1>

      <div className="pokemon-grid">
        {pokemon.map((item) => (
          <div className="pokemon-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h2>{item.name}</h2>
            <p>ID: {item.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
