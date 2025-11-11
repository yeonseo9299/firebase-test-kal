import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ 추가: 비밀번호 확인 상태

  const handleSignUp = async (e) => {
    e.preventDefault();

    // ✅ 비밀번호 확인 일치 검사
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 완료!");
      navigate("/signin");
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignUp}>
        <label>이메일</label>
        <input
          type="email"
          placeholder="입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ✅ 추가된 비밀번호 확인 입력란 */}
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="다시 입력"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignUpPage;
