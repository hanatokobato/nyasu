import axios from 'axios';
import React from 'react';
import Chart from './components/Chart';

const getData = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/learnings`);
  const learnings = res.data.learnings;
  return learnings;
};

const Review = async () => {
  const learnings = await getData();
  console.log(learnings);

  return (
    <div className="flex bg-slate-100 h-full">
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="flex justify-center flex-wrap mx-6 mt-2">
          <div className="w-6/12 mt-10">
            <Chart />
          </div>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Review;
