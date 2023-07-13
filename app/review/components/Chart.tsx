import { sum } from 'lodash';
import React from 'react';

const levels = ['level_1', 'level_2', 'level_3', 'level_4', 'level_5'] as const;

interface IProps {
  wordLevels: {
    [K in (typeof levels)[number]]: number;
  };
}

const Chart = ({ wordLevels }: IProps) => {
  const totalWords = sum(Object.values(wordLevels));
  const maxHeight = 320;
  const minHeight = 15;
  const heights = {
    level_1:
      (wordLevels.level_1 / totalWords) * 320 < minHeight
        ? minHeight
        : (wordLevels.level_1 / totalWords) * 320,
    level_2:
      (wordLevels.level_2 / totalWords) * 320 < minHeight
        ? minHeight
        : (wordLevels.level_2 / totalWords) * 320,
    level_3:
      (wordLevels.level_3 / totalWords) * 320 < minHeight
        ? minHeight
        : (wordLevels.level_3 / totalWords) * 320,
    level_4:
      (wordLevels.level_4 / totalWords) * 320 < minHeight
        ? minHeight
        : (wordLevels.level_4 / totalWords) * 320,
    level_5:
      (wordLevels.level_5 / totalWords) * 320 < minHeight
        ? minHeight
        : (wordLevels.level_5 / totalWords) * 320,
  };

  return (
    <div className="flex flex-wrap relative h-80">
      <div className="h-80 px-1 grow">
        <div
          className="h-80 rounded-t-2xl bg-red-400 relative"
          style={{
            height: heights.level_1,
            marginTop: maxHeight - heights.level_1,
          }}
        >
          <div className="absolute -top-7 text-center w-full">
            <span className="font-bold">{wordLevels.level_1} từ</span>
          </div>
          <div className="absolute -bottom-8 text-center w-full">
            <span className="font-bold">1</span>
          </div>
        </div>
      </div>
      <div className="h-80 px-1 grow">
        <div
          className="h-80 rounded-t-2xl bg-amber-400 relative"
          style={{
            height: heights.level_2,
            marginTop: maxHeight - heights.level_2,
          }}
        >
          <div className="absolute -top-7 text-center w-full">
            <span className="font-bold">{wordLevels.level_2} từ</span>
          </div>
          <div className="absolute -bottom-8 text-center w-full">
            <span className="font-bold">2</span>
          </div>
        </div>
      </div>
      <div className="h-80 px-1 grow">
        <div
          className="h-80 rounded-t-2xl bg-emerald-400 relative"
          style={{
            height: heights.level_3,
            marginTop: maxHeight - heights.level_3,
          }}
        >
          <div className="absolute -top-7 text-center w-full">
            <span className="font-bold">{wordLevels.level_3} từ</span>
          </div>
          <div className="absolute -bottom-8 text-center w-full">
            <span className="font-bold">3</span>
          </div>
        </div>
      </div>
      <div className="h-80 px-1 grow">
        <div
          className="h-80 rounded-t-2xl bg-sky-600 relative"
          style={{
            height: heights.level_4,
            marginTop: maxHeight - heights.level_4,
          }}
        >
          <div className="absolute -top-7 text-center w-full">
            <span className="font-bold">{wordLevels.level_4} từ</span>
          </div>
          <div className="absolute -bottom-8 text-center w-full">
            <span className="font-bold">4</span>
          </div>
        </div>
      </div>
      <div className="h-80 px-1 grow">
        <div
          className="h-80 rounded-t-2xl bg-purple-900 relative"
          style={{
            height: heights.level_5,
            marginTop: maxHeight - heights.level_5,
          }}
        >
          <div className="absolute -top-7 text-center w-full">
            <span className="font-bold">{wordLevels.level_5} từ</span>
          </div>
          <div className="absolute -bottom-8 text-center w-full">
            <span className="font-bold">5</span>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-2 bg-gray-300 w-full h-2 rounded-lg"></div>
    </div>
  );
};

export default Chart;
