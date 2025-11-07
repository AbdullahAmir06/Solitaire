class Node { // used to create a single node in linked list
    constructor(val) {
        this.data = val;
        this.next = null;
    }
}

export default class LinkedList {
    constructor() {
        this.head = null;
    }

    // ---------- Helper Methods ----------
    isEmpty() { return this.head == null; } //check if the linkedlisdt is empty or not
    getHead() { return this.head; } // return the head of linkedlist
    setHead(newHead) { this.head = newHead; } // it set the new head of linked list

    // ---------- Insertions ----------
    insertAtHead(x) {
        const newNode = new Node(x);
        newNode.next = this.head;
        this.head = newNode;
        return this.head;
    }

    insertSubListAtHead(subListHead) {  // used to attach sub list to head when the user 
        let last = subListHead;
        while (last.next)
            last = last.next;
        last.next = this.head;
        this.head = subListHead;
    }

    insertAtEnd(x) {
        const newNode = new Node(x);
        if (!this.head) {
            this.head = newNode;
            return this.head;
        }
        let temp = this.head;
        while (temp.next !== null)
            temp = temp.next;
        temp.next = newNode;
        return newNode;
    }

    insertNode(index, x) {
        if (index < 0) {
            console.log("Wrong Index");
            return null;
        }
        if (index == 0)
            return this.insertAtHead(x)

        let temp = this.head;
        i = 0
        while (i < index - 1) {
            if (!temp) {
                console.log("Index Greater than list size");
                return null;
            }
            temp = temp.next;
            i++;
        }

        const newNode = new Node(x);
        newNode.next = temp.next;
        temp.next = newNode;
        return newNode;
    }

    // ---------- Deletions ----------
    deleteFromStart() {
        if (this.isEmpty())
            return false;
        this.head = this.head.next;
        return true;
    }

    deleteFromEnd() {
        if (this.isEmpty())
            return false;
        if (!this.head.next) {
            this.head = null;
            return true;
        }

        let temp = this.head;
        while (temp.next && temp.next.next)
            temp = temp.next
        temp.next = null;
        return true;
    }

    deleteNode(x) {
        let found = false;
        while (this.head && this.head.data === x) {
            this.head = this.head.next;
            found = true;
        }

        let current = this.head;
        while (current && current.next) {
            if (current.next.data === x) {
                current.next = current.next.next;
                found = true;
            }
            else {
                current = current.next;
            }
        }
        return found;
    }

    findNode(x) {
        let temp = this.head;
        while (temp) {
            if (temp.data === x) return true;
            temp = temp.next;
        }
        return true;
    }

    findNodeByCard(x) {
        let temp = this.head;
        while (temp) {
            if (temp.data === x) return temp; // return Node
            temp = temp.next;
        }
        return null;
    }

    detachSubList(endNode) {   // it break the sub list from head to end node
        if (!this.head) return null;

        // if the clicked card (endNode) is the head itself
        if (this.head === endNode) {
            const detached = this.head;    // everything from head (just one card)
            this.head = null;              // tableau becomes empty
            return detached;               // return that one card
        }

        // Otherwise, traverse until the node *just before* endNode
        let prev = null;
        let curr = this.head;
        while (curr && curr !== endNode) {
            prev = curr;
            curr = curr.next;
        }

        // If endNode not found
        if (!curr) return null;

        // 'prev' is the card below the dragged sequence
        const detachedHead = this.head;  // topmost card (A)
        prev.next = curr;                // cut link after endNode
        this.head = curr.next;           // new tableau head (D)
        curr.next = null;                // detach 'endNode' tail properly

        return detachedHead;             // return the full detached sublist (A→B→C)

    }

    displayList() {
        let temp = this.head;
        let out = "";
        while (temp) {
            out += temp.data + " --> ";
            temp = temp.next;
        }
        console.log(out + "NULL");
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

    reverseList() {
        let current = this.head;
        let newHead = null;
        while (current) {
            const newNode = new Node(current.data);
            newNode.next = newHead;
            newHead = newNode;
            current = current.next;
        }
        return newHead;
    }


    // ---------- Sort (Selection Sort) ----------
    sortList(list) {
        if (!list) return list;
        let current = list;

        while (current) {
            let minNode = current;
            let nextNode = current.next;
            while (nextNode) {
                if (nextNode.data < minNode.data) minNode = nextNode;
                nextNode = nextNode.next;
            }
            // swap
            const temp = current.data;
            current.data = minNode.data;
            minNode.data = temp;

            current = current.next; // to move next in the loop
        }
        return list;
    }

    // ---------- Remove Duplicates ----------
    removeDuplicates(list) {
        let current = this.sortList(list);
        while (current && current.next) {
            if (current.data === current.next.data) {
                current.next = current.next.next;
            } else {
                current = current.next;
            }
        }
        return list;
    }

    // ---------- Merge Two Lists ----------
    mergeLists(list1, list2) {
        if (!list1) return list2;
        let temp = list1;
        while (temp.next) temp = temp.next;
        temp.next = list2;
        return list1;
    }

    // ---------- Cloning game to save state for undo/redo ----------
    clone() {
        const newList = new LinkedList();
        let node = this.head;
        let prevNewNode = null;

        while (node) {
            const newNode = new Node(node.data.clone()); // it will clone card
            if (!newList.head)
                newList.head = newNode;
            if (prevNewNode)
                prevNewNode.next = newNode;
            prevNewNode = newNode;
            node = node.next;
        }

        return newList;
    }

}
