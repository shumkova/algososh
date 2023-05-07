import React, {FormEventHandler, useCallback, useEffect, useMemo, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import styles from "../stack-page/stack-page.module.css";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {TCircle} from "../../types/circle";
import {Queue} from "./queue";
import {clearInput} from "../../utils";
import {useForm} from "../../hooks/use-form";

const QUEUE_SIZE = 7;

export enum BaseAnim {
  add = "add",
  delete = "delete"
}

export const QueuePage: React.FC = () => {
  const { values, setValues, handleChange } = useForm<{ str: string }>({ str: "" });
  const [ circles, setCircles ] = useState<TCircle[]>([]);
  const [ anim, setAnim ] = useState<BaseAnim | null>(null);

  const queue = useMemo(() => new Queue<string>(7), []);

  useEffect(() => {
    setCircles([...Array(QUEUE_SIZE)].fill({ value: "", state: ElementStates.Default }))
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    setAnim(BaseAnim.add);
    queue.enqueue(values.str);
    const arr = queue.getArray();
    setCircles(arr.map((item, index) => ({ value: item? item : "", state: index === queue.getTail() ? ElementStates.Changing : ElementStates.Default })));
    setTimeout(() => {
      setCircles(arr.map(item => ({ value: item? item : "", state: ElementStates.Default })));
      const input: HTMLInputElement | null = document.querySelector(".text_type_input");
      if (input) {
        clearInput(input);
      }
      setValues({ str: "" });
      setAnim(null);
    }, SHORT_DELAY_IN_MS);
  }, [values.str, queue, setValues]);

  const onDelete = useCallback(() => {
    setAnim(BaseAnim.delete);
    setCircles(circles.slice().map((item, index) => index === queue.getHead() ? {...item, state: ElementStates.Changing} : item));
    setTimeout(() => {
      queue.dequeue();
      setCircles(queue.getArray().map(item => ({ value: item? item : "", state: ElementStates.Default })));
      setAnim(null);
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
              onChange={handleChange}
              name={"str"}
              extraClass={styles.input}
              disabled={queue.isFull()}
            />
            <Button
              text={"Добавить"}
              type={"submit"}
              disabled={queue.isFull() || !values.str.length || (!!anim && anim !==BaseAnim.add)}
              isLoader={anim === BaseAnim.add}
            />
            <Button
              text={"Удалить"}
              disabled={queue.isEmpty() || (!!anim && anim !== BaseAnim.delete)}
              onClick={onDelete}
              isLoader={anim === BaseAnim.delete}
            />
            <Button
              text={"Очистить"}
              type={"reset"}
              disabled={queue.isEmpty() || !!anim}
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
