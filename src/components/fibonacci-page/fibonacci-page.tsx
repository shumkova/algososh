import React, { FormEventHandler, useCallback, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./fibonacci-page.module.css";
import {clearInput, pause} from "../../utils";
import {useForm} from "../../hooks/use-form";

export const FibonacciPage: React.FC = () => {
  const { values, setValues, handleChange } = useForm<{ fibLength: string }>({ fibLength: "" });
  const [ calculating, setCalculating ] = useState(false);
  const [ circles, setCircles ] = useState<number[]>([]);

  const fib = useCallback(async (n:number) => {
    let arr: number[] = [];

    for (let i = 0; i <= n; i++) {
      if (i < 2) {
        arr.push(i);
      } else {
        arr.push(arr[i - 2] + arr[i - 1]);
      }

      await pause(SHORT_DELAY_IN_MS);
      setCircles([...arr]);
    }
  }, []);

  const onSubmit: FormEventHandler = (evt) => {
    evt.preventDefault();
    const { fibLength } = values;
    if (fibLength.length > 0) {
      setCalculating(true);
      fib(Number(fibLength)).then(() => {
        const input = document.querySelector<HTMLInputElement>("input");
        if (input) {
          clearInput(input);
        }
        setValues({fibLength: ""});
        setCalculating(false);
      });
    }
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className="container">
        <form action="#" onSubmit={onSubmit}>
          <div className="condition">
            <Input type={'number'} isLimitText={true} onChange={handleChange} name={'fibLength'} disabled={calculating} min={0} max={19} />
            <Button text={'Развернуть'} type={'submit'} disabled={!values.fibLength.length} isLoader={calculating}/>
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
