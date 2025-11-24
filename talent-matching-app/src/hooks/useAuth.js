import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. 토큰 초기화 (새로고침 시 localStorage에서 읽어옴)
  const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || null);

  // 2. 사용자 정보 초기화 (새로고침 시 localStorage에서 읽어옴 - 에러 방지)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("사용자 정보 파싱 실패:", e);
      return null;
    }
  });

  // 3. 로그인 함수 (토큰과 사용자 정보를 받아서 저장)
  // 💡 파라미터 순서: (토큰, 유저정보) -> AuthPage.js 호출 순서와 일치해야 함
  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    
    // 브라우저 저장소에 영구 저장
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  // 4. 로그아웃 함수
  const logout = () => {
    setToken(null);
    setUser(null);
    
    // 저장소에서 삭제
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    
    // (선택 사항) 로그아웃 시 메인 페이지로 이동하려면 주석 해제
    // window.location.href = '/'; 
  };

  // 5. 자동 로그아웃 타이머 (30분)
  useEffect(() => {
    if (token) {
      const autoLogoutTimer = setTimeout(() => {
        console.log("토큰 만료로 자동 로그아웃");
        logout();
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      }, 30 * 60 * 1000); // 30분

      return () => clearTimeout(autoLogoutTimer); 
    }
  }, [token]);

  // Context를 통해 공유할 값들
  const value = { 
    user, 
    token, 
    login, 
    logout, 
    isAuthenticated: !!token 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 앱 어디서든 사용할 수 있는 커스텀 훅
export const useAuth = () => {
  return useContext(AuthContext);
};