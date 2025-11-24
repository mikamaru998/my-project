import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard'; 
import axios from 'axios'; 

import BackgroundImage from '../assets/1.jpeg'; 

// =====================================
// ✅ Styled Components 정의 (모바일 규격 포함)
// =====================================

const HeroSection = styled.div`
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
                    url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  height: 100vh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    height: 70vh; /* 💡 모바일: 화면 높이 축소 */
    padding: 0 15px;
  }
`;

const Title = styled.h1`
  font-size: 3.5em; 
  font-weight: bold;
  color: #FFD95A; 
  margin-bottom: 15px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    font-size: 2.2em; /* 💡 모바일: 폰트 크기 축소 */
    margin-bottom: 10px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  color: #eee;
  margin-bottom: 40px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 1em; /* 💡 모바일: 폰트 크기 축소 */
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #008891;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 10px 25px; /* 💡 모바일: 버튼 크기 축소 */
    font-size: 1em;
  }
`;

const RandomProfilesSection = styled.section`
  width: 100%;
  padding: 60px 20px;
  background-color: #f8f8f8;
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 10px; /* 💡 모바일: 상하 여백 축소 */
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
    font-size: 1.5em; /* 💡 모바일: 섹션 제목 축소 */
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

// 💡 지도와 게시물 결합 섹션 스타일
const CombinedSection = styled.section`
  width: 100%;
  padding: 60px 20px;
  background-color: #ffffff;
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
    flex-direction: column; /* 💡 1024px 이하: 세로로 배치 (모바일/태블릿 규격) */
    align-items: center;
    gap: 20px;
  }
`;

// 💡 왼쪽 (지도) 섹션 스타일
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

// 💡 오른쪽 (게시물) 섹션 스타일
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
      try {
        setLoading(true);
        setError(null);
        
        // API 연결 부분: DB 오류 해결 시 이곳에서 실제 데이터가 로드됩니다.
        const response = await axios.get('/api/profiles/random'); 
        setRandomProfiles(response.data); 
        
      } catch (err) {
        console.error("API 요청 오류:", err);
        setError("프로필 데이터를 불러오는 데 실패했습니다. (서버/DB 연결 확인 필요)");
        
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProfiles();
  }, []); 


  return (
    <>
      <HeroSection>
        <Title>만남은 재능</Title>
        <Subtitle>세상의 숨겨진 재능을 연결하고, 당신의 가치를 공유하세요.</Subtitle>
        <StartButton onClick={() => navigate('/talents')}>
          재능 탐색 시작 →
        </StartButton>
      </HeroSection>

      {/* 1. 주목할 만한 재능 (기존 랜덤 프로필 섹션) */}
      <RandomProfilesSection>
        <SectionTitle>주목할 만한 재능</SectionTitle>
        <CardContainer>
          {/* 로딩 및 오류 상태 표시 */}
          {loading && <p>프로필을 불러오는 중입니다...</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}
          
          {/* API에서 데이터를 성공적으로 가져왔을 때 렌더링 */}
          {!loading && !error && randomProfiles.length > 0 ? (
            randomProfiles.slice(0, 3).map(profile => ( 
              <ProfileCard
                key={profile._id || profile.id} 
                nickname={profile.nickname} 
                talent={profile.mainTalent || '재능 정보 없음'} 
                description={profile.bio ? profile.bio.substring(0, 50) + '...' : '소개 글이 없습니다.'}
                imageUrl={profile.profilePictureUrl || 'https://via.placeholder.com/100'}
              />
            ))
          ) : (
             !loading && !error && <p>현재 주목할 만한 재능 프로필이 없습니다.</p>
          )}

        </CardContainer>
      </RandomProfilesSection>
      
      {/* 2. 💡 지도와 게시물이 결합된 섹션 */}
      <CombinedSection>
          <SectionTitle>가까운 재능 & 최신 소식</SectionTitle>
          <CombinedContent>
              
              {/* 2-A. 왼쪽: 약도 자리 확보 (MapContainer) */}
              <MapContainer>
                  <h3 style={{color: '#333', marginBottom: '15px'}}>가까운 재능 찾기</h3>
                  <p style={{ height: '350px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#555', textAlign: 'center' }}>
                      [여기에 지도 컴포넌트가 표시될 예정입니다.]
                  </p>
              </MapContainer>

              {/* 2-B. 오른쪽: 최신 게시물 목록 (PostsContainer) */}
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