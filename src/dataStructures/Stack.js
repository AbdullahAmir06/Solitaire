import LinkedList from "./LinkedList.js";

export default class Stack {
    constructor() {
        this.List = new LinkedList();
    }

    // ---------- Insert at start ----------
    push(x) {
        this.List.insertAtHead(x);
    }

    // ---------- Delete at start ----------
    pop() {
        if (this.isEmpty()) {
            console.warn("Underflow...cannot remove more")
            return null;
        }
        const topNode = this.getHead();
        if (topNode === null)
            return null
        this.List.deleteFromStart();
        return topNode.data;
    }

    isEmpty() {
        return this.List.isEmpty();
    }

    top() {     // return the value of top element of stack
        if (this.isEmpty()) {
            return null;
        }
        return this.List.getHead().data;
    }

    getHead() {  // it is used to get the head node of stack
        return this.List.getHead();
    }

    display() {
        this.List.displayList();
    }

    size() {    // added a function to find the size of stack
        if (this.isEmpty())
            return 0;
        let size = 0;
        let temp = this.List.getHead();
        while (temp) {
            size++;
            temp = temp.next;
        }
        return size;
    }

    // for UI display of cards 
    toArray() {
        return this.List.toArray();
    }

    // ---------- Cloning game state ----------
    clone() {
        const newStack = new Stack();
        newStack.List = this.List.clone();
        return newStack;
    }
}