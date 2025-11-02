import { tr } from "framer-motion/client";
import Card from "./Card.js";

export default class GameLogic {
    constructor() {
        this.cardMap = new Map();
        this.deck = [];
        this.tableau = []; // it will contain 7 piles (list)
        this.foundations = {}; // 4 suits (stack)
        this.stock = null; // queue
        this.waste = null;
    }

    createDeck() {
        const suits = ["diamonds", "hearts", "spades", "clubs"]; // all 4 types of cards
        for (const s of suits) {
            for (let r = 1; r <= 13; r++) {
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

    initializeTableau(LinkedList, Queue) {
        this.tableau = [];
        let deckIndex = 0;

        for (let i = 0; i < 7; i++) {
            const pile = new LinkedList();
            for (let j = 0; j <= i; j++) {
                const card = this.deck[deckIndex++];
                if (i == j)
                    card.faceUp = true;
                pile.insertAtHead(card);
                this.cardMap.set(card, { pile: `tableau${i+1}`, faceUp: card.faceUp });
            }
            this.tableau.push(pile);
        }

        this.stock = new Queue();
        for (; deckIndex < this.deck.length; deckIndex++) {
            this.stock.enqueue(this.deck[deckIndex])
            this.cardMap.set(this.deck[deckIndex], { pile: "stock", faceUp: false });
        }
    }

    initializeGame(LinkedList, Stack, Queue) {
        this.createDeck();
        this.shuffleDeck();
        this.initializeTableau(LinkedList, Queue);

        this.waste = []; // simple array to store card from stock and top 3 faceup cards
        this.foundations = {    // 4 stack which store all cards in ascending order to win the game
            hearts: new Stack(),
            diamonds: new Stack(),
            clubs: new Stack(),
            spades: new Stack(),
        };
    }

    /**
     * Check if a card can move to a tableau pile
     * @param {Card} card - The card being moved
     * @param {LinkedList} targetPile - The target tableau pile
     * @returns {boolean} True if move is legal
     */

    canMoveToTableau(card, targetPile) {    // return boolean based on condition ... check if rank is 1 less than the top element and the color is different then works  
        if (targetPile.isEmpty())
            return card.rank === 13; // only king can start the pile

        const topCard = targetPile.getHead().data;
        if (topCard.color !== card.color && topCard.rank === card.rank + 1) {
            return true;
        }
        return false;
    }

    moveMultipleCardWithinTableau(sourcePile, targetPile, clickedCard) {
        if (sourcePile.isEmpty())
            return false;

        const startSequence = sourcePile.findNodeByCard(clickedCard);
        if (!startSequence || !startSequence.data.faceUp)
            return false;

        if (!this.canMoveToTableau(startSequence.data, targetPile))
            return false;

        const detachedSequence = sourcePile.detachSubList(startSequence);

        targetPile.insertSubListAtHead(detachedSequence);

        if (sourcePile.head)
            sourcePile.head.data.faceUp = true;

        const tIndex = this.getTableauIndex(targetPile);
        let node = detachedSequence;
        while (node) {
            this.cardMap.set(node.data, { pile: `tableau${tIndex+1}`, faceUp: node.data.faceUp });
            node = node.next;
        }
        return true;


    }

    moveCardToTableau(sourcePile, targetPile) {
        if (sourcePile.isEmpty())
            return false;

        const card = sourcePile.getHead().data;
        if (this.canMoveToTableau(card, targetPile)) {
            sourcePile.deleteFromStart();
            targetPile.insertAtHead(card);
            const index = this.getTableauIndex(targetPile);
            this.cardMap.set(card, { pile: `tableau${index+1}`, faceUp: card.faceUp });

            if (!sourcePile.isEmpty()) {
                sourcePile.getHead().data.faceUp = true;    // linkedlist --> node --> (.data) card.js --> faceUp 
                const srcIndex = this.getTableauIndex(sourcePile);
                this.cardMap.set(sourcePile.getHead().data, { pile: `tableau${srcIndex+1}`, faceUp: true });
            }
            return true;
        }
        return false;
    }

    canMoveToFoundation(card, foundationPile) {    // return boolean based on condition ... check if rank is 1 greater than the top element and the color is same then works
        if (foundationPile.isEmpty())
            return card.rank === 1; // only ace can start the pile

        const topCard = foundationPile.top();
        if (topCard.color === card.color && topCard.rank === card.rank - 1)
            return true;
        return false;
    }

    moveCardToFoundation(sourcePile, targetPile) {
        if (sourcePile.isEmpty())
            return false;

        const card = sourcePile.getHead().data;
        if (this.canMoveToFoundation(card, targetPile)) {
            sourcePile.deleteFromStart();
            targetPile.push(card);
            const key = this.getFoundationKeyByPile(targetPile);
            this.cardMap.set(card, { pile: `foundation-${key}`, faceUp: card.faceUp });

            if (!sourcePile.isEmpty()) {
                sourcePile.getHead().data.faceUp = true;    // linkedlist --> node --> (.data) card.js --> faceUp 
                const srcIndex = this.getTableauIndex(sourcePile);
                this.cardMap.set(sourcePile.getHead().data, { pile: `tableau${srcIndex+1}`, faceUp: true });
            }
            return true;
        }
        return false;
    }


    checkWin() {    // condition to check whether user has win the game or not   
        return this.foundations.hearts.size() === 13 &&
            this.foundations.diamonds.size() === 13 &&
            this.foundations.clubs.size() === 13 &&
            this.foundations.spades.size() === 13;
    }

    showTop3CardsFromWaste() {
        for (let i = 0; i < this.waste.length; i++) {
            this.waste[i].faceUp = false;
            this.cardMap.set(this.waste[i], { pile: "waste", faceUp: this.waste[i].faceUp });
        }
        for (let i = Math.max(0, this.waste.length - 3); i < this.waste.length; i++) {
            this.cardMap.set(this.waste[i], { pile: "waste", faceUp: this.waste[i].faceUp });
            this.waste[i].faceUp = true;
        }

    }

    drawFromStock() {   // The last element (waste[waste.length-1]) is the topmost card.
        const drawCount = Math.min(3, this.stock.size()); // handle <3 cards left
        for (let i = 0; i < drawCount; i++) {
            const card = this.stock.dequeue();
            card.faceUp = true;
            this.waste.push(card);
            this.cardMap.set(card, { pile: "waste", faceUp: card.faceUp });
        }
        this.showTop3CardsFromWaste()
    }


    moveWasteCard(indexFromTop, targetPile, isFoundation) {  // move card from waste pile to tableau or foundation based on isFoundation 
        const cardIndex = this.waste.length - 1 - indexFromTop;
        const card = this.waste[cardIndex];
        if (!card) return false;

        if (isFoundation) {
            if (!this.canMoveToFoundation(card, targetPile)) return false;
            this.waste.splice(cardIndex, 1);
            targetPile.push(card);
            const key = this.getFoundationKeyByPile(targetPile);
            this.cardMap.set(card, { pile: `foundation-${key}`, faceUp: card.faceUp });
        } else {
            if (!this.canMoveToTableau(card, targetPile)) return false;
            this.waste.splice(cardIndex, 1);
            targetPile.insertAtHead(card);
            const tIndex = this.getTableauIndex(targetPile);
            this.cardMap.set(card, { pile: `tableau${tIndex+1}`, faceUp: card.faceUp });
        }

        return true;
    }



    recycleWasteToStock(queue) { // it remove and place it in the FIFO order as in the queue has already
        this.stock = queue
        while (this.waste.length > 0) {
            const card = this.waste.shift(); // remove from start
            card.faceUp = false;
            this.stock.enqueue(card);
            this.cardMap.set(card, { pile: "stock", faceUp: card.faceUp });

            console.log("Recycling waste:", this.waste.length, "cards -> stock");

        }
    }

    // function for map
    getTableauIndex(pile) {
        return this.tableau.indexOf(pile); // returns 0..6 or -1
    }

    // funciton for map it return foundation key string (e.g. "hearts")
    getFoundationKeyByPile(pile) {
        for (const key of Object.keys(this.foundations)) {
            if (this.foundations[key] === pile) return key;
        }
        return null;
    }

    // it is just for display of cards via map 
    logCardMap() {
        for (let [card, info] of this.cardMap.entries()) {
            console.log(`${card.rank} of ${card.suit} → ${info.pile} (faceUp=${info.faceUp})`);
        }
    }



    



}