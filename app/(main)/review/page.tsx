'use client';

import { cloneDeep, isEmpty, sample, set, uniqBy } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  useRef,
} from 'react';
import Question from './components/Question';
import SelectAnswer from './components/SelectAnswer';
import LearnButton from '../../components/buttons/Button';
import Answer from '../cards/components/Answer';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import GameInput from '@/app/components/inputs/TextInput';
import FillBlankInput from '@/app/components/inputs/FillBlankInput';
import { Card as ICard } from '@/types/api';
import { useLearnings } from '@/hooks/learnings/useLearnings';

interface IPassedCard {
  id: string;
  attemptCount: number;
}

interface IReviewReviewing extends ICard {
  attemptCount: number;
}

const Review = () => {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [answerText, setAnswerText] = useState<string>();
  const [passedCards, setPassedCards] = useState<IPassedCard[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const submitBtnRef = useRef<HTMLDivElement>(null);
  const {
    reviews: reviewCards,
    randomCards,
    loadReviews,
    loadRandomCards,
    updateLearnings,
  } = useLearnings();
  const [reviews, setReviews] = useState<IReviewReviewing[]>([]);

  const selectAnswerHandler = useCallback((selected: string | null) => {
    if (selected) setSelectedAnswer(selected);
  }, []);

  const checkAnswerHandler = useCallback(() => {
    if (selectedAnswer && !isSubmitted) {
      setIsSubmitted(true);
    }
    if (selectedAnswer && isSubmitted) {
      setReviews((curr) => {
        const currentReviews = cloneDeep(curr);
        const firstReview = currentReviews.shift() as IReviewReviewing;
        firstReview.attemptCount = (firstReview.attemptCount ?? 0) + 1;
        if (firstReview.id === selectedAnswer) {
          setPassedCards((currPassed) =>
            currPassed.concat({
              id: firstReview.id,
              attemptCount: firstReview.attemptCount,
            })
          );
        } else {
          currentReviews.push(firstReview);
        }

        return currentReviews;
      });
      setSelectedAnswer(undefined);
      setAnswerText('');
      setIsSubmitted(false);
    }
  }, [selectedAnswer, isSubmitted]);

  const quizType = useMemo(() => {
    if (reviews.length > 0) {
      return sample([
        'translate',
        'fillblank',
        'freeinput',
        'fillinput',
      ]) as string;
    }
  }, [reviews]);

  const storeLearnings = useCallback(async () => {
    try {
      await updateLearnings({
        passedCards: passedCards
          .filter((card) => card.attemptCount === 1)
          .map((card) => card.id),
        failedCards: passedCards
          .filter((card) => card.attemptCount > 1)
          .map((card) => card.id)
          .concat(reviews.map((card) => card.id)),
      });

      router.prefetch('/');
      router.push('/');
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, [passedCards, reviews, router, updateLearnings]);

  useEffect(() => {
    if (isSubmitted) {
      submitBtnRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSubmitted]);

  useEffect(() => {
    loadReviews();
    loadRandomCards();
  }, [loadReviews, loadRandomCards]);

  // The hook's list changes once per fetch; seed the working queue from it.
  useEffect(() => {
    setReviews(reviewCards.map((card) => ({ ...card, attemptCount: 0 })));
  }, [reviewCards]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      loadRandomCards();
    }
  }, [reviews, loadRandomCards]);

  useEffect(() => {
    if (
      (reviews.length === 0 && passedCards.length > 0) ||
      reviews.some((r) => r.attemptCount > 3)
    ) {
      storeLearnings();
    }
  }, [storeLearnings, passedCards.length, reviews]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // storeLearnings navigates home itself once the save has finished.
      if (passedCards.length > 0) {
        storeLearnings();
      } else {
        router.push('/');
      }
    }, 1000 * 60 * 10);

    return () => clearTimeout(timer);
  }, [passedCards, storeLearnings, router]);

  return (
    <div className="flex bg-slate-100 min-h-full-minus-header">
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="mt-20">
          <div className="relative">
            <div className="flex justify-center flex-wrap">
              <div className="w-9/12">
                {reviews && reviews.length > 0 && (
                  <>
                    <Question card={reviews[0]} quizType={quizType ?? ''} />
                    <div className="mt-8">
                      {quizType &&
                        ['translate', 'fillblank'].includes(quizType) && (
                          <SelectAnswer
                            value={selectedAnswer}
                            options={uniqBy(
                              [...(randomCards || []), reviews[0]],
                              'id'
                            )}
                            quizType={quizType ?? ''}
                            onSelected={selectAnswerHandler}
                          />
                        )}
                      {quizType === 'freeinput' && (
                        <GameInput
                          value={answerText}
                          placeholder="Gõ lại từ bạn đã nghe được"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            selectAnswerHandler(
                              e.target.value === reviews[0].fields.word
                                ? reviews[0].id
                                : '_'
                            );
                            setAnswerText(e.target.value);
                          }}
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            if (e.key === 'Enter') {
                              checkAnswerHandler();
                            }
                          }}
                          autoFocus
                        />
                      )}
                      {quizType === 'fillinput' && (
                        <FillBlankInput
                          value={answerText ?? ''}
                          numOfChars={reviews[0].fields.word.length}
                          onChange={(val) => {
                            selectAnswerHandler(
                              val.join('') === reviews[0].fields.word
                                ? reviews[0].id
                                : '_'
                            );
                            setAnswerText(val.join(''));
                          }}
                          onSubmit={checkAnswerHandler}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between w-full mt-10">
          {isSubmitted && (
            <div>
              <Answer
                card={reviews[0]}
                isCorrect={reviews[0].id === selectedAnswer}
              />
            </div>
          )}
          <LearnButton
            ref={submitBtnRef}
            className="w-60 my-10"
            disabled={isEmpty(selectedAnswer)}
            onClick={checkAnswerHandler}
          >
            {isSubmitted ? 'TIẾP TỤC' : 'KIỂM TRA'}
          </LearnButton>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Review;
