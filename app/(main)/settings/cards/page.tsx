'use client';

import DropDownMenu from '@/app/components/DropDownMenu';
import { useCards } from '@/hooks/cards/useCards';
import { useDecks } from '@/hooks/decks/useDecks';
import { Card as ICard } from '@/types/api';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AiFillFileAdd, AiFillDelete } from 'react-icons/ai';
import { TfiMoreAlt } from 'react-icons/tfi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast, ToastContainer } from 'react-toastify';

const Cards = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck_id') || undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const { cards, currentPage, totalPage, loadCards, deleteCard } = useCards();
  const { deck, loadDeck } = useDecks();

  const loadMoreCards = useCallback(async () => {
    await loadCards({ page: currentPage + 1, deckId });
  }, [currentPage, deckId, loadCards]);

  const deleteCardHandler = useCallback(async (id: string) => {
    try {
      if (confirm('Want to delete?') === true) {
        await deleteCard(id);
        toast('Deck deleted!', { type: 'success' });
      }
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, [deleteCard]);

  const initData = useCallback(async () => {
    await Promise.all([loadDeck(deckId!), loadCards({ deckId })]);
  }, [deckId, loadDeck, loadCards]);

  const playAudio = useCallback((card: ICard) => {
    setAudio(new Audio(card?.audioUrl));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    initData();
    setIsLoading(false);
  }, [initData]);

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);

  return (
    <>
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <div className="mb-8">
        <div className="flex justify-between p-4 m-auto bg-white rounded-lg shadow w-96">
          <div>
            <Link href={`/settings/decks/${deckId}`}>
              <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-white bg-yellow-300">
                {deck?.name}
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="py-2 px-4 flex justify-center items-center  bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
            onClick={() => router.push(`/settings/cards/new?deck_id=${deckId}`)}
          >
            <div className="flex items-center justify-center">
              <AiFillFileAdd />
              <span className="ml-2">Thêm thẻ</span>
            </div>
          </button>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center w-full mx-auto">
        <InfiniteScroll
          next={loadMoreCards}
          hasMore={currentPage < totalPage}
          dataLength={cards.length}
          loader={<h4>Loading...</h4>}
        >
          <ul className="flex flex-wrap">
            {cards.map((card) => (
              <li
                key={card.id}
                className="flex flex-col ml-4 mb-4 border-gray-400 w-60"
              >
                {card.audioUrl && (
                  <button className="relative w-14 h-14 bg-neutral-200 rounded-full">
                    <Image
                      src="/sound.svg"
                      alt="sound"
                      width={59}
                      height={59}
                      className="cursor-pointer rounded-full bg-white absolute left-0 bottom-1.5 active:translate-y-1.5 focus:translate-y-1.5"
                      onClick={() => playAudio(card)}
                    />
                  </button>
                )}
                <div className="flex justify-end">
                  <DropDownMenu
                    items={[
                      {
                        label: 'Xóa',
                        icon: <AiFillDelete color="#CC0000" />,
                        clickHandler: () => deleteCardHandler(card.id),
                      },
                    ]}
                    icon={<TfiMoreAlt />}
                  />
                </div>
                <div className="shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-md flex flex-1 items-center p-4">
                  <Link
                    href={`/settings/cards/${card.id}`}
                    className="w-full h-full"
                  >
                    <MDEditor.Markdown source={card.content.front} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Cards;
