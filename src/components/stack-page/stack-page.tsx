import React, {ChangeEvent, FormEventHandler, useCallback, useMemo, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import styles from "./stack-page.module.css";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  clear: () => void;
  getArray: () => T[];
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
  getArray = (): T[] => this.container;
  getSize = () => this.container.length;
}

type TCircle = {
  value: string;
  state?: ElementStates;
}

export const StackPage: React.FC = () => {
  const [ inputString, setInputString ] = useState<string>("");
  const [ circles, setCircles ] = useState<TCircle[]>([]);

  const stack = useMemo(() => new Stack<string>(), []);

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setInputString(evt.target.value);
  }, [setInputString]);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    stack.push(inputString);

    const arr = stack.getArray();

    setCircles(arr.map((item, index) => {
      const isLast = index === arr.length - 1;
      return { value: item, state: isLast ? ElementStates.Changing : ElementStates.Default};
    }));

    setTimeout(() => {
      setCircles(arr.map(item => ({ value: item, state: ElementStates.Default })));
    }, SHORT_DELAY_IN_MS);

    const input: HTMLInputElement | null = document.querySelector(".text_type_input");
    if (input) {
      input.value = "";
      const e = new Event("change");
      input.dispatchEvent(e);
    }
    setInputString("");
  }, [inputString, setCircles, stack]);

  const onDelete = useCallback(() => {
    setCircles(circles.slice().map((item, index) => ({ value: item.value, state: index === circles.length - 1 ? ElementStates.Changing : ElementStates.Default })));
    setTimeout(() => {
      stack.pop();
      setCircles(stack.getArray().map(item => ({ value: item, state: ElementStates.Default })));
    }, SHORT_DELAY_IN_MS);
  }, [setCircles, circles, stack]);

  const reset = useCallback(() => {
    stack.clear();
    setCircles([]);
  }, [stack, setCircles]);

  return (
    <SolutionLayout title="Стек">
      <div className="container">
        <form action="#" onSubmit={onSubmit}>
          <div className="condition">
            <Input
              maxLength={4}
              isLimitText={true}
              onChange={onChange}
              name={"string"}
              extraClass={styles.input}
            />
            <Button
              text={"Добавить"}
              type={"submit"}
              disabled={!inputString.length}
            />
            <Button
              text={"Удалить"}
              disabled={!circles.length}
              onClick={onDelete}
            />
            <Button
              text={"Очистить"}
              type={"reset"}
              disabled={!circles.length}
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
                head={index === circles.length - 1 ? "top" : ""}
                tail={index.toString()}
                key={`${item}${index}`}
              />
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
