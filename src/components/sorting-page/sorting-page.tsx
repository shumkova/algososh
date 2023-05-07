import React, {useCallback, useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Button} from "../ui/button/button";
import {RadioInput} from "../ui/radio-input/radio-input";
import styles from "./sorting-page.module.css";
import {Direction} from "../../types/direction";
import {Column} from "../ui/column/column";
import {ElementStates} from "../../types/element-states";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";
import {pause, randomArr} from "../../utils";
import {swap} from "./utils";
import {useForm} from "../../hooks/use-form";

type TColumn = {
  value: number;
  state?: ElementStates;
}

enum SortingMethod {
  selection = "selection",
  bubble = "bubble"
}

export const SortingPage: React.FC = () => {
  const { values, handleChange } = useForm<{method: SortingMethod}>({ method: SortingMethod.selection});
  const [ sorting, setSorting ] = useState(false);
  const [ direction, setDirection] = useState<Direction>(Direction.Ascending);
  const [ columns, setColumns ] = useState<TColumn[]>([]);

  const selectionSort = useCallback(async (arr: TColumn[], direction: Direction) => {
    const { length } = arr;
    for (let i = 0; i < length - 1; i++) {
      let ind = i;
      arr[i].state = ElementStates.Changing;

      for (let k = i + 1; k < length; k++) {
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
  }, []);

  const bubbleSort = useCallback(async (arr: TColumn[], direction: Direction) => {
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

    if (values.method === SortingMethod.selection) {
      selectionSort(arr, direction).then(() => setSorting(false));
    } else {
      bubbleSort(arr, direction).then(() => setSorting(false));
    }
  }, [selectionSort, columns, values.method, bubbleSort]);

  const generateArr = useCallback(() => {
    setColumns(randomArr(3, 17).map(item => ({value: item, state: ElementStates.Default})));
  }, []);

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
              onChange={handleChange}
              extraClass={styles.radio}
              checked={values.method === SortingMethod.selection}
              disabled={sorting} />
            <RadioInput
              label={"Пузырёк"}
              name={"method"}
              value={"bubble"}
              onChange={handleChange}
              extraClass={styles.radio}
              checked={values.method === SortingMethod.bubble}
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
