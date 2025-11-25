import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard'; 
import axios from 'axios'; 

// ❌ 배경 이미지 import 제거됨

// =====================================
// ✅ Styled Components 정의 (배경색 수정 & 모바일 규격)
// =====================================

const HeroSection = styled.div`
  /* 💡 배경 이미지 대신 화사한 핑크빛 그라데이션 적용 */
  background: linear-gradient(135deg, #fff0f6 0%, #ffe3e3 100%);
  width: 100%;
  height: 100vh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    height: 70vh; /* 모바일 높이 조정 */
    padding: 0 15px;
  }
`;

const Title = styled.h1`
  font-size: 3.5em; 
  font-weight: bold;
  color: #D64560; /* 💡 밝은 배경에 맞춰 브랜드 컬러로 변경 */
  margin-bottom: 15px;
  /* text-shadow 제거 */

  @media (max-width: 768px) {
    font-size: 2.2em;
    margin-bottom: 10px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  color: #555; /* 💡 가독성을 위해 진한 회색으로 변경 */
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 1em;
    margin-bottom: 25px;
  }
`;

const StartButton = styled.button`
  background-color: #00ADB5; 
  color: white;
  padding: 12px 30px; 
  border: none;
  border-radius: 50px;
  font-size: 1.1em;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 그림자 부드럽게 조정 */
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #008891;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 10px 25px;
    font-size: 1em;
  }
`;

const RandomProfilesSection = styled.section`
  width: 100%;
  padding: 60px 20px;
  background-color: #ffffff; /* 배경색 흰색 */
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  color: #333;
  margin-bottom: 40px;
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background-color: #D64560; 
    margin: 10px auto 0 auto;
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 30px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  
  @media (max-width: 768px) { 
    flex-direction: column; 
    align-items: center;
    gap: 15px; 
  }
`;

const CombinedSection = styled.section`
  width: 100%;
  padding: 60px 20px;
  background-color: #f9f9f9; /* 구분감을 위한 연한 회색 배경 */
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 10px;
  }
`;

const CombinedContent = styled.div`
  display: flex; 
  justify-content: center;
  gap: 40px; 
  max-width: 1200px;
  margin: 0 auto; 
  text-align: left; 

  @media (max-width: 1024px) {
    flex-direction: column; /* 모바일/태블릿: 세로 배치 */
    align-items: center;
    gap: 20px;
  }
`;

const MapContainer = styled.div`
  flex: 1; 
  min-width: 300px;
  max-width: 550px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;

  @media (max-width: 1024px) {
    width: 95%; 
    max-width: none;
    padding: 15px;
  }
`;

const PostsContainer = styled.div`
  flex: 1; 
  min-width: 300px;
  max-width: 550px;
  padding: 0;
  text-align: left;

  @media (max-width: 1024px) {
    width: 95%; 
    max-width: none;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column; 
  gap: 15px;
  margin-top: 20px;
`;

const PostCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PostTitle = styled.h4`
  color: #007bff;
  margin-bottom: 8px;
  font-size: 1.1em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// 💡 최신 게시물 더미 데이터
const mockPosts = [
    { id: 1, title: "주말 기타 레슨 모집: 왕초보 환영", talent: "음악/기타", views: 45 },
    { id: 2, title: "포토샵 기초 원데이 클래스 (3시간 완성)", talent: "디자인/편집", views: 88 },
    { id: 3, title: "영어 회화 파트너 구해요 (원어민 수준)", talent: "외국어/영어", views: 62 },
];


// =====================================
// ✅ MainPage 컴포넌트 로직
// =====================================

const MainPage = () => {
  const navigate = useNavigate();
  const [randomProfiles, setRandomProfiles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomProfiles = async () => {
       
       // 💡 화면 멈춤 방지: API 통신 대신 즉시 로딩 완료 처리
       setLoading(false); 
       setError(null);
       setRandomProfiles([]); // 데이터는 비워둠 (UI 렌더링 우선)
       
       /* 추후 백엔드 연동 시 주석 해제할 코드
       try {
         setLoading(true);
         const response = await axios.get('/api/profiles/random'); 
         setRandomProfiles(response.data); 
       } catch (err) {
         console.error(err);
         setError("프로필 데이터를 불러오지 못했습니다.");
       } finally {
         setLoading(false);
       }
       */
    };

    fetchRandomProfiles();
  }, []); 


  return (
    <>
      {/* 1. 히어로 섹션 (이미지 제거됨) */}
      <HeroSection>
        <Title>만남은 재능</Title>
        <Subtitle>세상의 숨겨진 재능을 연결하고, 당신의 가치를 공유하세요.</Subtitle>
        <StartButton onClick={() => navigate('/talents')}>
          재능 탐색 시작 →
        </StartButton>
      </HeroSection>

      {/* 2. 주목할 만한 재능 (랜덤 프로필) */}
      <RandomProfilesSection>
        <SectionTitle>주목할 만한 재능</SectionTitle>
        <CardContainer>
          {loading && <p>프로필을 불러오는 중입니다...</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}
          
          {/* 데이터가 없을 때 표시할 문구 */}
          {!loading && !error && randomProfiles.length === 0 && (
             <p style={{color: '#888'}}>현재 주목할 만한 재능 프로필이 없습니다.</p>
          )}
          
          {/* 데이터가 있을 때 렌더링 */}
          {!loading && !error && randomProfiles.length > 0 && (
            randomProfiles.slice(0, 3).map(profile => ( 
              <ProfileCard
                key={profile._id || profile.id} 
                nickname={profile.nickname} 
                talent={profile.mainTalent || '재능 정보 없음'} 
                description={profile.bio ? profile.bio.substring(0, 50) + '...' : '소개 글이 없습니다.'}
                imageUrl={profile.profilePictureUrl || 'https://via.placeholder.com/100'}
              />
            ))
          )}
        </CardContainer>
      </RandomProfilesSection>
      
      {/* 3. 지도와 게시물 결합 섹션 */}
      <CombinedSection>
          <SectionTitle>가까운 재능 & 최신 소식</SectionTitle>
          <CombinedContent>
              
              {/* 3-A. 왼쪽: 약도 자리 */}
              <MapContainer>
                  <h3 style={{color: '#333', marginBottom: '15px'}}>가까운 재능 찾기</h3>
                  <p style={{ height: '350px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#555', textAlign: 'center' }}>
                      [여기에 지도 컴포넌트가 표시될 예정입니다.]
                  </p>
              </MapContainer>

              {/* 3-B. 오른쪽: 최신 게시물 목록 */}
              <PostsContainer>
                  <h3 style={{color: '#333', marginBottom: '15px', textAlign: 'center'}}>최신 등록된 재능 게시물</h3>
                  <PostList>
                      {mockPosts.map(post => (
                          <PostCard key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                              <PostTitle>{post.title}</PostTitle> 
                              <p style={{ fontSize: '0.9em', color: '#00ADB5', marginBottom: '5px' }}>{post.talent}</p>
                              <p style={{ fontSize: '0.8em', color: '#888' }}>조회수: {post.views}</p>
                          </PostCard>
                      ))}
                  </PostList>
              </PostsContainer>

          </CombinedContent>
      </CombinedSection>
    </>
  );
};

export default MainPage;