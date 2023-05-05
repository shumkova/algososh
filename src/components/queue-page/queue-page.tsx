import React, {ChangeEvent, FormEventHandler, useCallback, useEffect, useMemo, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import styles from "../stack-page/stack-page.module.css";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

type TCircle = {
  value: string;
  state?: ElementStates;
}

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

const QUEUE_SIZE = 7;

export const QueuePage: React.FC = () => {
  const [ inputString, setInputString ] = useState<string>("");
  const [ circles, setCircles ] = useState<TCircle[]>([]);

  const queue = useMemo(() => new Queue<string>(7), []);

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setInputString(evt.target.value);
  }, [setInputString]);

  useEffect(() => {
    setCircles([...Array(QUEUE_SIZE)].fill({ value: "", state: ElementStates.Default }))
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    queue.enqueue(inputString);
    const arr = queue.getArray();
    setCircles(arr.map((item, index) => ({ value: item? item : "", state: index === queue.getTail() ? ElementStates.Changing : ElementStates.Default })));
    setTimeout(() => {
      setCircles(arr.map(item => ({ value: item? item : "", state: ElementStates.Default })));
    }, SHORT_DELAY_IN_MS);

    const input: HTMLInputElement | null = document.querySelector(".text_type_input");
    if (input) {
      input.value = "";
      const e = new Event("change");
      input.dispatchEvent(e);
    }
    setInputString("");
  }, [inputString, setCircles, queue]);

  const onDelete = useCallback(() => {
    setCircles(circles.slice().map((item, index) => {
      return index === queue.getHead() ? {...item, state: ElementStates.Changing} : item;
    }));
    setTimeout(() => {
      queue.dequeue();
      setCircles(queue.getArray().map(item => ({ value: item? item : "", state: ElementStates.Default })));
    }, SHORT_DELAY_IN_MS);
  }, [setCircles, circles, queue]);

  const reset = useCallback(() => {
    queue.clear();
    setCircles([...Array(QUEUE_SIZE)].fill({ value: "", state: ElementStates.Default }))
  }, [queue, setCircles]);

  return (
    <SolutionLayout title="Очередь">
      <div className="container">
        <form action="#" onSubmit={onSubmit}>
          <div className="condition">
            <Input
              maxLength={4}
              isLimitText={true}
              onChange={onChange}
              name={"string"}
              extraClass={styles.input}
              disabled={queue.isFull()}
            />
            <Button
              text={"Добавить"}
              type={"submit"}
              disabled={queue.isFull() || !inputString.length}
            />
            <Button
              text={"Удалить"}
              disabled={queue.isEmpty()}
              onClick={onDelete}
            />
            <Button
              text={"Очистить"}
              type={"reset"}
              disabled={queue.isEmpty()}
              style={{marginLeft: "auto"}}
              onClick={reset}
            />
          </div>
        </form>
        <div className="vis">
          {
            circles.map((item, index) => {
              return <Circle
                letter={item.value}
                state={item.state}
                head={index === queue.getHead() && item.value ? "head" : null}
                index={index}
                tail={index === queue.getTail() && item.value ? "tail" : null}
                key={`${item}${index}`}
              />
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
