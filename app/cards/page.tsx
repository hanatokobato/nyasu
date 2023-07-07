'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Card from './components/Card';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { cloneDeep, lowerCase } from 'lodash';
import GameInput from '../components/inputs/TextInput';
import FillBlankInput from '../components/inputs/FillBlankInput';
import Answer from './components/Answer';

enum QuestionType {
  FREE_INPUT = 'FREE_INPUT',
  FILL_BLANK = 'FILL_BLANK',
}

interface ICardLearning extends ICard {
  currentQuestion?: QuestionType;
  currentAnswer?: boolean;
  correctCount: number;
}

const Cards = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck_id');
  const [cards, setCards] = useState<ICardLearning[]>([]);
  const [passedCards, setPassedCards] = useState<ICardLearning[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>();

  console.log(passedCards);

  const fetchCards = useCallback(
    async (page: number = 1, perPage: number = 10): Promise<ICard[]> => {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cards`,
        {
          params: {
            page,
            per_page: perPage,
            deck_id: deckId,
          },
        }
      );
      const fetchedCards = response.data.cards.map((card: any) => ({
        id: card._id,
        deckId: card.deck_id,
        content: card.content,
        audioUrl: card.audioUrl,
        fields: card.fields,
      }));
      setIsLoading(false);

      return fetchedCards;
    },
    [deckId]
  );

  const goNextHandler = useCallback(() => {
    const card = cards[0];
    if (!card) {
      console.log('completed!');
      return;
    }

    if (!card.currentQuestion) {
      setCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentQuestion = QuestionType.FREE_INPUT;
        currentCards[0].currentAnswer = undefined;
        return currentCards;
      });
    } else if (
      card.currentQuestion === QuestionType.FREE_INPUT &&
      card.currentAnswer === undefined
    ) {
      setCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentAnswer =
          lowerCase(currentAnswer) === lowerCase(card.fields.word);
        if (currentCards[0].currentAnswer) currentCards[0].correctCount += 1;
        return currentCards;
      });
    } else if (card.currentQuestion === QuestionType.FREE_INPUT) {
      setCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentQuestion = QuestionType.FILL_BLANK;
        currentCards[0].currentAnswer = undefined;
        return currentCards;
      });
    } else if (
      card.currentQuestion === QuestionType.FILL_BLANK &&
      card.currentAnswer === undefined
    ) {
      setCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentAnswer =
          lowerCase(currentAnswer) === lowerCase(card.fields.word);
        if (currentCards[0].currentAnswer) currentCards[0].correctCount += 1;
        return currentCards;
      });
    } else {
      setCards((curr) => {
        const currentCards = cloneDeep(curr);
        const firstCard = currentCards.shift() as ICardLearning;
        if (firstCard.correctCount >= 2) {
          setPassedCards((currPassed) => currPassed.concat(firstCard));
        } else {
          firstCard.correctCount = 0;
          firstCard.currentQuestion = undefined;
          firstCard.currentAnswer = undefined;
          currentCards.push(firstCard);
        }

        return currentCards;
      });
    }
  }, [cards, currentAnswer]);

  const initData = useCallback(async () => {
    const initCards = await fetchCards();
    const learningCards = initCards.map((card) => ({
      ...card,
      correctCount: 0,
    }));
    setCards(learningCards);
  }, [fetchCards]);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <div className="flex bg-slate-100 h-full">
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="flex justify-center flex-wrap mx-6 mt-2">
          <div className="w-6/12 mt-10">
            {cards.length > 0 && !cards[0].currentQuestion && (
              <Card card={cards[0]} />
            )}
            {cards.length > 0 &&
              cards[0].currentQuestion === QuestionType.FREE_INPUT && (
                <GameInput
                  placeholder="Gõ lại từ bạn đã nghe được"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCurrentAnswer(e.target.value)
                  }
                />
              )}
            {cards.length > 0 &&
              cards[0].currentQuestion === QuestionType.FILL_BLANK && (
                <FillBlankInput
                  numOfChars={cards[0].fields.word.length}
                  onChange={(val) => {
                    setCurrentAnswer(val.join(''));
                  }}
                />
              )}
          </div>
        </div>
        <div className="flex justify-center absolute w-full bottom-24">
          <button
            type="button"
            className="py-2 px-8 flex justify-center items-center  bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
            onClick={goNextHandler}
          >
            <div className="flex items-center justify-center">
              <span>TIẾP TỤC</span>
            </div>
          </button>
        </div>
        {cards.length > 0 && cards[0].currentAnswer !== undefined && (
          <Answer card={cards[0]} isCorrect={cards[0].currentAnswer} />
        )}
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Cards;
