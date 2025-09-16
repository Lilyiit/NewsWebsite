import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatarURL, setAvatarURL] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    try {
      // 🔍 Önce yasaklı e-postaları kontrol et
      const bannedSnapshot = await getDocs(collection(db, 'bannedUsers'));
      const bannedEmails = bannedSnapshot.docs.map(doc => doc.data().email);

      if (bannedEmails.includes(email)) {
        setError('Bu e-posta adresi engellenmiştir.');
        return;
      }

      // 🔐 Firebase Auth ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: avatarURL
      });

      // ✅ Başarılı kayıt sonrası login sayfasına yönlendir
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div className="input-box">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <label>Avatar URL</label>
            <input
              type="text"
              value={avatarURL}
              onChange={(e) => setAvatarURL(e.target.value)}
              placeholder="https://...(zorunlu değil)"
            />
          </div>

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
          <div className="input-box">
            <label>Password Again</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}

          <button type="submit" className="login-btn">Sign Up</button>
        </form>

        <div className="register-prompt">
          <span>Do you already have an account?</span>
          <button onClick={() => navigate('/login')} className="register-btn">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
