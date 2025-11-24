import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TagSelector from '../components/TagSelector'; 
import axios from 'axios'; 
// import { useAuth } from '../hooks/useAuth'; // 💡 로그인 사용자 정보를 가져와야 합니다.

// 💡 AuthPage.js에 정의된 것과 동일한 MAJOR_OPTIONS를 사용해야 합니다.
const MAJOR_OPTIONS = [
    '선택하세요', '간호학과', '보건의료행정과', /* ... 나머지 학과 ... */
]; 
// 💡 Select Box 스타일도 AuthPage.js에서 가져와 여기에 정의하거나, 별도 CSS 파일로 분리해야 합니다.
const Select = styled.select`/* ... */`;
const FormContainer = styled.div`
    padding: 40px;
    max-width: 600px;
    margin: 40px auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;
const InputGroup = styled.div`/* ... */`;
const Input = styled.input`/* ... */`;
const Button = styled.button`/* ... */`;


const ProfileEditPage = () => {
    // const { user, token } = useAuth(); // 💡 현재 로그인 사용자 정보
    const navigate = useNavigate();

    // 💡 초기값은 서버에서 불러온 값으로 설정되어야 합니다.
    const [nickname, setNickname] = useState('현재닉네임'); 
    const [major, setMajor] = useState('컴퓨터공학과'); 
    const [mbti, setMbti] = useState(['INTP']); 
    const [talentTags, setTalentTags] = useState(['웹 개발', 'AI/ML']); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 💡 [실제 로직] useEffect를 사용해 현재 로그인한 사용자 정보를 서버에서 불러옵니다.
    // useEffect(() => {
    //     if (!user) { navigate('/auth'); return; }
    //     // axios.get(`/api/profile/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
    //     //     .then(res => {
    //     //         setNickname(res.data.nickname); 
    //     //         setMajor(res.data.major); 
    //     //         setMbti(res.data.mbti.split(',')); // 문자열을 배열로 변환
    //     //         setTalentTags(res.data.tags.split(',')); 
    //     //     });
    // }, [user, token, navigate]);


    // 💡 태그 토글 로직 (AuthPage와 동일)
    const handleTagToggle = (tag, limit) => {
        const setState = limit === 1 ? setMbti : setTalentTags;
        // ... (토글 로직 유지) ...
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. 데이터 준비
        const tagsString = talentTags.join(','); 
        const mbtiString = mbti.join(''); 

        const updatedData = {
            nickname,
            major,
            mbti: mbtiString,
            tags: tagsString,
        };

        try {
            // 2. 💡 백엔드 API 호출: 프로필 수정은 PATCH/PUT 요청을 사용합니다.
            // await axios.patch(`/api/profile/update/${user.id}`, updatedData, {
            //     headers: { Authorization: `Bearer ${token}` } 
            // });

            alert('프로필이 성공적으로 수정되었습니다.');
            navigate('/profile/' + '현재ID'); // 수정 후 프로필 상세 페이지로 이동

        } catch (error) {
            alert('수정 실패: 서버 통신 오류');
        }
    };


    return (
        <FormContainer>
            <h2 style={{color: '#D64560'}}>프로필 정보 수정</h2>
            <form onSubmit={handleSubmit}>
                {/* 닉네임 입력 */}
                <InputGroup>
                    <label>닉네임</label>
                    <Input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                </InputGroup>
                
                {/* 학과 선택 드롭다운 */}
                <InputGroup>
                    {/* ... (Select 컴포넌트 렌더링 로직 유지) ... */}
                </InputGroup>

                {/* MBTI 및 재능 태그 선택 */}
                <InputGroup>
                    <TagSelector type="mbti" selectedTags={mbti} onTagToggle={handleTagToggle} />
                </InputGroup>
                <InputGroup>
                    <TagSelector type="talent" selectedTags={talentTags} onTagToggle={handleTagToggle} />
                </InputGroup>

                <Button type="submit" primary>
                    정보 저장 (수정 완료)
                </Button>
            </form>
        </FormContainer>
    );
};

export default ProfileEditPage;