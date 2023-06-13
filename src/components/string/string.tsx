import React, { FormEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/use-form";
import { getReversingStringSteps, getLetterState } from "./utils";

export const StringComponent: React.FC = () => {
  const { values, setValues, handleChange } = useForm<{ str: string }>({ str: "" });
  const [ algorithmSteps, setAlgorithmSteps ] = useState<string[][]>([]);
  const [ currentStep, setCurrentStep ] = useState(-1);
  const intervalId = useRef<NodeJS.Timer>();

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    }
  }, []);

  const startAnimation: FormEventHandler = useCallback((evt) => {
    evt.preventDefault();
    const steps = getReversingStringSteps(values.str);
    setAlgorithmSteps(steps);
    setCurrentStep(0);

    intervalId.current = setInterval(() => {
      if (steps.length) {
        setCurrentStep((currentStep) => {
          const nextStep = currentStep + 1;

          if (nextStep >= steps.length - 1 && intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = undefined;
          }

          return nextStep;
        })
      }
    }, DELAY_IN_MS);

    setTimeout(() => {
      setValues({ str: "" });
    }, DELAY_IN_MS * (steps.length - 1));
  }, [setValues, values]);

  return (
    <SolutionLayout title="Строка">
      <div className="container">
        <form action="#" onSubmit={startAnimation}>
          <div className="condition">
            <Input maxLength={11} isLimitText onChange={handleChange} name={"str"} disabled={!!intervalId.current} value={values.str}/>
            <Button text={"Развернуть"} type={"submit"} disabled={values.str.length === 0} isLoader={!!intervalId.current}/>
          </div>
        </form>
        <div className="vis">
          {
            algorithmSteps.length > 0 &&
            algorithmSteps[currentStep].map((item, index) => <Circle letter={item} state={getLetterState(index, algorithmSteps[currentStep].length - 1, currentStep, currentStep === algorithmSteps[currentStep].length)} key={`${index}${item}`}/>)
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
