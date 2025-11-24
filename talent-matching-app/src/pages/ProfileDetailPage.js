import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  min-height: 80vh;
  background-color: #f8f8f8;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #D64560; /* 강조 색상 */
  margin-bottom: 25px;
`;

const TalentList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const TalentBadge = styled.span`
  background-color: #00ADB5;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: bold;
`;

const BioSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: left;
`;

const mockProfileData = {
    42: { // 매칭 페이지에서 넘겨준 ID 42에 대한 더미 데이터
        nickname: '프론트 개발자',
        talents: ['React', 'Styled Components', 'JavaScript', 'UI/UX'],
        bio: 'React와 Next.js 기반의 웹 애플리케이션 개발 경력 3년차입니다. 사용자 경험을 최우선으로 생각하며, 깔끔하고 효율적인 코드 작성을 지향합니다. 취미는 커피 브루잉입니다.',
        imageUrl: 'https://via.placeholder.com/150/D64560/FFFFFF?text=F',
        location: '서울 강남',
        rating: 4.8,
    }
    // 다른 ID에 대한 데이터도 여기에 추가 가능
};


const ProfileDetailPage = () => {
  const { userId } = useParams(); 
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null); 
        
        // 💡 더미 데이터 사용 (백엔드 연결 전)
        const data = mockProfileData[userId];
        if (data) {
             setProfile(data);
        } else {
             setError("해당 프로필을 찾을 수 없습니다.");
        }

      } catch (err) {
        console.error("프로필 API 요청 오류:", err);
        setError("프로필 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]); // URL의 userId가 바뀔 때마다 재호출

  
  if (loading) {
    return <ProfileContainer><p>프로필을 불러오는 중입니다...</p></ProfileContainer>;
  }

  if (error || !profile) {
    return <ProfileContainer><p style={{color: 'red'}}>{error || '프로필 정보를 표시할 수 없습니다.'}</p></ProfileContainer>;
  }

  // 성공적으로 프로필을 불러왔을 때 렌더링
  return (
    <ProfileContainer>
      <Card>
        <ProfileImage src={profile.imageUrl} alt={profile.nickname} />
        <h1>{profile.nickname}</h1>
        <p style={{color: '#555', marginBottom: '10px'}}>{profile.location} | 평점: {profile.rating} ⭐</p>
        
        <TalentList>
          {profile.talents.map((t, index) => (
            <TalentBadge key={index}>{t}</TalentBadge>
          ))}
        </TalentList>
        
        <BioSection>
            <h3>자기소개 및 경력</h3>
            <p style={{marginTop: '10px', lineHeight: '1.6'}}>{profile.bio}</p>
        </BioSection>
        
        {/* 여기에 포트폴리오, 후기 섹션 등을 추가할 수 있습니다. */}
      </Card>
      
    </ProfileContainer>
  );
};

export default ProfileDetailPage;