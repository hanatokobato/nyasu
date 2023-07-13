import React from 'react';

const Review = async () => {
  return (
    <div className="flex bg-slate-100 h-full">
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="flex justify-center flex-wrap mx-6 mt-2">
          <div className="w-7/12 mt-20">Review</div>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Review;
