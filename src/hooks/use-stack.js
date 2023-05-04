import {useState} from "react";

export const useStack = () => {
  const [ array, setArray ] = useState([]);

  const push = (value) => {
    setArray(array.concat(value));
  };
  const pop = () => {
    setArray(array.slice(1));
  };

  return [array, push, pop];
}