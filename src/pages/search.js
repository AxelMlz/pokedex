import React, { useEffect, useState } from 'react';

import Layout from "@theme/Layout";
import PokemonOverlay from "../components/target-pokemon-overlay"; // tu réutilises ton overlay déjà créé
import "../css/search.css";

export default function Search() {
    const [query, setQuery] = useState("");
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState("");
    const [allPokemons, setAllPokemons] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Charger une fois la liste de tous les Pokémon (pour les suggestions)
    useEffect(() => {
        fetch("https://pokebuildapi.fr/api/v1/pokemon")
            .then((res) => res.json())
            .then((data) => setAllPokemons(data))
            .catch(() => setAllPokemons([]));
    }, []);

    const handleSearch = async (value) => {
        if (!value) return;
        setError("");
        setPokemon(null);

        try {
            const res = await fetch(
                `https://pokebuildapi.fr/api/v1/pokemon/${encodeURIComponent(value)}`
            );
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            setPokemon(data);
        } catch (err) {
            setError("Aucun Pokémon trouvé. Vérifie le nom ou l'ID.");
        }
    };

    // Mettre à jour les suggestions quand on tape
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            const filtered = allPokemons
                .filter((p) =>
                    p.name.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 8); // max 8 suggestions
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (name) => {
        setQuery(name);
        setSuggestions([]);
        handleSearch(name);
    };
    return (
        <Layout>
            <div className="search-container">
                <h1>Recherche de Pokémon</h1>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Nom ou ID du Pokémon"
                        value={query}
                        onChange={handleInputChange}
                    />
                    <button onClick={() => handleSearch(query)}>Rechercher</button>

                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((s) => (
                                <li
                                    key={s.id}
                                    onClick={() => handleSelectSuggestion(s.name)}
                                >
                                    <img src={s.image} alt={s.name} />
                                    {s.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {error && <p className="error">{error}</p>}

                {pokemon && (
                    <PokemonOverlay
                        pokemon={pokemon}
                        onClose={() => setPokemon(null)}
                        onSelectPokemon={setPokemon}
                    />
                )}
            </div>
        </Layout>
    );
}