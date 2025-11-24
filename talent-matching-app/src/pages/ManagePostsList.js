import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'; // axios 추가

// ... (스타일 컴포넌트 유지) ...

const ManagePostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 게시물 목록 상태

  // 1. 게시물 목록 불러오기 (백엔드 연동)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 토큰이 필요하다면 헤더에 추가 (현재 백엔드는 조회 시 인증 불필요)
        const response = await axios.get('http://localhost:3000/api/posts');
        setPosts(response.data); // 받아온 데이터로 상태 업데이트
      } catch (error) {
        console.error("게시물 로드 실패:", error);
      }
    };

    fetchPosts();
  }, []);

  // 2. 게시물 삭제 함수 (백엔드 연동)
  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:3000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      // 삭제 후 목록 갱신
      setPosts(posts.filter(post => post.id !== postId));
      alert("게시물이 삭제되었습니다.");
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("삭제 실패: 본인이 작성한 게시물만 삭제할 수 있습니다.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>나의 재능 게시물 관리</Title>
        <AddButton onClick={() => navigate('/manage/add')}>+ 새 게시물 추가</AddButton>
      </Header>

      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
          등록된 게시물이 없습니다.
        </p>
      ) : (
        <PostList>
          {posts.map(post => (
            <PostItem key={post.id}>
              <PostContent>
                <PostTitle>{post.title}</PostTitle>
                {/* 태그나 내용 일부 표시 가능 */}
                <p style={{ color: '#666', fontSize: '14px' }}>{post.content.substring(0, 50)}...</p>
              </PostContent>
              <ButtonGroup>
                <ActionButton onClick={() => navigate(`/manage/add`, { state: { post } })}>
                  수정
                </ActionButton>
                <ActionButton delete onClick={() => handleDelete(post.id)}>
                  삭제
                </ActionButton>
              </ButtonGroup>
            </PostItem>
          ))}
        </PostList>
      )}
    </Container>
  );
};

export default ManagePostsList;