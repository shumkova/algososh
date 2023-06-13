import React, {FormEventHandler, useCallback, useState, useRef, useEffect} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { DELAY_IN_MS } from "../../constants/delays";
import styles from "./fibonacci-page.module.css";
import { clearInput } from "../../utils";
import { useForm } from "../../hooks/use-form";
import { getFibonacciNumbers } from "./utils";

export const FibonacciPage: React.FC = () => {
  const { values, setValues, handleChange } = useForm<{ fibLength: number }>({ fibLength: 0 });
  const fibonacciNumbers = useRef<number[]>([]);
  const intervalId = useRef<NodeJS.Timer>();
  const [ currentAlgorithmStep, setCurrentAlgorithmStep ] = useState<number>(-1);

  const startAlgorithm = useCallback(() => {
    fibonacciNumbers.current = getFibonacciNumbers(values.fibLength);
    setCurrentAlgorithmStep(0);

    intervalId.current = setInterval(() => {
      if (values.fibLength > 0) {
        setCurrentAlgorithmStep((currentStep) => {
          const nextStep = currentStep + 1;

          if (nextStep >= values.fibLength && intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = undefined;

            const input = document.querySelector<HTMLInputElement>("input");
            if (input) {
              clearInput(input);
            }
            setValues({ fibLength: 0 });
          }

          return nextStep;
        })
      }
    }, DELAY_IN_MS);
  }, [values.fibLength, setValues]);

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }
  }, []);

  const onSubmit: FormEventHandler = (evt) => {
    evt.preventDefault();
    startAlgorithm();
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className="container">
        <form action="#" onSubmit={onSubmit}>
          <div className="condition">
            <Input type={'number'} isLimitText={true} onChange={handleChange} name={'fibLength'} disabled={!!intervalId.current} min={0} max={19} />
            <Button text={'Развернуть'} type={'submit'} disabled={values.fibLength <= 0 || values.fibLength > 19} isLoader={!!intervalId.current}/>
          </div>
        </form>
        <div className="vis">
          {
            fibonacciNumbers.current.map((item, index) => index <= currentAlgorithmStep ? <Circle letter={item.toString()} index={index} key={`${item}${index}`} extraClass={styles.fibAnim}/> : null)
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
