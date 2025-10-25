import LinkedList from "./LinkedList.js";

export default class Queue {
    constructor() {
        this.list = new LinkedList();
    }

    enqueue(x) {
        this.list.insertAtEnd(x);
    }

    dequeue() {
        this.list.deleteFromStart();
    }

    peek() {
        const head = this.list.getHead();
        return head ? head.data : -1;
    }

    isEmpty() {
        return this.list.isEmpty();
    }

    display() {
        this.list.displayList();
    }
}
