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

const q = new Queue();
q.enqueue(3);
q.enqueue(5);
q.enqueue(7);
q.display(); // 3 --> 5 --> 7 --> NULL
q.dequeue();
q.display(); // 5 --> 7 --> NULL