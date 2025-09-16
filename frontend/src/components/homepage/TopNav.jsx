import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';
import Clock from './Clock';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function TopNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [agendaOpen, setAgendaOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const [healthOpen, setHealthOpen] = useState(false);
  const [sportsOpen, setSportsOpen] = useState(false);
  const [scienceOpen, setScienceOpen] = useState(false);

  const dropdownRef = useRef();
  const refs = {
    agenda: useRef(),
    tech: useRef(),
    health: useRef(),
    sports: useRef(),
    science: useRef(),
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (refs.agenda.current && !refs.agenda.current.contains(event.target)) {
        setAgendaOpen(false);
      }
      if (refs.tech.current && !refs.tech.current.contains(event.target)) {
        setTechOpen(false);
      }
      if (refs.health.current && !refs.health.current.contains(event.target)) {
        setHealthOpen(false);
      }
      if (refs.sports.current && !refs.sports.current.contains(event.target)) {
        setSportsOpen(false);
      }
      if (refs.science.current && !refs.science.current.contains(event.target)) {
        setScienceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  const isAdmin = ['admin@yynews.com', 'admin2@yynews.com'].includes(user?.email);

  return (
    <nav className="top-nav">
      <div className="container nav-inner">
        <Clock />

        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="blue">YY</span><span className="red">News</span>
        </div>

        <ul className="nav-links">
          {/* Agenda */}
          <li className="dropdown-parent" ref={refs.agenda}>
            <span onClick={() => setAgendaOpen(prev => !prev)} className="clickable-link">Agenda</span>
            {agendaOpen && (
              <ul className="dropdown-submenu">
                <li onClick={() => navigate('/tags?tag=politics')}>Politics</li>
                <li onClick={() => navigate('/tags?tag=economy')}>Economy</li>
              </ul>
            )}
          </li>

          {/* Technology */}
          <li className="dropdown-parent" ref={refs.tech}>
            <span onClick={() => setTechOpen(prev => !prev)} className="clickable-link">Technology</span>
            {techOpen && (
              <ul className="dropdown-submenu">
                <li onClick={() => navigate('/tags?tag=mobile')}>Mobile</li>
                <li onClick={() => navigate('/tags?tag=gadget')}>Gadget</li>
              </ul>
            )}
          </li>

          {/* Health */}
          <li className="dropdown-parent" ref={refs.health}>
            <span onClick={() => setHealthOpen(prev => !prev)} className="clickable-link">Health</span>
            {healthOpen && (
              <ul className="dropdown-submenu">
                <li onClick={() => navigate('/tags?tag=nutrition')}>Nutrition</li>
                <li onClick={() => navigate('/tags?tag=mental')}>Mental</li>
                <li onClick={() => navigate('/tags?tag=fitness')}>Fitness</li>
              </ul>
            )}
          </li>

          {/* Sports */}
          <li className="dropdown-parent" ref={refs.sports}>
            <span onClick={() => setSportsOpen(prev => !prev)} className="clickable-link">Sports</span>
            {sportsOpen && (
              <ul className="dropdown-submenu">
                <li onClick={() => navigate('/tags?tag=football')}>Football</li>
                <li onClick={() => navigate('/tags?tag=basketball')}>Basketball</li>
                <li onClick={() => navigate('/tags?tag=esports')}>eSports</li>
              </ul>
            )}
          </li>

          {/* Science */}
          <li className="dropdown-parent" ref={refs.science}>
            <span onClick={() => setScienceOpen(prev => !prev)} className="clickable-link">Science</span>
            {scienceOpen && (
              <ul className="dropdown-submenu">
                <li onClick={() => navigate('/tags?tag=space')}>Space</li>
                <li onClick={() => navigate('/tags?tag=plants')}>Plants</li>
                <li onClick={() => navigate('/tags?tag=environment')}>Environment</li>
              </ul>
            )}
          </li>
        </ul>

        {/* USER/ADMIN */}
        <div className="auth-buttons">
          {user ? (
            <>
              <div className="user-info-dropdown" ref={dropdownRef}>
                <img
                  src={user.photoURL || '/default-avatar.png'}
                  alt="avatar"
                  className="nav-avatar"
                />
                <div className="user-clickable-area" onClick={() => setDropdownOpen(prev => !prev)}>
                  <span className="user-name">{user.displayName || user.email}</span>
                </div>

                {isAdmin && dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => {
                      navigate('/admin/add-news');
                      setDropdownOpen(false);
                    }}>
                      Haber Ekle
                    </button>
                    <button onClick={() => {
                      navigate('/admin/moderation');
                      setDropdownOpen(false);
                    }}>
                      Yorumları Yönet
                    </button>
                  </div>
                )}
              </div>

              <button className="login-btn" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
              <button className="signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
