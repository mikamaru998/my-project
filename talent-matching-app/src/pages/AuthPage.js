import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import TagSelector from '../components/TagSelector';
import axios from 'axios'; 
import { useAuth } from '../hooks/useAuth'; // 주석 해제됨

// --- [Styled Components Definitions] ---
const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f7f6; 
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  color: #00ADB5;
  margin-bottom: 30px;
  font-size: 1.8em;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.3s;
  &:focus {
    border-color: #00ADB5;
    outline: none;
  }
`;

const Select = styled.select`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
    font-size: 1em;
    height: 44px;
    transition: border-color 0.3s;
    background-color: white;
    
    &:focus {
        border-color: #00ADB5;
        outline: none;
    }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9em;
  margin-top: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${props => props.primary ? '#00ADB5' : '#ccc'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.primary ? '#008891' : '#bbb'};
  }
`;

const SwitchButton = styled.p`
  margin-top: 20px;
  font-size: 0.9em;
  color: #555;
  cursor: pointer;
  
  span {
    color: #00ADB5;
    font-weight: bold;
    margin-left: 5px;
  }
`;

// --- [Component Logic] ---

const AuthPage = () => {
  const { login } = useAuth(); // useAuth 훅 사용
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});

  // Department, Nickname, MBTI, Tags States
  const [nickname, setNickname] = useState('');
  const [major, setMajor] = useState(''); // 학과 ID 저장
  const [majorsList, setMajorsList] = useState([]); // DB에서 불러온 학과 목록
  const [mbti, setMbti] = useState([]); 
  const [talentTags, setTalentTags] = useState([]); 
  
  // 성별, 생년월일 상태
  const [gender, setGender] = useState('male'); 
  const [birthDate, setBirthDate] = useState('');

  // 1. 화면 켜질 때 학과 목록 가져오기
  useEffect(() => {
      axios.get('http://localhost:3000/api/majors')
          .then((response) => {
              setMajorsList(response.data); 
          })
          .catch((error) => {
              console.error("학과 목록 로드 실패:", error);
          });
  }, []);

  // 2. URL 주소에 따라 로그인/회원가입 모드 전환
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      if (params.get('mode') === 'register') {
          setIsLogin(false);
      } else {
          setIsLogin(true);
      }
  }, [location.search]);

  // Tag Toggle Logic
  const handleTagToggle = (tag, limit) => {
    const setState = limit === 1 ? setMbti : setTalentTags;
    
    setState(prev => {
        const isSelected = prev.includes(tag);
        if (isSelected) {
            return prev.filter(t => t !== tag);
        } else if (prev.length < limit) {
            return limit === 1 ? [tag] : [...prev, tag]; 
        }
        return prev;
    });
  };

  const validate = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim() || !emailRegex.test(email)) {
      errors.email = '유효한 이메일 주소를 입력해 주세요.';
    }
    if (password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    
    if (!isLogin) { 
      if (password !== confirmPassword) {
        errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
      if (nickname.length < 2) {
          errors.nickname = '닉네임은 2자 이상이어야 합니다.';
      }
      if (talentTags.length < 3) {
          errors.talentTags = '재능 태그를 최소 3개 이상 선택해야 합니다.';
      }
    }
    
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    
    const tagsString = talentTags.join(','); 
    const mbtiString = mbti.join(''); 

    const userData = {
        email, 
        password,
        nickname,
        majorId: parseInt(major, 10),
        mbti: mbtiString,
        tags: tagsString, 
        gender: gender,       
        birth_date: birthDate 
    };

    try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'; 
        const response = await axios.post(`http://localhost:3000${endpoint}`, userData);
        const { token, user } = response.data; 

        if (isLogin) {
            // 로그인 성공 시 useAuth의 login 함수 호출
            login(token, user);
            alert(`환영합니다, ${user.nickname || nickname}님!`);
            navigate('/'); 

        } else {
            // 회원가입 성공 시
            alert('회원가입이 완료되었습니다. 로그인해 주세요.');
            setIsLogin(true); 
        }
    } catch (error) {
        console.error("API 연동 실패:", error.response?.data || error.message);
        const message = error.response?.data?.message || '서버와의 통신에 실패했습니다.';
        setError({ api: message });
        alert('인증 실패: ' + message);
    }
  };

  return (
    <AuthContainer> 
      <AuthCard>
        <Title>{isLogin ? '로그인' : '회원가입'}</Title>
        <form onSubmit={handleSubmit}>
          
          <InputGroup>
            <Input type="email" placeholder="이메일 주소" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error.email && <ErrorMessage>{error.email}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Input type="password" placeholder="비밀번호 (최소 6자)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error.password && <ErrorMessage>{error.password}</ErrorMessage>}
          </InputGroup>

          {!isLogin && (
            <>
              <InputGroup>
                <Input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                {error.confirmPassword && <ErrorMessage>{error.confirmPassword}</ErrorMessage>}
              </InputGroup>
              
              <InputGroup>
                  <Input type="text" placeholder="닉네임 (필수)" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                  {error.nickname && <ErrorMessage>{error.nickname}</ErrorMessage>}
              </InputGroup>

              <InputGroup>
                <div style={{ marginBottom: '5px', color: '#666', fontSize: '14px' }}>성별</div>
                <Select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  style={{ backgroundColor: '#f9f9f9' }}
                >
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </Select>
              </InputGroup>

              <InputGroup>
                <div style={{ marginBottom: '5px', color: '#666', fontSize: '14px' }}>생년월일</div>
                <Input 
                  type="date" 
                  value={birthDate} 
                  onChange={(e) => setBirthDate(e.target.value)}
                  required 
                  style={{ backgroundColor: '#f9f9f9' }}
                />
              </InputGroup>
              
              <InputGroup>
                  <Select
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      required
                  >
                      <option value="">학과를 선택하세요 (필수)</option>
                      {majorsList.map((item) => (
                          <option key={item.id} value={item.id}> 
                              {item.college_name} - {item.major_name}
                          </option>
                      ))}
                  </Select>
              </InputGroup>

              <InputGroup>
                  <TagSelector type="mbti" selectedTags={mbti} onTagToggle={handleTagToggle} />
              </InputGroup>

              <InputGroup>
                  <TagSelector type="talent" selectedTags={talentTags} onTagToggle={handleTagToggle} />
                  {error.talentTags && <ErrorMessage>{error.talentTags}</ErrorMessage>}
              </InputGroup>
            </>
          )}

          <Button type="submit" primary>
            {isLogin ? '로그인' : '회원가입'}
          </Button>

        </form>
        
        <SwitchButton onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <span>{isLogin ? '회원가입' : '로그인'}</span>
        </SwitchButton>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;