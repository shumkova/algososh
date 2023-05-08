interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  clear: () => void;
  getArray: () => (T | null)[];
  getHead: () => number;
  getTail: () => number;
  isEmpty: () => boolean;
  isFull: () => boolean;
}

export class Queue<T> implements IQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;
  constructor(size: number) {
    this.size = size;
    this.container = Array(size).fill(null);
  }
  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }
    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  };
  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    this.container[this.head % this.size] = null;
    this.head++;
    this.length--;
  };
  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    return this.container[this.head % this.size];
  };
  getHead = () => this.head % this.size;
  getTail = () => (this.tail - 1) % this.size;
  getArray = () => this.container;
  isEmpty = () => this.length === 0;
  isFull = () => this.length >= this.size;
  clear = () => {
    this.container = Array(this.size).fill(null);
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  };
}