'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Card from './components/Card';
import { useSearchParams } from 'next/navigation';
import { cloneDeep, lowerCase } from 'lodash';
import GameInput from '../../components/inputs/TextInput';
import FillBlankInput from '../../components/inputs/FillBlankInput';
import Answer from './components/Answer';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import LearnButton from '../../components/buttons/Button';
import { useCards } from '@/hooks/cards/useCards';
import { Card as ICard } from '@/types/api';
import { useLearnings } from '@/hooks/learnings/useLearnings';

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck_id') || undefined;
  const [passedCards, setPassedCards] = useState<ICardLearning[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>();
  const { learningCards: cards, loadLearningCards } = useCards();
  const [learningCards, setLearingCards] = useState<ICardLearning[]>([]);
  const { postLearning } = useLearnings();

  const goNextHandler = useCallback(async () => {
    const card = learningCards[0];
    if (!card) {
      return;
    }

    if (!card.currentQuestion) {
      setLearingCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentQuestion = QuestionType.FREE_INPUT;
        currentCards[0].currentAnswer = undefined;
        return currentCards;
      });
    } else if (
      card.currentQuestion === QuestionType.FREE_INPUT &&
      card.currentAnswer === undefined
    ) {
      setLearingCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentAnswer =
          lowerCase(currentAnswer) === lowerCase(card.fields?.word);
        if (currentCards[0].currentAnswer) currentCards[0].correctCount += 1;
        return currentCards;
      });
    } else if (card.currentQuestion === QuestionType.FREE_INPUT) {
      setLearingCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentQuestion = QuestionType.FILL_BLANK;
        currentCards[0].currentAnswer = undefined;
        return currentCards;
      });
    } else if (
      card.currentQuestion === QuestionType.FILL_BLANK &&
      card.currentAnswer === undefined
    ) {
      setLearingCards((curr) => {
        const currentCards = cloneDeep(curr);
        currentCards[0].currentAnswer =
          lowerCase(currentAnswer) === lowerCase(card.fields?.word);
        if (currentCards[0].currentAnswer) currentCards[0].correctCount += 1;
        return currentCards;
      });
    } else {
      setLearingCards((curr) => {
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
  }, [learningCards, currentAnswer]);

  const initData = useCallback(async () => {
    setIsLoading(true);
    await loadLearningCards(deckId!);
    setIsLoading(false);
  }, [loadLearningCards, deckId]);

  // The hook's list changes once per fetch; seed the working queue from it.
  useEffect(() => {
    setLearingCards(cards.map((card) => ({ ...card, correctCount: 0 })));
  }, [cards]);

  useEffect(() => {
    if (learningCards[0]?.audioUrl) {
      new Audio(learningCards[0].audioUrl).play();
    }
  }, [learningCards, learningCards[0]?.currentQuestion]);

  useEffect(() => {
    initData();
  }, [initData]);

  useEffect(() => {
    const addLearning = async () => {
      try {
        await postLearning({ deckId, cardIds: passedCards.map((c) => c.id) });

        router.push('/');
      } catch (e: any) {
        toast(e.message, { type: 'error' });
      }
    };

    if (learningCards.length === 0 && passedCards.length > 0) {
      addLearning();
    }
  }, [learningCards, passedCards, router, deckId, postLearning]);

  return (
    <div className="flex bg-slate-100 min-h-full-minus-header">
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="flex justify-center flex-wrap mx-6 mt-2">
          <div className="w-6/12 mt-10">
            {learningCards.length > 0 && !learningCards[0].currentQuestion && (
              <Card card={learningCards[0]} />
            )}
            {learningCards.length > 0 &&
              learningCards[0].currentQuestion === QuestionType.FREE_INPUT && (
                <GameInput
                  placeholder="Gõ lại từ bạn đã nghe được"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCurrentAnswer(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      goNextHandler();
                    }
                  }}
                  autoFocus
                />
              )}
            {learningCards.length > 0 &&
              learningCards[0].currentQuestion === QuestionType.FILL_BLANK && (
                <FillBlankInput
                  numOfChars={learningCards[0].fields.word.length}
                  onChange={(val) => {
                    setCurrentAnswer(val.join(''));
                  }}
                  onSubmit={goNextHandler}
                />
              )}
          </div>
        </div>
        <div className="flex justify-center absolute w-full bottom-24">
          <LearnButton className="w-60" onClick={goNextHandler}>
            TIẾP TỤC
          </LearnButton>
        </div>
        {learningCards.length > 0 &&
          learningCards[0].currentAnswer !== undefined && (
            <div className="mt-20">
              <Answer
                card={learningCards[0]}
                isCorrect={learningCards[0].currentAnswer}
              />
            </div>
          )}
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Cards;
