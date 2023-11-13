'use client';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import DeckItem from './components/DeckItem';
import Link from 'next/link';
import { useDecks } from '../../../hooks/decks/useDecks';

const Decks = () => {
  const { decks, loadDecks } = useDecks();
  const [isLoading, setIsLoading] = useState(false);

  const fetchDecks = useCallback(
    async (page: number = 1, perPage: number = 10): Promise<IDeck[]> => {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/decks`,
        {
          params: {
            page,
            per_page: perPage,
          },
        }
      );
      const fetchedDecks = response.data.decks.map((deck: any) => ({
        id: deck._id,
        name: deck.name,
        description: deck.description,
        photoUrl: deck.photoUrl,
        createdAt: deck.createdAt,
        hasUnlearnedCard: deck.hasUnlearnedCard,
      }));
      setIsLoading(false);

      return fetchedDecks;
    },
    []
  );

  const initData = useCallback(async () => {
    loadDecks
  }, [loadDecks]);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <div className="flex bg-slate-100 min-h-full-minus-header">
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-1/2 bg-white">
        <div className="flex justify-center flex-wrap mx-6 mt-2">
          <div className="w-9/12 mt-10">
            {decks.map((deck) =>
              deck.hasUnlearnedCard ? (
                <Link href={`/cards?deck_id=${deck.id}`} key={deck.id}>
                  <DeckItem deck={deck} />
                </Link>
              ) : (
                <DeckItem key={deck.id} deck={deck} />
              )
            )}
          </div>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Decks;
