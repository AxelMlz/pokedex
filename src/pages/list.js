
import React, { useEffect, useState } from 'react'
import Layout from '@theme/Layout';
import { Card, CardFooter, Image, Button } from "@heroui/react";
import ListCSS from "../css/list.css"
export default function List() {
    const [list, setList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        fetch(`https://pokebuildapi.fr/api/v1/pokemon/limit/800`)
            .then((res) => res.json())
            .then((json) => {
                setList(json);
                setIsLoaded(true);
            })
    }, [])
    if (!isLoaded) {
        return (
            <div>
                <h1>Catching ongoing...</h1>
            </div>
        );
    }
    function Evolution(pokemon) {
        if (!pokemon.apiEvolutions[0]) {
        }
        //     return (
        // )
    };
    const chunkedList = [];
    for (let i = 0; i < list.length; i += 5) {
        chunkedList.push(list.slice(i, i + 5));
    }
    const typeColors = {
        Poison: "#A040A0",
        Plante: "#78C850",
        Feu: "#F08030",
        Eau: "#6890F0",
        Électrik: "#F8D030",
        Insecte: "#A8B820",
        Normal: "#A8A878",
        Vol: "#A890F0",
        Sol: "#E0C068",
        Roche: "#B8A038",
        Psy: "#F85888",
        Spectre: "#705898",
        Dragon: "#7038F8",
        Ténèbres: "#705848",
        Acier: "#B8B8D0",
        Fée: "#EE99AC",
        // Ajoutez d'autres types si besoin
    };


    return (
        <Layout>
            <h1>List of Pokemons</h1>
            <div className="row">
                {list.map((pokemon) => {
                    const primaryType = pokemon.apiTypes?.[0]?.name || "Normal";
                    const backgroundColor = typeColors[primaryType] || "#ddd";
                    return (
                        <div className="col col--2" key={pokemon.id}>
                            <div className="pokemon-card" style={{ backgroundColor }}>
                                <h2 className="pokemon-nbr">#{pokemon.id}</h2>
                                <img src={pokemon.image} alt={pokemon.name} className="pokemon-img" />
                                <h1>{pokemon.name}</h1>
                            </div>
                        </div>
                    );
                })}
            </div>





        </Layout>
    )
};


