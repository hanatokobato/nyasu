import React, { HTMLProps } from 'react';

const LearnButton = (props: HTMLProps<HTMLButtonElement>) => {
  return (
    <div className={`relative h-12 bg-lime-700 rounded-full mx-auto ${props.className}`}>
      <button className="absolute -top-1.5 left-0 h-12 text-white bg-lime-500 rounded-full px-10 w-full text-xl active:top-0">
        {props.children}
      </button>
    </div>
  );
};

export default LearnButton;
