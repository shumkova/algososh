import React, { ChangeEvent, FormEventHandler, useCallback, useMemo, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./fibonacci-page.module.css";

export const FibonacciPage: React.FC = () => {
  const [ inputNumber, setInputNumber ] = useState<number | null>(null);
  const [ calculating, setCalculating ] = useState(false);
  const [ circles, setCircles ] = useState<number[]>([]);

  const isValid = useMemo(() => (inputNumber && inputNumber >= 0 && inputNumber <= 19), [inputNumber]);

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputNumber(Number(evt.target.value));
  }

  const pushToCircles = useCallback((arr: number[]): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setCircles([...arr]);
        resolve(true);
      }, SHORT_DELAY_IN_MS);
    })
  }, [setCircles]);

  const fib = useCallback(async (n:number) => {
    let arr: number[] = [];

    for (let i = 0; i <= n; i++) {
      if (i < 2) {
        arr.push(i);
      } else {
        arr.push(arr[i - 2] + arr[i - 1]);
      }

      await pushToCircles(arr);
    }
  }, [pushToCircles]);

  const onSubmit: FormEventHandler = (evt) => {
    evt.preventDefault();

    if (inputNumber && isValid) {
      setCalculating(true);
      fib(inputNumber).then(() => setCalculating(false));
    }
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className="container">
        <form action="#" onSubmit={onSubmit}>
          <div className="condition">
            <Input type={'number'} isLimitText={true} onChange={onChange} name={'number'} disabled={calculating} min={0} max={19} />
            <Button text={'Развернуть'} type={'submit'} name={'string'} disabled={!isValid} isLoader={calculating}/>
          </div>
        </form>
        <div className="vis">
          {
            circles.map((item, index) => <Circle letter={item.toString()} index={index} key={`${item}${index}`} extraClass={styles.fibAnim}/>)
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
