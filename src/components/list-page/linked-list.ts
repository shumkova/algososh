import {Node} from "../../utils/node";

interface ILinkedList<T> {
  append: (element: T) => void;
  addByIndex: (element: T, index: number) => void;
  deleteByIndex: (index: number) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  getSize: () => number;
  getHead: () => Node<T> | null;
  toArray: () => T[];
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;
  constructor( arr?: T[] ) {
    this.head = null;
    this.size = 0;

    if (arr && arr.length > 0) {
      arr.forEach(item => this.append(item));
    }
  }

  addByIndex(element: T, index: number) {
    if (index < 0 || index > this.size) {
      console.log("Enter a valid index");
      return;
    } else {
      const node = new Node(element);
      // добавить элемент в начало списка
      if (index === 0) {
        node.next = this.head;
        this.head = node;
      } else {
        let curr = this.head;
        let currIndex = 0;
        // перебрать элементы в списке до нужной позиции
        while (curr && currIndex < index - 1) {
          curr = curr.next;
          currIndex++;
        }
        // добавить элемент
        node.next = curr ? curr.next : null;
        if (curr) {
          curr.next = node;
        }
      }
      this.size++;
    }
  }

  append(element: T) {
    const node = new Node(element);
    let current;
    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  deleteByIndex(position: number) {
    if (position < 0 || position > this.size) {
      return "Enter a valid index";
    }

    if (!this.head) {
      return "List is empty";
    }

    let current: Node<T> | null = this.head;

    if (position === 0) {
      this.head = current.next;
    } else {
      let prev = null;
      let index = 0;

      while (current && index < position) {
        prev = current;
        current = current.next;
        index++;
      }

      if (prev) {
        prev.next = current? current.next : null;
      }
    }
    this.size--;
  }

  deleteHead() {
    if (!this.head) {
      return "List is empty";
    }
    let temp = this.head;
    this.head = temp.next;
    this.size--;
  }

  deleteTail() {
    if (this.size === 0) {
      return "List is empty";
    }
    this.deleteByIndex(this.size - 1);
  }

  getSize() {
    return this.size;
  }

  getHead() {
    return this.head;
  }

  toArray() {
    let curr = this.head;
    let res = [];
    while (curr) {
      res.push(curr.value);
      curr = curr.next;
    }
    return res;
  }
}