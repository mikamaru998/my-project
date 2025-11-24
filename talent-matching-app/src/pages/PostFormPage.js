import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'; // axios 추가

// ... (스타일 컴포넌트 유지) ...

const PostFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingPost = location.state?.post; // 수정 시 전달받은 게시물 정보

  const [title, setTitle] = useState(existingPost ? existingPost.title : '');
  const [content, setContent] = useState(existingPost ? existingPost.content : '');
  const [imageUrl, setImageUrl] = useState(existingPost ? existingPost.image_url : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    const postData = { title, content, image_url: imageUrl };

    try {
      if (existingPost) {
        // 수정 (PUT)
        await axios.put(`http://localhost:3000/api/posts/${existingPost.id}`, postData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("게시물이 수정되었습니다.");
      } else {
        // 생성 (POST)
        await axios.post('http://localhost:3000/api/posts', postData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("새 게시물이 등록되었습니다.");
      }
      navigate('/manage'); // 목록 페이지로 이동
    } catch (error) {
      console.error("게시물 저장 실패:", error);
      alert("저장 실패: " + (error.response?.data?.message || "오류가 발생했습니다."));
    }
  };

  return (
    <Container>
      <Title>{existingPost ? '게시물 수정' : '새 게시물 추가'}</Title>
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="제목을 입력하세요" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <TextArea 
          placeholder="내용을 입력하세요 (재능 소개, 포트폴리오 등)" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        />
        <Input 
          type="text" 
          placeholder="이미지 URL (선택 사항)" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
        />
        <Button type="submit">{existingPost ? '수정 완료' : '등록하기'}</Button>
        <Button type="button" style={{ backgroundColor: '#ccc', marginTop: '10px' }} onClick={() => navigate(-1)}>
            취소
        </Button>
      </Form>
    </Container>
  );
};

export default PostFormPage;