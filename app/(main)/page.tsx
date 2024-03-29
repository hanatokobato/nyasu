import { AxiosResponse } from 'axios';
import Link from 'next/link';
import LearnButton from '../components/buttons/Button';
import Chart from './review/components/Chart';
import WaitReviewBtn from './review/components/WaitReviewBtn';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Image from 'next/image';
import Button from '../components/buttons/Button';
import { GetApiV1LearningStatistic200Response } from '../../types/api';

import { buildApiClient } from '../../lib/apiClient';

const apiClient = buildApiClient();

const getData = async (session: Session) => {
  const response: AxiosResponse<GetApiV1LearningStatistic200Response> =
    await apiClient.getApiV1LearningStatistic({
      headers: { Authorization: `Bearer ${session.user.auth_token}` },
    });
  const { word_levels, wait_review_count, curr_review_count, upcoming } =
    response.data.data!;
  return { word_levels, wait_review_count, curr_review_count, upcoming };
};

const Home = async () => {
  const session = await getServerSession(authOptions);
  let content = (
    <div className="w-full flex flex-col justify-center items-center mt-10">
      <Image src="/menu-avatar.png" width={200} height={234} alt="" />
      <div className="mt-4">
        <p className="font-bold text-2xl text-center">
          Để kích hoạt tính năng &quot;Thời điểm vàng&quot;
          <br />
          hãy học 1 bài học từ mới
        </p>
      </div>
      <div className="mt-8 w-60">
        <Link href="/decks">
          <Button>HỌC TỪ MỚI</Button>
        </Link>
      </div>
    </div>
  );
  if (session) {
    const { word_levels, wait_review_count, curr_review_count, upcoming } =
      await getData(session);
    content = (
      <>
        <Chart wordLevels={word_levels} />
        <div className="text-center mt-12">
          {wait_review_count > 0 && (
            <p className="mb-12">Chuẩn bị ôn tập: {wait_review_count} từ</p>
          )}
          {curr_review_count === 0 && (
            <WaitReviewBtn date={new Date(upcoming)} />
          )}
          {curr_review_count > 0 && (
            <Link href="/review">
              <LearnButton className="w-60">ÔN TẬP NGAY</LearnButton>
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-full-minus-header">
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="flex justify-center flex-wrap mx-6 mt-2">
          <div className="w-7/12 mt-20">{content}</div>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Home;
