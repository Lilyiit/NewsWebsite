import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './ModerationPanel.css';

const allowedAdmins = ['admin@yynews.com', 'admin2@yynews.com'];

function ModerationPanel() {
  const [deletedComments, setDeletedComments] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const navigate = useNavigate();

  // 👮‍♂️ Admin kontrolü
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !allowedAdmins.includes(user.email)) {
        navigate('/');
      } else {
        setCurrentUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // 🔁 Silinen yorumlar gerçek zamanlı çekiliyor
    const deletedUnsub = onSnapshot(
      collection(db, 'deletedcomments'),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDeletedComments(list);
        localStorage.setItem('cachedDeletedComments', JSON.stringify(list)); // isteğe bağlı
      }
    );

    // ❄️ Banned kullanıcılar sadece cache'den
    const bannedCache = localStorage.getItem('cachedBannedUsers');
    if (bannedCache) {
      setBannedUsers(JSON.parse(bannedCache));
    } else {
      const bannedUnsub = onSnapshot(
        collection(db, 'bannedusers'),
        (snapshot) => {
          const emails = snapshot.docs.map(doc => doc.data().email);
          setBannedUsers(emails);
          localStorage.setItem('cachedBannedUsers', JSON.stringify(emails));
        }
      );
      return () => {
        bannedUnsub();
        deletedUnsub();
      };
    }

    // sadece silinen yorumlar unsub edilirse
    return () => deletedUnsub();
  }, []);

  // 🚫 Kullanıcıyı yasakla
  const handleBanUser = async (email) => {
    if (!window.confirm(`${email} kullanıcısını engellemek istiyor musunuz?`)) return;

    try {
      await addDoc(collection(db, 'bannedUsers'), {
        email,
        bannedAt: serverTimestamp(),
        reason: 'Admin tarafından yasaklandı',
      });

      localStorage.removeItem('cachedBannedUsers');
    } catch (err) {
      console.error('Ban işlemi hatası:', err);
    }
  };

  // ♻️ Cache temizleme
  const handleClearCache = () => {
    const confirmClear = window.confirm("Tüm localStorage verilerini silmek istiyor musunuz?");
    if (confirmClear) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="moderation-panel">
      {/* ✅ Sadece admin görebilir */}
      {allowedAdmins.includes(currentUserEmail) && (
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <button onClick={handleClearCache} className="clear-cache-button">
            ♻️ Cache’i Sıfırla
          </button>
        </div>
      )}

      <h2>🛑 Deleted Comments</h2>
      <ul>
        {deletedComments.map((c) => (
          <li key={c.id} className="comment-box deleted">
            <div>
              <strong>{c.username || c.email}</strong>: {c.text}
              <div className="reason">Reason: {c.reason || 'Inappropriate content'}</div>
            </div>
            {!bannedUsers.includes(c.email) && (
              <button onClick={() => handleBanUser(c.email)}>
                Ban User
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ModerationPanel;
