import React, {FormEventHandler, useCallback, useMemo, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import styles from "./stack-page.module.css";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {TCircle} from "../../types/circle";
import {Stack} from "./stack";
import {BaseAnim} from "../queue-page/queue-page";
import {useForm} from "../../hooks/use-form";

export const StackPage: React.FC = () => {
  const { values, setValues, handleChange } = useForm<{ str: string }>({ str: "" });
  const [ circles, setCircles ] = useState<TCircle[]>([]);
  const [ anim, setAnim ] = useState<BaseAnim | null>(null);

  const stack = useMemo(() => new Stack<string>(), []);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((evt) => {
    evt.preventDefault();
    setAnim(BaseAnim.add);
    stack.push(values.str);

    const arr = stack.getElements();

    setCircles(arr.map((item, index) => ({ value: item, state: index === arr.length - 1 ? ElementStates.Changing : ElementStates.Default })));

    setTimeout(() => {
      setCircles(arr.map(item => ({ value: item, state: ElementStates.Default })));
      setAnim(null);
      setValues({ str: "" });
    }, SHORT_DELAY_IN_MS);
  }, [values.str, stack, setValues]);

  const onDelete = useCallback(() => {
    setAnim(BaseAnim.delete);
    setCircles(circles.slice().map((item, index) => ({ value: item.value, state: index === circles.length - 1 ? ElementStates.Changing : ElementStates.Default })));
    setTimeout(() => {
      stack.pop();
      setCircles(stack.getElements().map(item => ({ value: item, state: ElementStates.Default })));
      setAnim(null);
    }, SHORT_DELAY_IN_MS);
  }, [circles, stack]);

  const reset = useCallback(() => {
    stack.clear();
    setCircles([]);
  }, [stack]);

  return (
    <SolutionLayout title="Стек">
      <div className="container">
        <form action="#" onSubmit={onSubmit}>
          <div className="condition">
            <Input
              maxLength={4}
              isLimitText={true}
              onChange={handleChange}
              name={"str"}
              extraClass={styles.input}
              disabled={!!anim}
              value={values.str}
            />
            <Button
              text={"Добавить"}
              type={"submit"}
              disabled={!values.str.length || (!!anim && anim !== BaseAnim.add)}
              isLoader={anim === BaseAnim.add}
              data-cy={"addButton"}
            />
            <Button
              text={"Удалить"}
              disabled={!circles.length || (!!anim && anim !== BaseAnim.delete)}
              isLoader={anim === BaseAnim.delete}
              onClick={onDelete}
              data-cy={"deleteButton"}
            />
            <Button
              text={"Очистить"}
              type={"reset"}
              disabled={!circles.length || !!anim}
              style={{marginLeft: "auto"}}
              onClick={reset}
              data-cy={"clearButton"}
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
  )
}