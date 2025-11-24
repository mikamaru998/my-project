import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header'; 

// --- [Pages Import] ---
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage'; 
import MatchingPage from './pages/MatchingPage'; 
import PostFormPage from './pages/PostFormPage'; 
import ManagePostsList from './pages/ManagePostsList'; 
import ProfileEditPage from './pages/ProfileEditPage'; // 💡 프로필 수정 폼

// 💡 임시 컴포넌트 정의 (다른 경로 테스트용)
const TalentListPage = () => <div style={{padding: '50px', textAlign: 'center'}}><h2>메인 (재능 목록) 페이지</h2><p>다양한 재능 목록을 보여줍니다.</p></div>;
const ChatPage = () => <div style={{padding: '50px', textAlign: 'center'}}><h2>채팅 페이지</h2><p>매칭된 상대와 채팅을 시작합니다.</p></div>;


// 🚨 ProfileDetailPage 컴포넌트 정의 (오류 해결 및 수정 기능 통합)
const ProfileDetailPage = () => {
    // 💡 useParams와 useNavigate가 import 되었으므로 여기서 사용 가능
    const { userId } = useParams();
    const navigate = useNavigate();

    // 임시로 ID '42'가 본인이라고 가정하여 수정 버튼을 표시
    // (실제 앱에서는 useAuth() 훅을 통해 로그인 사용자 ID와 userId를 비교해야 합니다.)
    const isOwner = (userId === '42'); 

    return (
        <div style={{padding: '50px', textAlign: 'center', background: '#f8f8f8', minHeight: '80vh'}}>
            <h2 style={{color: '#D64560'}}>사용자 프로필 상세 (ID: {userId})</h2>
            <p style={{marginBottom: '30px'}}>여기에 서버에서 불러온 상세 정보가 표시됩니다.</p>
            
            {isOwner && (
                // 💡 수정 페이지로 이동하는 버튼 (로그인 사용자 본인일 경우만 표시)
                <button 
                    onClick={() => navigate(`/profile/edit/${userId}`)} 
                    style={{marginTop: '20px', padding: '10px 20px', background: '#00ADB5', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px'}}>
                    프로필 수정하기
                </button>
            )}
        </div>
    );
};


function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          
          {/* 1. 기본/인증 경로 */}
          <Route path="/" element={<MainPage />} /> 
          <Route path="/auth" element={<AuthPage />} /> 
          
          {/* 2. 게시물 관리 라우트 */}
          <Route path="/manage" element={<ManagePostsList />} />  
          <Route path="/manage/add" element={<PostFormPage />} /> 
          
          {/* 3. 네비게이션 메뉴 및 상세 경로 */}
          <Route path="/talents" element={<TalentListPage />} /> 
          <Route path="/matching" element={<MatchingPage />} /> 
          <Route path="/chat/:userId" element={<ChatPage />} /> 
          
          {/* ✅ 프로필 상세 라우트 (수정 버튼 포함) */}
          <Route path="/profile/:userId" element={<ProfileDetailPage />} /> 
          
          {/* ✅ 프로필 수정 폼 라우트 */}
          <Route path="/profile/edit/:userId" element={<ProfileEditPage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;