export default class Card {
    constructor(suit, rank) {
        this.suit = suit;  // it include (heart,spade,club,diamond)
        this.rank = rank;  // rank include from 1,2,3,...,J,Q,K
        this.faceUp = false
    }

    get color() {
        return (this.suit === "hearts" || this.suit === "diamonds") ? "red" : "black"; //it check whether move is valid or not 
    }

    toString() {
        const ranks = { 1: "A", 11: "J", 12: "Q", 13: "K" };
        return `${ranks[this.rank] || this.rank}${this.suit[0].toUpperCase()}`; // just for debugging
    }
}