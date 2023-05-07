import React, {ChangeEvent, FormEventHandler, useCallback, useEffect, useMemo, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import styles from "../stack-page/stack-page.module.css";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {TCircle} from "../../types/circle";
import {Queue} from "./queue";

const QUEUE_SIZE = 7;

export const QueuePage: React.FC = () => {
  const [ inputString, setInputString ] = useState<string>("");
  const [ circles, setCircles ] = useState<TCircle[]>([]);

  const queue = useMemo(() => new Queue<string>(7), []);

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setInputString(evt.target.value);
  }, []);

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
  }, [inputString, queue]);

  const onDelete = useCallback(() => {
    setCircles(circles.slice().map((item, index) => index === queue.getHead() ? {...item, state: ElementStates.Changing} : item));
    setTimeout(() => {
      queue.dequeue();
      setCircles(queue.getArray().map(item => ({ value: item? item : "", state: ElementStates.Default })));
    }, SHORT_DELAY_IN_MS);
  }, [circles, queue]);

  const reset = useCallback(() => {
    queue.clear();
    setCircles([...Array(QUEUE_SIZE)].fill({ value: "", state: ElementStates.Default }))
  }, [queue]);

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
