import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios'; // 💡 API 요청을 위해 추가
import MatchedProfile from '../components/MatchedProfile'; 
import { useAuth } from '../hooks/useAuth'; 
import MatchingTags from './MatchingTags'; 

// --- [Styled Components 정의] ---
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 20px;
`;

const WaitingCircle = styled.div`
  width: 150px;
  height: 150px;
  border: 8px solid #00ADB5; 
  border-top-color: transparent; 
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite ease-in-out;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  color: #D64560;
  font-weight: bold;
`;

const StatusText = styled.p`
  font-size: 1.5em;
  color: #555;
  margin-bottom: 30px;
`;

const Button = styled.button` 
  background-color: ${props => props.danger ? '#FF6347' : '#00ADB5'}; 
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1em;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  margin: 0 10px;
  
  &:hover {
    background-color: ${props => props.danger ? '#E5533D' : '#008891'};
    transform: translateY(-2px);
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// 후보자 카드 스타일
const CandidateCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 3px solid #00ADB5;
`;

const Name = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
`;

const Bio = styled.p`
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 30px;
`;

const Tag = styled.span`
  background: #f0f2f5;
  color: #555;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
`;
// --- [Styled Components 정의 끝] ---


const MatchingPage = () => {
  const { user } = useAuth(); 
  
  // 상태 관리
  // 상태 목록: '태그선택' -> '대기'(로딩) -> '진행중'(카드보기) -> '성공'(매칭) -> '실패/끝'
  const [matchingStatus, setMatchingStatus] = useState('태그선택'); 
  const [candidates, setCandidates] = useState([]); // 불러온 후보 목록
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보고 있는 후보의 인덱스
  const [matchedUser, setMatchedUser] = useState(null); // 매칭된 상대방 정보

  // 1. 매칭 시작 (후보 조회 API 호출)
  const startMatching = async (selectedTags) => {
      setMatchingStatus('대기'); 
      
      try {
          // 토큰 가져오기
          const token = localStorage.getItem('token');
          if (!token) {
              alert("로그인이 필요합니다.");
              return;
          }

          // 백엔드에서 후보 조회 (GET /api/matches/candidates)
          const response = await axios.get('http://localhost:3000/api/matches/candidates', {
              headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.length > 0) {
              setCandidates(response.data);
              setCurrentIndex(0); // 첫 번째 후보부터 표시
              setMatchingStatus('진행중'); // 카드를 보여주는 상태로 변경
          } else {
              alert("현재 매칭 가능한 상대가 없습니다.");
              setMatchingStatus('태그선택'); // 다시 태그 선택으로 돌아감
          }

      } catch (error) {
          console.error("후보 조회 실패:", error);
          setMatchingStatus('실패');
      }
  };

  // 2. 스와이프 액션 (좋아요/싫어요 API 호출)
  const handleSwipe = async (direction) => {
      if (currentIndex >= candidates.length) return;

      const targetUser = candidates[currentIndex];
      const token = localStorage.getItem('token');

      try {
          // 백엔드로 스와이프 결과 전송 (POST /api/matches/swipe)
          const response = await axios.post('http://localhost:3000/api/matches/swipe', {
              targetId: targetUser.id,
              direction: direction // 'like' 또는 'nope'
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });

          // 매칭 성공 시!
          if (response.data.isMatch) {
              setMatchedUser(targetUser);
              setMatchingStatus('성공');
          } else {
              // 매칭 안됨 -> 다음 후보 보여주기
              showNextCandidate();
          }

      } catch (error) {
          console.error("스와이프 오류:", error);
          // 이미 스와이프한 경우(409) 등 에러 처리
          if (error.response && error.response.status === 409) {
              showNextCandidate();
          }
      }
  };

  // 다음 후보로 넘어가기
  const showNextCandidate = () => {
      if (currentIndex < candidates.length - 1) {
          setCurrentIndex(prev => prev + 1);
      } else {
          setMatchingStatus('끝'); // 더 이상 후보가 없음
      }
  };

  
  // --- [화면 렌더링] ---

  // 1. 태그 선택 화면
  if (matchingStatus === '태그선택') {
      return <MatchingTags onStartMatch={startMatching} />; 
  }
  
  // 2. 로딩 화면 (후보 가져오는 중)
  if (matchingStatus === '대기') {
      return (
        <Container>
          <WaitingCircle>🔍</WaitingCircle>
          <StatusText>나와 딱 맞는 상대를 찾는 중...</StatusText>
        </Container>
      );
  }

  // 3. 매칭 진행 화면 (후보 카드 표시)
  if (matchingStatus === '진행중') {
      const candidate = candidates[currentIndex];
      // 태그 문자열을 배열로 변환 (DB에 "태그1,태그2" 문자열로 저장된 경우)
      const tags = candidate.tags ? candidate.tags.split(',') : [];

      return (
        <Container>
          <StatusText>새로운 인연을 발견했어요!</StatusText>
          <CandidateCard>
            <ProfileImage 
                src={candidate.profile_image_url || "https://placehold.co/150x150?text=User"} 
                alt={candidate.nickname} 
            />
            <Name>{candidate.nickname} ({candidate.age || '20'}세)</Name>
            <Bio>{candidate.bio || "자기소개가 없습니다."}</Bio>
            
            <Tags>
              {tags.map((tag, idx) => <Tag key={idx}>#{tag.trim()}</Tag>)}
            </Tags>

            <div style={{ marginTop: '20px' }}>
              <Button danger onClick={() => handleSwipe('nope')}>거절하기</Button>
              <Button onClick={() => handleSwipe('like')}>좋아요!</Button>
            </div>
          </CandidateCard>
        </Container>
      );
  }

  // 4. 매칭 성공 화면
  if (matchingStatus === '성공' && matchedUser) {
    return <MatchedProfile user={matchedUser} />;
  }

  // 5. 후보 없음 / 오류 화면
  if (matchingStatus === '끝' || matchingStatus === '실패') {
    return (
      <Container>
        <WaitingCircle style={{ borderColor: '#ccc', animation: 'none' }}>
           🏁
        </WaitingCircle>
        <StatusText>
            {matchingStatus === '실패' ? "오류가 발생했습니다." : "오늘의 추천이 끝났습니다."}
            <br/>나중에 다시 시도해주세요.
        </StatusText>
        <Button onClick={() => setMatchingStatus('태그선택')}>다시 시작하기</Button>
      </Container>
    );
  }

  return null;
};

export default MatchingPage;