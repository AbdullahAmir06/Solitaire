import Card from "./Card.js";

export default class GameLogic {
    constructor() {
        this.deck = [];
        this.tableau = []; // it will contain 7 piles (list)
        this.foundations = {}; // 4 suits (stack)
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

    initializeTableau(LinkedList, Queue) {
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

        const detachedSequence = sourcePile.detactSubList(startSequence);

        targetPile.insertSubListAtHead(detachedSequence);

        if (sourcePile.head)
            sourcePile.head.data.faceUp = true;
        return true;


    }

    moveCardToTableau(sourcePile, targetPile) {
        if (sourcePile.isEmpty())
            return false;

        if (this.canMoveToTableau(card, targetPile)) {
            sourcePile.deleteFromStart();
            targetPile.insertAtStart(card);

            if (!sourcePile.isEmpty())
                sourcePile.getHead().data.faceUp = true;    // linkedlist --> node --> (.data) card.js --> faceUp 
            return true;
        }
        return false;
    }

    canMoveToFoundation(card, foundationPile) {    // return boolean based on condition ... check if rank is 1 greater than the top element and the color is same then works
        if (foundationPile.isEmpty())
            return card.rank === 1; // only ace can start the pile

        const topCard = foundationPile.getHead().data;
        if (topCard.color === card.color && topCard.rank === card.rank - 1)
            return true;
        return false;
    }

    moveCardToFoundation(sourcePile, targetPile) {
        if (sourcePile.isEmpty())
            return false;

        if (this.canMoveToFoundation(card, targetPile)) {
            sourcePile.deleteFromStart();
            targetPile.insertAtStart(card);

            if (!sourcePile.isEmpty())
                sourcePile.getHead().data.faceUp = true;    // linkedlist --> node --> (.data) card.js --> faceUp 
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

    drawFromStock() {   // The last element (waste[waste.length-1]) is the topmost card.
        const drawCount = Math.min(3, this.stock.size()); // handle <3 cards left
        for (let i = 0; i < drawCount; i++) {
            const card = this.stock.dequeue();
            card.faceUp = true;
            this.waste.push(card);
        }
    }

    moveWasteCard(indexFromTop, targetPile, isFoundation) {  // move card from waste pile to tableau or foundation based on isFoundation 
        const cardIndex = this.waste.length - 1 - indexFromTop;
        const card = this.waste[cardIndex];

        if ((isFoundation && this.canMoveToFoundation(card, targetPile)) ||
            (!isFoundation && this.canMoveToTableau(card, targetPile))) {
            this.waste.splice(cardIndex, 1);
            targetPile.insertAtStart(card);
            return true;
        }
        return false;
    }


    recycleWasteToStock() { // it remove and place it in the FIFO order as in the queue has already
        this.stock = new Queue();
        while (this.waste.length > 0) {
            const card = this.waste.shift(); // remove from start
            card.faceUp = false;
            this.stock.enqueue(card);
        }
    }


}