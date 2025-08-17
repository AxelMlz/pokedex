import React from 'react';

const typeColors = {
    Plante: "#78C850",
    Feu: "#F08030",
    Eau: "#6890F0",
    Poison: "#A040A0",
    Électrik: "#F8D030",
    Insecte: "#A8B820",
    Vol: "#A890F0",
    Sol: "#E0C068",
    Roche: "#B8A038",
    Psy: "#F85888",
    Spectre: "#705898",
    Dragon: "#7038F8",
    Ténèbres: "#705848",
    Acier: "#B8B8D0",
    Fée: "#EE99AC",
    Normal: "#A8A878",
};

export default function PokemonOverlay({ pokemon, onClose, onSelectPokemon }) {
    if (!pokemon) return null;

    const baseUrl = "https://pokebuildapi.fr/api/v1/pokemon";

    // Build l’endpoint à partir d’un objet d’évolution (pré ou post)
    const buildEndpoint = (ref) => {
        if (!ref) return null;
        // Tenter toutes les variantes possibles d'id
        const id =
            ref.pokedexId ??
            ref.pokedexID ??
            ref.id ??
            ref.pokedexIdd; // au cas où
        if (id) return `${baseUrl}/${id}`;
        if (ref.name) return `${baseUrl}/${encodeURIComponent(ref.name)}`; // fallback par nom
        return null;
    };

    const handleEvolutionClick = async (ref, e) => {
        e.preventDefault();
        e.stopPropagation();
        const endpoint = buildEndpoint(ref);
        if (!endpoint) return;

        const res = await fetch(endpoint);
        if (!res.ok) return;
        const data = await res.json();
        onSelectPokemon?.(data);
    };

    const getRelationColor = (multiplier) => {
        if (multiplier === 0) return { backgroundColor: "#444", color: "#fff" }; // Immunité
        if (multiplier < 0.5) return { backgroundColor: "#44e269ff", color: "#289642ff" }; // Double Résistance
        if (multiplier > 2) return { backgroundColor: "#f03545ff", color: "#2e0106ff" }; // Double Faiblesse
        if (multiplier < 1) return { backgroundColor: "#98e9abff", color: "#176128ff" }; // Résistance
        if (multiplier > 1) return { backgroundColor: "#ec8f96ff", color: "#942530ff" }; // Faiblesse
        return { backgroundColor: "#dddcdcff", color: "#333" }; // Normal
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>

                <h2>{pokemon.name} #{pokemon.id}</h2>
                <img src={pokemon.image} alt={pokemon.name} />

                <h3>Types</h3>
                <ul>
                    {pokemon.apiTypes.map((type) => (
                        <li key={type.name}>{type.name}</li>
                    ))}
                </ul>

                <h3>Stats</h3>
                <ul>
                    <li><strong>HP:</strong> {pokemon.stats.HP}</li>
                    <li><strong>Attack:</strong> {pokemon.stats.attack}</li>
                    <li><strong>Defense:</strong> {pokemon.stats.defense}</li>
                    <li><strong>Sp. Atk:</strong> {pokemon.stats.special_attack}</li>
                    <li><strong>Sp. Def:</strong> {pokemon.stats.special_defense}</li>
                    <li><strong>Speed:</strong> {pokemon.stats.speed}</li>
                </ul>

                {/* === Résistances en tableau === */}
                {pokemon.apiResistances && pokemon.apiResistances.length > 0 && (
                    <div>
                        <h3>Résistances</h3>
                        <table className="resistance-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Relation</th>
                                    <th>Multiplicateur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pokemon.apiResistances.map((res) => (
                                    <tr key={res.name}>
                                        <td
                                            style={{
                                                backgroundColor: typeColors[res.name] || "#ddd",
                                                color: "#fff",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {res.name}
                                        </td>
                                        <td style={getRelationColor(res.damage_multiplier)}>
                                            {res.damage_relation}
                                        </td>
                                        <td style={getRelationColor(res.damage_multiplier)}>
                                            {res.damage_multiplier}x
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Évolution précédente */}
                {pokemon.apiPreEvolution && pokemon.apiPreEvolution !== "none" && (
                    <>
                        <h3>Évolution précédente</h3>
                        <p>
                            <a
                                href="#"
                                className="evo-link"
                                onClick={(e) => handleEvolutionClick(pokemon.apiPreEvolution, e)}
                            >
                                {pokemon.apiPreEvolution.name}
                            </a>
                        </p>
                    </>
                )}

                {/* Évolutions suivantes */}
                {pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0 && (
                    <>
                        <h3>Évolutions suivantes</h3>
                        <ul className="evo-list">
                            {pokemon.apiEvolutions.map((evo) => (
                                <li key={`${evo.pokedexId || evo.name}`}>
                                    <a
                                        href="#"
                                        className="evo-link"
                                        onClick={(e) => handleEvolutionClick(evo, e)}
                                    >
                                        {evo.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}