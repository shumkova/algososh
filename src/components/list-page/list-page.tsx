import React, {useCallback, useEffect, useMemo, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import styles from "./list-page.module.css";
import {Button} from "../ui/button/button";
import {useForm} from "../../hooks/use-form";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {clearInput, pause, randomArr} from "../../utils";
import {LinkedList} from "./linked-list";
import {TCircle} from "../../types/circle";

type TListCircle = TCircle & {
  head: string | React.ReactElement | null;
  tail: string | React.ReactElement | null;
}

enum Anim {
  addHead = "addHead",
  addTail = "addTail",
  removeHead = "removeHead",
  removeTail = "removeTail",
  addIndex = "addIndex",
  removeIndex = "removeIndex"
}

export const ListPage: React.FC = () => {
  const { values, setValues, handleChange } = useForm<{value: string; position: number}>({value: "", position: -1});
  const [ circles, setCircles ] = useState<TListCircle[]>([]);
  const [ anim, setAnim ] = useState<Anim | null>(null);

  const linkedList = useMemo(() => new LinkedList(randomArr(1,6).map(item => item.toString())), []);

  const createDefaultCircles = useCallback((arr: string[]) => {
    if (!arr.length) {
      return []
    }
    return arr.map((item, index) => ({ value: item,  head: index === 0 ? "head" : null, tail: arr[index + 1] ? null : "tail", state: ElementStates.Default }))
  }, []);

  const clearInputs = useCallback(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>("input");
    if (inputs.length) {
      inputs.forEach(input => {
        clearInput(input);
      })
      setValues({value: "", position: -1});
    }
  }, [setValues]);

  const endAnim = useCallback((arr: string[]) => {
    setCircles(createDefaultCircles(arr));
    clearInputs();
    setAnim(null);
  }, [createDefaultCircles, clearInputs]);

  useEffect(() => {
    setCircles(createDefaultCircles(linkedList.toArray()));
  }, [linkedList, createDefaultCircles]);

  const addHead = useCallback(async () => {
    setAnim(Anim.addHead);
    setCircles(circles.slice().map((item, index) => index === 0 ? {...item, head: (<Circle isSmall={true} letter={values.value} state={ElementStates.Changing}/>) } : item));
    linkedList.addByIndex(values.value, 0);
    const arr = linkedList.toArray();
    await pause(SHORT_DELAY_IN_MS);
    setCircles(arr.map((item, index) => ({ value: item,  head: index === 0 ? "head" : null, tail: arr[index + 1] ? null : "tail", state: index === 0 ? ElementStates.Modified : ElementStates.Default })));
    await pause(SHORT_DELAY_IN_MS);
    endAnim(arr);
  }, [circles, values, linkedList, endAnim]);

  const addTail = useCallback(async () => {
    setAnim(Anim.addTail);
    setCircles(circles.slice().map((item, index) => index === circles.length - 1 ? {...item, head: (<Circle isSmall={true} letter={values.value} state={ElementStates.Changing}/>) } : item));
    linkedList.append(values.value);
    const arr = linkedList.toArray();
    await pause(SHORT_DELAY_IN_MS);
    setCircles(arr.map((item, index) => ({ value: item,  head: index === 0 ? "head" : null, tail: arr[index + 1] ? null : "tail", state: arr[index + 1] ? ElementStates.Default : ElementStates.Modified })));
    await pause(SHORT_DELAY_IN_MS);
    endAnim(arr);
  }, [circles, linkedList, values.value, endAnim]);

  const removeHead = useCallback(async () => {
    setAnim(Anim.removeHead);
    setCircles(circles.slice().map((item, index) => index === 0 ? {...item, value: "", tail: (<Circle isSmall={true} letter={item.value} state={ElementStates.Changing}/>) } : item));
    linkedList.deleteHead();
    await pause(SHORT_DELAY_IN_MS);
    const arr = linkedList.toArray();
    endAnim(arr);
  }, [circles, linkedList, endAnim]);

  const removeTail = useCallback(async () => {
    setAnim(Anim.removeTail);
    const tail = linkedList.getSize() - 1;
    setCircles(circles.slice().map((item, index) => index === tail ? {...item, value: "", tail: (<Circle isSmall={true} letter={item.value} state={ElementStates.Changing}/>) } : item));
    linkedList.deleteTail();
    await pause(SHORT_DELAY_IN_MS);
    const arr = linkedList.toArray();
    endAnim(arr);
  }, [circles, linkedList, endAnim]);

  const addByIndex = useCallback(async () => {
    setAnim(Anim.addIndex);
    const { value, position } = values;
    if (value.length === 0 || position < 0) {
      return;
    }

    for (let i = 0; i <= position; i++) {
      await pause();
      setCircles(circles.slice().map((item, elemInd) => elemInd === i ? {...item, head: (<Circle isSmall={true} letter={value} state={ElementStates.Changing}/>) }
        : elemInd < i ?
          {...item, state: ElementStates.Changing }
          : item));
    }

    await pause();
    linkedList.addByIndex(value, position);
    const arr = linkedList.toArray();
    setCircles(arr.map((item, index) => ({ value: item,  head: index === 0 ? "head" : null, tail: arr[index + 1] ? null : "tail", state: index === position ? ElementStates.Modified : ElementStates.Default })));
    await pause();
    endAnim(arr);
  }, [circles, values, linkedList, endAnim]);

  const removeByIndex = useCallback(async () => {
    setAnim(Anim.removeIndex);
    const { position } = values;
    if (position < 0) {
      return;
    }
    for (let i = 0; i <= position; i++) {
      await pause();
      setCircles(circles.slice().map((item, elemInd) => elemInd <= i ? {...item, state: ElementStates.Changing } : item));
    }
    await pause();
    setCircles(circles.slice().map((item, elemInd) => elemInd === position ? {...item, value: "", tail: (<Circle isSmall={true} letter={item.value} state={ElementStates.Changing}/>) }
      : elemInd < position ?
        {...item, state: ElementStates.Changing }
        : item));
    await pause();
    linkedList.deleteByIndex(position);
    const arr = linkedList.toArray();
    endAnim(arr);
  }, [circles, values, linkedList, endAnim]);

  return (
    <SolutionLayout title="Связный список">
      <div className="container">
        <form action="#" onSubmit={evt => evt.preventDefault()}>
          <div className={`condition ${styles.condition}`}>
            <Input
              maxLength={4}
              isLimitText={true}
              onChange={handleChange}
              name={"value"}
              extraClass={styles.input}
              placeholder={"Введите значение"}
              disabled={!!anim}
            />
            <Button
              text={"Добавить в head"}
              disabled={!values.value.length || (!!anim && anim !==Anim.addHead)}
              extraClass={styles.button}
              onClick={addHead}
              isLoader={anim === Anim.addHead}
            />
            <Button
              text={"Добавить в tail"}
              disabled={!values.value.length || (!!anim && anim !==Anim.addTail)}
              extraClass={styles.button}
              onClick={addTail}
              isLoader={anim === Anim.addTail}
            />
            <Button
              text={"Удалить из head"}
              disabled={!linkedList.getSize() || (!!anim && anim !==Anim.removeHead)}
              extraClass={styles.button}
              onClick={removeHead}
              isLoader={anim === Anim.removeHead}
            />
            <Button
              text={"Удалить из tail"}
              disabled={!linkedList.getSize() || (!!anim && anim !==Anim.removeTail)}
              style={{marginLeft: "auto"}}
              extraClass={styles.button}
              onClick={removeTail}
              isLoader={anim === Anim.removeTail}
            />
          </div>
          <div className={`condition ${styles.condition}`}>
            <Input
              onChange={handleChange}
              name={"position"}
              extraClass={styles.input}
              type={"number"}
              placeholder={"Введите индекс"}
              min={0}
              max={linkedList.getSize() > 0 ? linkedList.getSize() - 1 : 0}
              isLimitText={true}
              disabled={!!anim}
            />
            <Button
              text={"Добавить по индексу"}
              type={"submit"}
              extraClass={styles.button}
              disabled={!values.value || values.position < 0 || values.position >= linkedList.getSize() || (!!anim && anim !==Anim.addIndex)}
              onClick={addByIndex}
              isLoader={anim === Anim.addIndex}
            />
            <Button
              text={"Удалить по индексу"}
              extraClass={styles.button}
              disabled={!linkedList.getSize() || values.position < 0 || values.position >= linkedList.getSize() || (!!anim && anim !==Anim.removeIndex)}
              isLoader={anim === Anim.removeIndex}
              onClick={removeByIndex}
            />
          </div>
        </form>
        <div className="vis vis_page_list" style={{minHeight: 150}}>
          {
            circles.map((item, index) => {
              return (
                <li className={"vis__item"} key={`${item}${index}`}>
                  <Circle
                    letter={item.value}
                    state={item.state}
                    head={item.head}
                    tail={item.tail}
                    index={index}
                  />
                  {
                    index !== (circles.length - 1) && <svg className={`vis__arrow vis__arrow_state_${item.state}`} width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L9.41421 8L1.70711 15.7071C1.31658 16.0976 0.683417 16.0976 0.292893 15.7071C-0.0976311 15.3166 -0.0976311 14.6834 0.292893 14.2929L6.58579 8L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" fill="currentColor"/>
                    </svg>
                  }
                </li>
              )
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
