import LinkedList from "./LinkedList.js";

export default class Stack {
    constructor() {
        this.List = new LinkedList();
    }

    push(x) {
        this.List.insertAtHead(x);
    }

    pop(x) {
        if (this.isEmpty()) {
            console.warn("Underflow...cannot remove more")
            return null;
        }
        this.List.deleteFromStart()
        return true;
    }

    isEmpty() {
        return this.List.isEmpty();
    }

    top() {
        if (this.isEmpty()) {
            return null;
        }
        return this.List.getHead().data;
    }

    display() {
        this.List.displayList();
    }

}