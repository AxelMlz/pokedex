import React from 'react';
import ReactDOM from 'react-dom';
import "../css/list.css";

export default function PokemonOverlay({ pokemon, onClose }) {
    if (!pokemon) return null;

    return ReactDOM.createPortal(
        <div className="overlay" onClick={onClose}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{pokemon.name} #{pokemon.id}</h2>
                <img src={pokemon.image} alt={pokemon.name} />

                <div>
                    <h3>Types</h3>
                    <ul>
                        {pokemon.apiTypes.map((type) => (
                            <li key={type.name}>{type.name}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Stats</h3>
                    <ul>
                        <li><strong>HP:</strong> {pokemon.stats.HP}</li>
                        <li><strong>Attack:</strong> {pokemon.stats.attack}</li>
                        <li><strong>Defense:</strong> {pokemon.stats.defense}</li>
                        <li><strong>Sp. Atk:</strong> {pokemon.stats.special_attack}</li>
                        <li><strong>Sp. Def:</strong> {pokemon.stats.special_defense}</li>
                        <li><strong>Speed:</strong> {pokemon.stats.speed}</li>
                    </ul>
                </div>

                {/* Évolution précédente */}
                {pokemon.apiPreEvolution && pokemon.apiPreEvolution !== "none" && (
                    <>
                        <h3>Évolution précédente</h3>
                        <p>{pokemon.apiPreEvolution.name}</p>
                    </>
                )}


                {/* Évolution suivante */}
                {pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0 && (
                    <>
                        <h3>Évolution suivante</h3>
                        <ul>
                            {pokemon.apiEvolutions.map((evo) => (
                                <li key={evo.pokedexId}>{evo.name}</li>
                            ))}
                        </ul>
                    </>
                )}

            </div>
        </div>,
        document.body // ← rend dans le body
    );
}
