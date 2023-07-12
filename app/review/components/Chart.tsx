import React from 'react';

const Chart = () => {
  return (
    <div className="flex flex-wrap relative h-80">
      <div className="h-80 px-1 grow">
        <div className="h-80 rounded-t-2xl bg-red-400"></div>
      </div>
      <div className="h-80 px-1 grow">
        <div className="h-80 rounded-t-2xl bg-amber-400"></div>
      </div>
      <div className="h-80 px-1 grow">
        <div className="h-80 rounded-t-2xl bg-emerald-400"></div>
      </div>
      <div className="h-80 px-1 grow">
        <div className="h-80 rounded-t-2xl bg-sky-600"></div>
      </div>
      <div className="h-80 px-1 grow">
        <div className="h-80 rounded-t-2xl bg-purple-900"></div>
      </div>
      <div className="absolute -bottom-2 bg-gray-300 w-full h-2 rounded-lg"></div>
    </div>
  );
};

export default Chart;
