import React, { InputHTMLAttributes } from 'react';

const GameInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="bg-white rounded-2xl p-4">
      <input className="w-full border-0 outline-0" {...props} />
    </div>
  );
};

export default GameInput;
