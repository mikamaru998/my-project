import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TagSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  min-height: 80vh;
  background-color: #f8f8f8;
`;

const Title = styled.h1`
  color: #D64560;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: #555;
  margin-bottom: 40px;
`;

const TagInput = styled.input`
  padding: 10px 15px;
  width: 100%;
  max-width: 400px;
  border: 2px solid #00ADB5;
  border-radius: 25px;
  margin-bottom: 30px;
  font-size: 1.1em;
  text-align: center;
`;

const TagButton = styled.button`
  background-color: ${props => props.selected ? '#00ADB5' : '#ccc'};
  color: ${props => props.selected ? 'white' : '#333'};
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const StartButton = styled.button`
  background-color: #D64560; 
  color: white;
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  font-size: 1.2em;
  margin-top: 40px;
  cursor: pointer;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const presetTags = ['프로그래밍', '외국어', '디자인', '음악', '운동', '요리', '마케팅'];

const MatchingTags = ({ onStartMatch }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    // 최대 3개까지만 선택 가능하도록 제한
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : (prev.length < 3 ? [...prev, tag] : prev)
    );
  };

  const handleStart = () => {
    
    onStartMatch(selectedTags);
  };

  return (
    <TagSearchContainer>
      <Title>원하는 재능 태그를 선택해주세요</Title>
      <Subtitle>최대 3개까지 선택하여 정밀하게 매칭할 수 있습니다.</Subtitle>
      
      <TagInput placeholder="직접 재능을 입력하여 검색할 수도 있습니다." />
      
      <div>
        {presetTags.map(tag => (
          <TagButton 
            key={tag} 
            selected={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
            disabled={selectedTags.length >= 3 && !selectedTags.includes(tag)}
          >
            #{tag} ({selectedTags.includes(tag) ? '선택됨' : (selectedTags.length >= 3 ? 'Max' : '선택')})
          </TagButton>
        ))}
      </div>
      
      <StartButton onClick={handleStart} disabled={selectedTags.length === 0}>
        매칭 시작 ({selectedTags.length}/3) →
      </StartButton>
    </TagSearchContainer>
  );
};

export default MatchingTags;