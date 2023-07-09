export {};

declare global {
  interface IDeck {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string;
    createdAt?: date;
    learning: {
      _id: string;
    };
  }

  interface ICard {
    id: string;
    content: {
      front: string;
      back: string;
    };
    deckId: string;
    audioUrl: string;
    fields: {
      word: string;
      spelling: string;
      translate: string;
      example: {
        sentence: string;
        translate?: string;
      };
    };
  }
}
