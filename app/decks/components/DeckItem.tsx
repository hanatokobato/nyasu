import Image from 'next/image';

interface IProps {
  deck: IDeck;
}

const DeckItem: React.FC<IProps> = ({ deck }) => {
  return (
    <div className="bg-neutral-200 rounded-2xl shadow-md mb-5">
      <div
        className={`${
          deck.learning ? 'bg-success text-white' : 'bg-slate-50'
        } rounded-2xl cursor-pointer -translate-y-1 active:translate-y-1 focus:translate-y-1`}
      >
        <div className="flex">
          <div className="w-1/6 flex items-center justify-center">
            <Image
              width={40}
              height={40}
              className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              src={deck.photoUrl ?? ''}
              alt="Bordered avatar"
            />
          </div>
          <div className="w-5/6 py-5 pl-7 pr-6 flex-auto">
            <div className="font-bold text-2xl">{deck.name}</div>
            <div className="mt-2.5">{deck.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckItem;
