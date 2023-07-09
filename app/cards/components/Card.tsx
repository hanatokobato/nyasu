import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Card.module.scss';
import MDEditor from '@uiw/react-md-editor';
import Image from 'next/image';
import { set } from 'react-hook-form';
import { useMount } from 'react-use';

interface IProps {
  card: ICard;
}

const Card = ({ card }: IProps) => {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>(
    card?.audioUrl ? new Audio(card?.audioUrl) : undefined
  );

  const cardClickHandler = useCallback((e: any) => {
    if (frontRef.current?.classList.contains(styles.rotate)) {
      frontRef.current?.classList.remove(styles.rotate);
      backRef.current?.classList.remove(styles.rotate);
    } else {
      frontRef.current?.classList.add(styles.rotate);
      backRef.current?.classList.add(styles.rotate);
    }
  }, []);

  const playAudio = useCallback(
    (e: any) => {
      e.stopPropagation();

      setAudio(new Audio(card.audioUrl));
    },
    [card.audioUrl]
  );

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);

  useMount(() => {
    setTimeout(() => {
      frontRef.current?.classList.add(styles.rotate);
      backRef.current?.classList.add(styles.rotate);
    }, 5000);
  });

  return (
    <div
      className={`${styles.card} cursor-pointer max-w-xs mx-auto`}
      onClick={cardClickHandler}
    >
      {card.audioUrl && (
        <div className="z-50 absolute -top-7 w-full flex justify-center">
          <button className={styles['btn-sound-icon']}>
            <Image
              src="/sound.svg"
              alt="sound"
              width={59}
              height={59}
              className="cursor-pointer "
              onClick={playAudio}
            />
          </button>
        </div>
      )}
      <div
        ref={frontRef}
        className={`${styles.card__side} ${styles['card__side--front']}`}
      >
        <div className={styles.card__details}>
          <MDEditor.Markdown source={card.content.front} />
        </div>
      </div>
      <div
        ref={backRef}
        className={`${styles.card__side} ${styles['card__side--back']} ${styles['card__side--back-1']} flex justify-center items-center`}
      >
        <div className={styles.card__details}>
          <MDEditor.Markdown source={card.content.back} />
        </div>
      </div>
    </div>
  );
};

export default Card;
