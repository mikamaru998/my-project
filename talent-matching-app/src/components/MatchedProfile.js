import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background-color: #E6F7FF; 
  min-height: 80vh;
`;

const SuccessHeader = styled.h1`
  color: #007bff;
  font-size: 2.5em;
  margin-bottom: 20px;
  border-bottom: 3px solid #FFD95A;
  padding-bottom: 10px;
`;

const ProfileCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 100%;
  text-align: center;
  margin-top: 30px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #00ADB5; 
  margin-bottom: 20px;
`;

const TalentBadge = styled.span`
  display: inline-block;
  background-color: #D64560; 
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const ButtonGroup = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  background-color: ${props => props.primary ? '#00ADB5' : '#ccc'};
  color: ${props => props.primary ? 'white' : '#333'};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.primary ? '#008891' : '#bbb'};
  }
`;
// --- [컴포넌트 로직] ---
const MatchedProfile = ({ user }) => {
  const navigate = useNavigate(); 
  const userId = user.id || 1; 

  return (
    <SuccessContainer>
      <SuccessHeader>🎉 매칭 성공! 새로운 재능 메이트를 찾았습니다</SuccessHeader>
      
      <ProfileCard>
        <ProfileImage src={user.imageUrl} alt={user.nickname} />
        <h2>{user.nickname}</h2>
        <TalentBadge>재능: {user.talent}</TalentBadge>
        <p>{user.bio}</p>
      </ProfileCard>
    </SuccessContainer>
  );
};

export default MatchedProfile;