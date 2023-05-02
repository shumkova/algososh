import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Button} from "../ui/button/button";
import {RadioInput} from "../ui/radio-input/radio-input";
import styles from "./sorting-page.module.css";
import {Direction} from "../../types/direction";
import {Column} from "../ui/column/column";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {pause, randomArr} from "../../utils";

type TColumns = {
  value: number;
  state?: ElementStates;
}

enum SortingMethod {
  selection = "selection",
  bubble = "bubble"
}

const swap = (arr: TColumns[], firstIndex: number, secondIndex: number): void => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

export const SortingPage: React.FC = () => {
  const [ method, setMethod ] = useState<SortingMethod>(SortingMethod.selection);
  const [ sorting, setSorting ] = useState(false);
  const [ direction, setDirection] = useState<Direction>(Direction.Ascending);
  const [ columns, setColumns ] = useState<TColumns[]>([]);

  const selectionSort = useCallback(async (arr: TColumns[], direction: Direction) => {
    const { length } = arr;
    for (let i = 0; i < length - 1; i++) {
      let ind = i;
      arr[i].state = ElementStates.Changing;

      for (let k = i + 1; k < length - 1; k++) {
        arr[k].state = ElementStates.Changing;
        setColumns([...arr]);

        if ((direction === Direction.Ascending && arr[k].value < arr[ind].value) ||
          (direction === Direction.Descending && arr[k].value > arr[ind].value)) {
          arr[ind].state = ind === i ? ElementStates.Changing : ElementStates.Default;
          ind = k;
        }

        await pause(SHORT_DELAY_IN_MS);

        arr[k].state = ElementStates.Default;
        arr[ind].state = ElementStates.Temporary;
        setColumns([...arr]);
      }

      if (ind !== i) {
        swap(arr, i, ind);
        arr[ind].state = ElementStates.Default;
      }

      arr[i].state = ElementStates.Modified;

      setColumns([...arr]);
      await pause(SHORT_DELAY_IN_MS);
    }

    arr[length - 1].state = ElementStates.Modified;
    setColumns([...arr]);
  }, [setColumns]);

  const bubbleSort = useCallback(async (arr: TColumns[], direction: Direction) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < (arr.length - i - 1); j++) {
        arr[j].state = ElementStates.Changing;
        arr[j+1].state = ElementStates.Changing;
        setColumns([...arr]);

        if ((direction === Direction.Descending && arr[j].value < arr[j + 1].value) ||
        (direction === Direction.Ascending && arr[j].value > arr[j + 1].value)) {
          swap(arr, j, j + 1);
        }

        await pause(SHORT_DELAY_IN_MS);
        arr[j].state = ElementStates.Default;
        arr[j+1].state = ElementStates.Default;
        setColumns([...arr]);
      }
      arr[arr.length - i - 1].state = ElementStates.Modified;
      setColumns([...arr]);
    }
  }, []);

  const startSort = useCallback((direction: Direction) => {
    let arr = columns;
    if (columns.length && columns[0].state !== ElementStates.Default) {
      arr = columns.map(item => ({...item, state: ElementStates.Default}))
    }

    setDirection(direction);
    setSorting(true);

    if (method === SortingMethod.selection) {
      selectionSort(arr, direction).then(() => setSorting(false));
    } else {
      bubbleSort(arr, direction).then(() => setSorting(false));
    }
  }, [setDirection, setSorting, selectionSort, columns, method]);

  const generateArr = useCallback(() => {
    setColumns(randomArr(3, 17).map(item => ({value: item, state: ElementStates.Default})));
  }, []);

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setMethod(evt.target.value as SortingMethod);
  }

  useEffect(() => {
    generateArr();
  }, [generateArr]);

  return (
    <SolutionLayout title="Сортировка массива">
      <div className="container">
        <form action="#">
          <div className="condition condition_radio">
            <RadioInput
              label={"Выбор"}
              name={"method"}
              value={"selection"}
              onChange={onChange}
              extraClass={styles.radio}
              checked={method === SortingMethod.selection}
              disabled={sorting} />
            <RadioInput
              label={"Пузырёк"}
              name={"method"}
              value={"bubble"}
              onChange={onChange}
              extraClass={styles.radio}
              checked={method === SortingMethod.bubble}
              disabled={sorting} />
            <Button
              text={"По возрастанию"}
              onClick={() => startSort(Direction.Ascending)}
              sorting={Direction.Ascending}
              isLoader={direction === Direction.Ascending && sorting}
              disabled={sorting} />
            <Button
              text={"По убыванию"}
              onClick={() => startSort(Direction.Descending)}
              sorting={Direction.Descending}
              isLoader={direction === Direction.Descending && sorting}
              disabled={sorting} />
            <Button
              text={"Новый массив"}
              onClick={generateArr}
              type={"reset"}
              style={{marginLeft: "auto"}}
              disabled={sorting} />
          </div>
        </form>
        <div className="vis vis_columns">
          {
            columns.map(({value, state}, index) => <Column index={value} state={state} key={`${value}${index}`} />)
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
