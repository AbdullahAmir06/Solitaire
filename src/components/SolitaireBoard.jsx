import React, { useState } from "react";
import Card from "@heruka_urgyen/react-playing-cards";
import GameLogic from './../game/GameLogic.js';
import LinkedList from "../dataStructures/LinkedList";
import Stack from "../dataStructures/Stack";
import Queue from "../dataStructures/Queue";

const game = new GameLogic();


export default function SolitaireBoard({ game }) {

    const [update, setUpdate] = useState(false);
    if (!game.deck.length) {
        game.initializeGame(LinkedList, Stack, Queue);
    }

    const rerender = () => setUpdate(!update);


}