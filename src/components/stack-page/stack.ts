interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  clear: () => void;
  getElements: () => T[];
  getSize: () => number;
}

export class Stack<T> implements IStack<T> {
  private container: T[] = [];
  push = (item: T): void => {
    this.container.push(item);
  };
  pop = (): void => {
    if (this.getSize() > 0){
      this.container.pop();
    }
  };
  peak = (): T | null => {
    const size = this.getSize();
    if (size > 0 ) {
      return this.container[size - 1];
    }
    return null;
  };
  clear = (): void => {
    this.container = [];
  }
  getElements = (): T[] => this.container;
  getSize = () => this.container.length;
}