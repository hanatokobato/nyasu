import { Card, GetApiV1Cards200Response } from '@/types/api';
import { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import { buildApiClient } from '../../lib/apiClient';

const apiClient = buildApiClient();

const useLearnings = () => {
  const [reviews, setReviews] = useState<Card[]>([]);
  const [randomCards, setRandomCards] = useState<Card[]>([]);

  const postLearning = useCallback(
    async (params: { deckId?: string; cardIds?: string[] }) => {
      const { cardIds: card_ids, deckId: deck_id } = params;
      await apiClient.postApiV1CardsLearning({ card_ids, deck_id });
    },
    []
  );

  const loadReviews = useCallback(async () => {
    const response: AxiosResponse<GetApiV1Cards200Response> =
      await apiClient.getApiV1LearningsReviews();
    setReviews(response.data.data?.cards ?? []);
  }, []);

  const loadRandomCards = useCallback(async () => {
    const response: AxiosResponse<GetApiV1Cards200Response> =
      await apiClient.getApiV1CardsRandom();
    setRandomCards(response.data.data?.cards ?? []);
  }, []);

  const updateLearnings = useCallback(
    async ({
      passedCards,
      failedCards,
    }: {
      passedCards: string[];
      failedCards: string[];
    }) => {
      await apiClient.putApiV1CardsLearning({
        passed_cards: passedCards,
        failed_cards: failedCards,
      });
    },
    []
  );

  return { reviews, randomCards, postLearning, loadReviews, loadRandomCards, updateLearnings };
};

export { useLearnings };
