import LinkedList from "./LinkedList.js";

export default class Queue {
    constructor() {
        this.list = new LinkedList();
    }

    // ---------- Insert at end ----------
    enqueue(x) {
        this.list.insertAtEnd(x);
    }

    // ---------- Delete at start ----------
    dequeue() {
        if (this.list.isEmpty())
            return null;

        const headNode = this.list.getHead();
        this.list.deleteFromStart();
        return headNode.data;  // return the card (value stored in the node)
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

    size() {    // added a function to find the size of queue
        if (this.isEmpty())
            return 0;
        let size = 0;
        let temp = this.list.getHead();
        while (temp) {
            size++;
            temp = temp.next;
        }
        return size;
    }


    // ---------- Cloning Game state ----------
    clone() {
        const newQueue = new Queue();
        newQueue.list = this.list.clone();
        return newQueue;
    }
}
