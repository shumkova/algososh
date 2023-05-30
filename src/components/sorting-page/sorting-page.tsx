import React, {useCallback, useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Button} from "../ui/button/button";
import {RadioInput} from "../ui/radio-input/radio-input";
import styles from "./sorting-page.module.css";
import {Direction} from "../../types/direction";
import {Column} from "../ui/column/column";
import {MD_DELAY_IN_MS} from "../../constants/delays";
import { randomArr } from "../../utils";
import {getBubbleSortSteps, getColumnState, getSelectionSortSteps, TSortStep} from "./utils";
import {useForm} from "../../hooks/use-form";

enum SortingMethod {
  selection = "selection",
  bubble = "bubble"
}

export const SortingPage: React.FC = () => {
  const { values, handleChange } = useForm<{ method: SortingMethod }>({ method: SortingMethod.selection});
  const [ currentDirection, setCurrentDirection] = useState<Direction>(Direction.Ascending);
  const randomArray = useRef<number[]>(randomArr(3, 17));

  const intervalId = useRef<NodeJS.Timer>();
  const [ algorithmSteps, setAlgorithmSteps ] = useState<TSortStep[]>([{ currentArray: randomArray.current, sortedIndexes: []}]);
  const [ currentAlgorithmStep, setCurrentAlgorithmStep ] = useState<number>(0);

  const startSort = (direction: Direction) => {
    setCurrentDirection(direction);
    const steps = (values.method === SortingMethod.selection ? getSelectionSortSteps : getBubbleSortSteps)(randomArray.current, direction);
    setAlgorithmSteps(steps);
    setCurrentAlgorithmStep(0);

    intervalId.current = setInterval(() => {
      if (steps.length) {
        setCurrentAlgorithmStep((currentStep) => {
          const nextStep = currentStep + 1;

          if (nextStep >= steps.length - 1 && intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = undefined;
            randomArray.current = steps[steps.length - 1].currentArray;
            return currentStep;
          }

          return nextStep;
        })
      }
    }, MD_DELAY_IN_MS);
  }

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }
  }, []);

  const generateArr = useCallback(() => {
    randomArray.current = randomArr(3, 17);
    setAlgorithmSteps([{ currentArray: randomArray.current, sortedIndexes: []}]);
    setCurrentAlgorithmStep(0);
  }, []);

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
              disabled={!!intervalId.current} />
            <RadioInput
              label={"Пузырёк"}
              name={"method"}
              value={"bubble"}
              onChange={handleChange}
              extraClass={styles.radio}
              checked={values.method === SortingMethod.bubble}
              disabled={!!intervalId.current} />
            <Button
              text={"По возрастанию"}
              onClick={() => startSort(Direction.Ascending)}
              sorting={Direction.Ascending}
              isLoader={currentDirection === Direction.Ascending && !!intervalId.current}
              disabled={!!intervalId.current} />
            <Button
              text={"По убыванию"}
              onClick={() => startSort(Direction.Descending)}
              sorting={Direction.Descending}
              isLoader={currentDirection === Direction.Descending && !!intervalId.current}
              disabled={!!intervalId.current} />
            <Button
              text={"Новый массив"}
              onClick={generateArr}
              type={"reset"}
              style={{marginLeft: "auto"}}
              disabled={!!intervalId.current} />
          </div>
        </form>
        <div className="vis vis_columns">
          {
            algorithmSteps[currentAlgorithmStep].currentArray.map((item, index) => <Column
              index={item}
              state={getColumnState(index, algorithmSteps.length - 1, currentAlgorithmStep, algorithmSteps[currentAlgorithmStep])}
              key={`${item}${index}`} />
            )
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
