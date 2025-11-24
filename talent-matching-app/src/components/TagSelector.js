// src/components/TagSelector.js
import React, { useState } from 'react';
import styled from 'styled-components';

const TAG_CATEGORIES = {
    // [카테고리 이름]: [태그 1, 태그 2, ...]
    '대학 생활 & 자기계발': ['독서', '공부', '팀플', '스터디카페', '자격증공부', '토익', '편입준비', '취업준비', '인턴', '대회', '자기계발', '노트정리', '중간고사', '기말고사', '대회활동', '졸업준비', '포트폴리오'],
    '여가 & 취미생활': ['카피타탄방', '사진찍기', '영화보기', '드라마정주행', '웹툰', '그림그리기', '공방체험', '보드게임', '베이킹', '요리', '음악감상', '노래방', '악기연주', '글쓰기'],
    '운동': ['헬스', '필라테스', '요가', '수영', '조깅', '등산', '자전거', '댄스', '배드민턴', '볼링', '테니스', '축구', '농구', '클라이밍', '볼트', '다이어트', '식단관리', '러닝크루'],
    '연애 & 인간관계': ['썸', '고백', '이별극복', '데이트코스', '사랑노래', '첫사랑', '이상형', 'MBTI궁금', '친구만들기', '인맥쌓기', '사교성', '감정표현', '연상', '연하', '소개팅'],
    '디지털 & 트렌드': ['틱톡', '인스타그램', '이모티콘', '컴퓨터', '노트북', '스마트폰', '태블릿', '아이패드', '패션', '액세서리'],
    '음악 & 문화': ['KPop', '인디음악', '발라드', '힙합', 'RNB', 'EDM', '락', '재즈', '팝송', '클래식', '밴드음악', '랩', '커버', '보컬연습', '리듬게임', '콘서트', '페스티벌', '버스킹', '음악프로그램'],
    '여행 & 자연': ['여행', '국내여행', '해외여행', '유럽여행', '피크닉', '캠핑', '차박', '드라이브', '바다', '산', '호캉스', '감성숙소', '자연'],
    '음식 & 취향': ['커피', '디저트', '아메리카노', '빙수', '떡볶이', '치킨', '초밥', '피자', '햄버거', '분식', '소주', '와인', '야식', '혼밥'],
    '감성 & 가치관': ['소확행', '감성', '힐링', '공감', '자기성장', '자존감', '명상', '마인드셋', '긍정적', '행복찾기', '미니멀리즘', '환경보호', '감성글'],
    '사회 & 커뮤니티': ['대학생활', '동아리활동', '축제', 'MT', '동기모임', '봉사활동', '창업', '지역축제', '문화체험', '사회참여'],
};
const ALL_PRESET_TAGS = Object.values(TAG_CATEGORIES).flat(); // 전체 프리셋 태그 목록

const MBTI_TAGS = [
    'ENFP', 'ENFJ', 'ENTP', 'ENTJ', 'ESFP', 'ESFJ', 'ESTP', 'ESTJ', 
    'INFP', 'INFJ', 'INTP', 'INTJ', 'ISFP', 'ISFJ', 'ISTP', 'ISTJ'
];

const IMAGE_TAGS = [
    '셀카 장인', '전신샷 선호', '풍경/여행 사진', '흑백 필터',
    '빈티지 감성', '힙한 포즈', '꾸안꾸 스타일', '깔끔한 배경',
    '예술적인 구도', '반려동물과 함께', '데일리룩 기록', '보정 최소화'
];

const TagsContainer = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
    background-color: #fcfcfc;
    text-align: left;
`;

const CategoryHeader = styled.h4`
    color: #00ADB5; 
    margin-top: 15px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    text-align: left;
`;

const Subtitle = styled.p`
    font-size: 0.9em;
    color: #555;
    margin-bottom: 15px;
`;

// 검색 입력창 스타일
const SearchInputContainer = styled.div`
    display: flex;
    margin-bottom: 25px;
    padding: 0 10px;
`;

const SearchInput = styled.input`
    flex-grow: 1;
    padding: 10px 15px;
    border: 2px solid #00ADB5;
    border-radius: 25px;
    font-size: 1em;
    margin-right: 10px;
`;

const AddButton = styled.button`
    padding: 10px 15px;
    background-color: #D64560;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.7 : 1};
    transition: background-color 0.2s;
`;


const TagButton = styled.button`
    background-color: ${props => props.selected ? '#D64560' : '#f0f0f0'};
    color: ${props => props.selected ? 'white' : '#333'};
    padding: 6px 10px;
    border: none;
    border-radius: 15px;
    margin: 4px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s;
    font-size: 0.85em;
    opacity: ${props => props.disabled ? 0.6 : 1};

    &:hover {
        background-color: ${props => props.selected ? '#B23A50' : (props.disabled ? '#f0f0f0' : '#e0e0e0')};
    }
`;

const TagList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 5px;
`;

const TagSelector = ({ type, selectedTags, onTagToggle }) => {
    
    const [searchTagText, setSearchTagText] = useState(''); 
    const [customTags, setCustomTags] = useState([]); 

    const isMbti = type === 'mbti';
    const isImageTag = type === 'image'; 
    
    let tagsToRender;
    let title;
    let description;
    let tagLimit;

    // 💡 타입별 설정
    if (isMbti) {
        tagsToRender = MBTI_TAGS;
        title = 'MBTI 선택';
        description = '1개만 선택해주세요.';
        tagLimit = 1;
    } else if (isImageTag) {
        tagsToRender = IMAGE_TAGS;
        title = '사진 스타일 태그';
        description = '최소 3개 이상 선택해야 합니다. (최대 5개)';
        tagLimit = 5; 
    } else { // talent 타입 (기본)
        tagsToRender = TAG_CATEGORIES;
        title = '관심 재능 태그 선택';
        description = '최소 3개 이상 선택해야 합니다. (최대 5개)';
        tagLimit = 5; 
    }

    // 사용자 입력 태그 추가/선택 로직
    const handleAddCustomTag = () => {
        const text = searchTagText.trim();
        if (!text || text.length > 20 || isMbti) return;
        
        // 태그 중복 검사 (프리셋 + 커스텀 태그 전체)
        const isTagExists = ALL_PRESET_TAGS.includes(text) || customTags.includes(text) || IMAGE_TAGS.includes(text);

        if (isTagExists && !selectedTags.includes(text)) {
            onTagToggle(text, tagLimit); 
            setSearchTagText(''); 
            return;
        }
        
        // 새 태그를 커스텀 목록에 추가하고, 바로 선택
        if (!isTagExists && selectedTags.length < tagLimit) {
            setCustomTags(prev => [...prev, text]);
            onTagToggle(text, tagLimit); 
            setSearchTagText(''); 
        }
    };
    
    // Enter 키를 눌렀을 때 태그 추가 실행
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleAddCustomTag();
        }
    };


    return (
        <TagsContainer>
            <CategoryHeader>{title} </CategoryHeader>
            <Subtitle>{description}</Subtitle>
            
            {/* 💡 2. 검색 입력창 (MBTI가 아닐 때만 표시) */}
            {!isMbti && (
                <SearchInputContainer>
                    <SearchInput
                        type="text"
                        placeholder="직접 재능을 입력하여 추가/검색하세요"
                        value={searchTagText}
                        onChange={(e) => setSearchTagText(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <AddButton
                        type="button" 
                        onClick={handleAddCustomTag} 
                        disabled={!searchTagText.trim() || selectedTags.length >= tagLimit}
                    >
                        {selectedTags.length >= tagLimit ? '최대' : '추가'}
                    </AddButton>
                </SearchInputContainer>
            )} 


            {/* 💡 3. 커스텀 태그 목록 렌더링 (재능/사진 태그에만 해당) */}
            {!isMbti && customTags.length > 0 && (
                <div style={{marginBottom: '15px', padding: '0 10px'}}>
                    <p style={{fontWeight: 'bold', fontSize: '0.9em', color: '#D64560'}}>직접 추가한 태그</p>
                    <TagList>
                        {customTags.map(tag => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <TagButton 
                                    key={`custom-${tag}`} 
                                    selected={isSelected}
                                    onClick={() => onTagToggle(tag, tagLimit)}
                                    disabled={selectedTags.length >= tagLimit && !isSelected}
                                >
                                    #{tag}
                                </TagButton>
                            );
                        })}
                    </TagList>
                </div>
            )}

            {isMbti ? (
                // --- 4. MBTI 렌더링 ---
                <div style={{ padding: '0 10px' }}>
                    <TagList>
                        {tagsToRender.map(tag => (
                            <TagButton 
                                type="button" 
                                key={tag} 
                                selected={selectedTags.includes(tag)}
                                onClick={() => onTagToggle(tag, tagLimit)}
                                disabled={selectedTags.length >= tagLimit && !selectedTags.includes(tag)}
                            >
                                #{tag}
                            </TagButton>
                        ))}
                    </TagList>
                </div>
            ) : (
                // --- 5. 재능/사진 태그 렌더링 ---
                <div style={{ padding: '0 10px' }}>
                    {isImageTag ? (
                        // 💡 사진 스타일 태그 목록 (단일 배열)
                        <TagList>
                            {tagsToRender.map(tag => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <TagButton 
                                        type="button"
                                        key={tag} 
                                        selected={isSelected}
                                        onClick={() => onTagToggle(tag, tagLimit)}
                                        disabled={selectedTags.length >= tagLimit && !isSelected}
                                    >
                                        #{tag}
                                    </TagButton>
                                );
                            })}
                        </TagList>
                    ) : (
                        // 💡 일반 재능 태그 목록 (카테고리별)
                        Object.entries(tagsToRender).map(([category, tags]) => (
                            <div key={category} style={{marginBottom: '10px'}}>
                                <p style={{marginTop: '10px', fontWeight: 'bold', fontSize: '0.9em', color: '#0056b3'}}>{category}</p>
                                <TagList>
                                    {tags.map(tag => {
                                        const isSelected = selectedTags.includes(tag);
                                        return (
                                            <TagButton 
                                                type="button"
                                                key={tag} 
                                                selected={isSelected}
                                                onClick={() => onTagToggle(tag, tagLimit)}
                                                disabled={selectedTags.length >= tagLimit && !isSelected}
                                            >
                                                #{tag}
                                            </TagButton>
                                        );
                                    })}
                                </TagList>
                            </div>
                        ))
                    )}
                </div>
            )}
            <p style={{marginTop: '15px', fontSize: '0.8em', color: '#333'}}>
                현재 선택: **{selectedTags.length}/{tagLimit}**
            </p>
        </TagsContainer>
    );
};

export default TagSelector;