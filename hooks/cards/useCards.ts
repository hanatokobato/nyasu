import {
  Card,
  GetApiV1Cards200Response,
  GetApiV1CardsLearning200Response,
  PostApiV1CardsRequestContent,
  PostApiV1CardsRequestFields,
} from '@/types/api';
import { useState, useCallback } from 'react';
import { buildApiClient } from '../../lib/apiClient';
import { AxiosResponse } from 'axios';

const apiClient = buildApiClient();

export interface ICardParams {
  deckId?: string;
  content: PostApiV1CardsRequestContent;
  fields: PostApiV1CardsRequestFields;
  file?: File;
}

const useCards = () => {
  const [learningCards, setLearningCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [card, setCard] = useState<Card>();

  const loadLearningCards = useCallback(async (deckId: string) => {
    const response: AxiosResponse<GetApiV1CardsLearning200Response> =
      await apiClient.getApiV1CardsLearning(deckId);
    setLearningCards(response.data.data?.cards ?? []);
  }, []);

  const loadCards = useCallback(
    async ({
      page = 1,
      perPage = 10,
      deckId,
    }: {
      page?: number;
      perPage?: number;
      deckId?: string;
    }) => {
      const response: AxiosResponse<GetApiV1Cards200Response> =
        await apiClient.getApiV1Cards(page, perPage, deckId);
      setCards((currentCards) =>
        currentCards.concat(response.data.data?.cards ?? [])
      );
      setCurrentPage(response.data.data?.page ?? 1);
      setTotalPage(response.data.data?.total_page ?? 1);
    },
    []
  );

  const loadCard = useCallback(async (cardId: string) => {
    const response = await apiClient.getApiV1CardsId(cardId);
    setCard(response.data.data.card);
  }, []);

  const createCard = useCallback(
    async ({ deckId, content, fields, file }: ICardParams) => {
      const response = await apiClient.postApiV1Cards(
        deckId,
        content,
        fields,
        file
      );
      return response.data.data.card;
    },
    []
  );

  const updateCard = useCallback(
    async (id: string, { content, fields, file }: ICardParams) => {
      const response = await apiClient.putApiV1CardsId(
        id,
        content,
        fields,
        file
      );
      return response.data.data.card;
    },
    []
  );

  const deleteCard = useCallback(async (id: string) => {
    await apiClient.deleteApiV1CardsId(id);
    setCards((currentCards) => currentCards.filter((c) => c.id !== id));
  }, []);

  const uploadAttachment = useCallback(async (file: File) => {
    const response = await apiClient.postApiV1CardsAttachments(file);
    return response.data.data?.attachment;
  }, []);

  return {
    learningCards,
    cards,
    card,
    currentPage,
    totalPage,
    loadLearningCards,
    loadCards,
    loadCard,
    deleteCard,
    uploadAttachment,
    createCard,
    updateCard,
  };
};

export { useCards };
