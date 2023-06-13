import { ChangeEvent, useState } from 'react';

export function useForm<T>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name, type } = evt.target;
    setValues({...values, [name]: type === "number" ? Number(value) : value});
  }

  return {values, setValues, handleChange};
}