import type { NextPage } from "next";
import NewLayout from "@components/newLayout";

const ProfileSetting: NextPage = () => {
  return (
    <NewLayout seoTitle="설정" title="설정" actionBar backBtn>
      <div className="px-4 divide-y-[1px] cursor-pointer">
        <div className="space-y-5 pt-0.5 pb-5">
          <p className="mt-4 py-1 text-sm font-bold">알림 설정</p>
          <p>알림 및 소리</p>
          <p>방해금지 시간 설정</p>
        </div>
        <div className="space-y-5 pb-5">
          <p className="mt-4 py-1 text-sm font-bold">사용자 설정</p>
          <p>계정 / 정보 관리</p>
          <p>모아보기 사용자 관리</p>
          <p>차단 사용자 관리</p>
          <p>게시글 미노출 사용자 관리</p>
          <p>기타 설정</p>
        </div>
        <div className="space-y-5 pb-5">
          <p className="mt-4 py-1 text-sm font-bold">기타</p>
          <p>공지사항</p>
          <p>국가 변경</p>
          <p>언어 설정</p>
          <p>캐시 데이터 삭제 하기</p>
          <p>버전 정보</p>
          <p>로그아웃</p>
          <p>탈퇴하기</p>
        </div>
      </div>
    </NewLayout>
  );
};

export default ProfileSetting;
