import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Firebase ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;

      // bannedUsers koleksiyonundan engelli e-postaları çek
      const bannedSnapshot = await getDocs(collection(db, 'bannedUsers'));
      const bannedEmails = bannedSnapshot.docs.map(doc => doc.data().email);

      // Eğer kullanıcı yasaklıysa çıkış yaptır ve uyarı ver
      if (bannedEmails.includes(userEmail)) {
        await signOut(auth);
        setError('Bu kullanıcı hesabı engellenmiştir.');
        return;
      }

      // Engelli değilse yönlendir
      navigate('/');

    } catch (err) {
      console.error('Giriş hatası:', err.message);
      setError('E-posta veya şifre yanlış!');
    }
  };

  return (
    <div className="login-container">
      <div className="wave-bg"></div>
      <div className="login-box">
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <div className="input-box">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
          <button type="submit" className="login-btn">Log In</button>
        </form>
        <div className="register-prompt">
          <span>Don't have an account?</span>
          <button onClick={() => navigate('/register')} className="register-btn">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
