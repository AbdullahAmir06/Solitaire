import Card from "./Card.js";

export default class GameLogic {
    constructor() {
        this.deck = [];
        this.tableau = []; // it will contain 7 piles (list)
        this.foundation = {}; // 4 suits (stack)
        this.stock = null; // queue
        this.waste = null;
    }

    createDeck() {
        const suits = ["diamonds", "hearts", "spades", "clubs"]; // all 4 types of cards
        for (const s of suits) {
            for (let r = 0; r < 13; r++) {
                this.deck.push(new Card(s, r))  // push is built in function of array in the javascript and in card(s,r) s is suit and r is rank 
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    initializeTableau(LinkedList,Queue) {
        this.tableau = [];
        let deckIndex = 0;

        for (let i = 0; i < 7; i++) {
            const pile = new LinkedList();
            for (let j = 0; j <= i; j++) {
                const card = this.deck[deckIndex++];
                if (i == j)
                    card.faceUp = true;
                pile.insertAtEnd(card);
            }
            this.tableau.push(pile);
        }

        this.stock = new Queue();
        for (; deckIndex < this.deck.length; deckIndex++)
            this.stock.enqueue(this.deck[deckIndex])
    }

    initializeGame(LinkedList, Stack, Queue) {
        this.createDeck();
        this.shuffleDeck();
        this.initializeTableau(LinkedList,Queue);

        this.waste = new Stack();
        this.foundations = {
            hearts: new Stack(),
            diamonds: new Stack(),
            clubs: new Stack(),
            spades: new Stack(),
        };
    }
}