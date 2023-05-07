import React, {FormEventHandler, useCallback, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {DELAY_IN_MS} from "../../constants/delays";
import {TCircle} from "../../types/circle";
import {clearInput, pause} from "../../utils";
import {useForm} from "../../hooks/use-form";

export const StringComponent: React.FC = () => {
  const { values, setValues, handleChange } = useForm<{ str: string }>({str: ""});
  const [ reversing, setReversing ] = useState(false);
  const [ circles, setCircles ] = useState<TCircle[]>([]);

  const reverseArr = useCallback(async (arr: TCircle[]) => {
    let start = 0;
    let end = arr.length - 1;

    while (start < end) {
      arr[start].state = ElementStates.Changing;
      arr[end].state = ElementStates.Changing;

      setCircles([...arr]);

      const temp = arr[start];
      arr[start] = arr[end];
      arr[end] = temp;

      arr[start].state = ElementStates.Modified;
      arr[end].state = ElementStates.Modified;

      await pause();
      setCircles([...arr]);

      start++;
      end--;
    }

    if (arr.length % 2) {
      const center = Math.floor(arr.length / 2);
      arr[center].state = ElementStates.Modified;
      setCircles([...arr]);
    }

    if (arr.length === 1) {
      setCircles([{value: arr[0].value, state: ElementStates.Modified}]);
    }
  }, []);

  const startAnimation: FormEventHandler = (evt) => {
    evt.preventDefault();
    setReversing(true);
    const stringArr = values.str.split('');
    const newCircles = stringArr.map(item => ({value: item, state: ElementStates.Default}));
    setCircles(newCircles);
    setTimeout(() => {reverseArr(newCircles).then(() => {
      const input = document.querySelector<HTMLInputElement>("input");
      if (input) {
        clearInput(input);
      }
      setValues({str: ""});
      setReversing(false);
    })}, DELAY_IN_MS);
  };

  return (
    <SolutionLayout title="Строка">
      <div className="container">
        <form action="#" onSubmit={startAnimation}>
          <div className="condition">
            <Input maxLength={11} isLimitText={true} onChange={handleChange} name={'str'} disabled={reversing}/>
            <Button text={'Развернуть'} type={'submit'} disabled={!values.str.length} isLoader={reversing}/>
          </div>
        </form>
        <div className="vis">
          {
            circles.length > 0 &&
            circles.map((item, index) => <Circle letter={item.value} state={item.state} key={index}/>)
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
