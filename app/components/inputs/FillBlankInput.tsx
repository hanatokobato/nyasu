import React, { useCallback, useEffect } from 'react';
import styles from './FillBlankInput.module.scss';
import { useForm } from 'react-hook-form';

interface IProps {
  numOfChars: number;
  onChange?: (val: string[]) => void;
  onSubmit?: any;
}

const FillBlankInput = ({ numOfChars, onChange, onSubmit }: IProps) => {
  const { register, getValues, setFocus, setValue } = useForm();

  const inputChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        setFocus(`character-${Number(e.target.name.split('-')[1]) + 1}`);
        setValue(e.target.name, e.target.value);
      } else {
        setValue(e.target.name, '');
      }
      const values = getValues();
      if (onChange) onChange(Object.values(values));
    },
    [getValues, onChange, setFocus, setValue]
  );

  const keyDownHandler = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      if (!target.value && e.key === 'Backspace') {
        setFocus(`character-${Number(target.name.split('-')[1]) - 1}`);
        setValue(`character-${Number(target.name.split('-')[1]) - 1}`, '');
        const values = getValues();
        if (onChange) onChange(Object.values(values));
      }

      if (e.key === 'Enter') {
        onSubmit();
      }
    },
    [setFocus, setValue, getValues, onChange, onSubmit]
  );

  return (
    <div className={styles['box-answer']}>
      <div className={styles['list-answer']}>
        <form>
          <div className="inline-block">
            {Array.from(Array(numOfChars).keys()).map((i) => (
              <input
                key={`input-${i}`}
                {...register(`character-${i}`)}
                className={styles.inputs}
                maxLength={1}
                onChange={inputChangeHandler}
                onKeyDown={keyDownHandler}
                autoFocus={i === 0}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FillBlankInput;
