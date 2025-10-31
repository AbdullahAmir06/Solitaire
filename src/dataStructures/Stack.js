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

    top() {     // return the top element of stack
        if (this.isEmpty()) {
            return null;
        }
        return this.List.getHead().data;
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
        const result = [];
        let temp = this.head;
        while (temp) {
            result.push(temp.data);
            temp = temp.next;
        }
        return result;
    }
}