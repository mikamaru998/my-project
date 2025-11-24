import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  text-align: center;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 3px solid #FFD95A; 
`;

const Nickname = styled.h3`
  font-size: 1.4em;
  color: #333;
  margin-bottom: 5px;
`;

const TalentTag = styled.span`
  display: inline-block;
  background-color: #00ADB5; 
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9em;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Description = styled.p`
  font-size: 0.9em;
  color: #777;
  line-height: 1.5;
`;

const ProfileCard = ({ nickname, talent, description, imageUrl }) => {
  return (
    <Card>
      <ProfileImage src={imageUrl} alt={nickname} />
      <Nickname>{nickname}</Nickname>
      <TalentTag>{talent}</TalentTag>
      <Description>{description}</Description>
    </Card>
  );
};

export default ProfileCard;