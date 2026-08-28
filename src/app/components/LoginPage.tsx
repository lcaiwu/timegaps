import { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

const imgIso = 'http://localhost:3845/assets/1f61db23844351aa183667b340c0b2a7a2c83cad.png';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const STORAGE_KEY = 'intellimagic_remembered_username';

  const [step, setStep] = useState<'username' | 'password'>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUsername, setRememberUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // On mount: restore saved username and check state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUsername(saved);
      setRememberUsername(true);
    }
  }, []);

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    if (rememberUsername) {
      localStorage.setItem(STORAGE_KEY, username.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setStep('password');
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    onLogin();
  }

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 48,
          backgroundColor: '#161616',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 16,
          flexShrink: 0,
        }}
      >
        {/* Hamburger */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
          aria-label="Open menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ display: 'block', width: 16, height: 1, backgroundColor: '#f4f4f4' }}
            />
          ))}
        </button>
        <span
          style={{
            color: '#f4f4f4',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '18px',
            letterSpacing: '0.1px',
          }}
        >
          IBM{' '}
          <span style={{ fontWeight: 600 }}>
            Z IntelliMagic Vision{step === 'password' ? ' for z/OS' : ''}
          </span>
        </span>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Left panel */}
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 40,
            width: 448,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {step === 'username' ? (
            /* ── USERNAME STEP ── */
            <>
              {/* Title + divider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                <div style={{ width: 275 }}>
                  <p
                    style={{
                      fontSize: 32,
                      fontWeight: 400,
                      lineHeight: '40px',
                      letterSpacing: 0,
                      color: '#161616',
                      margin: 0,
                    }}
                  >
                    Log in
                  </p>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: 0, width: 447 }} />
              </div>

              {/* Form fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Text input with label + forgot username link */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                        <label
                          htmlFor="username"
                          style={{ fontSize: 12, fontWeight: 400, lineHeight: '16px', letterSpacing: '0.32px', color: '#525252' }}
                        >
                          Continue with username
                        </label>
                        <a
                          href="#"
                          style={{ fontSize: 14, color: '#0f62fe', textDecoration: 'underline', lineHeight: '18px', letterSpacing: '0.16px' }}
                          onClick={(e) => e.preventDefault()}
                        >
                          Forgot username?
                        </a>
                      </div>
                      <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                          width: '100%',
                          height: 48,
                          backgroundColor: '#f4f4f4',
                          border: 'none',
                          borderBottom: '1px solid #8d8d8d',
                          padding: '0 16px',
                          fontSize: 14,
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          color: '#161616',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    {/* Continue button */}
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        height: 48,
                        backgroundColor: '#0f62fe',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontWeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 16px',
                      }}
                    >
                      Continue
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* Remember username checkbox */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberUsername}
                      onChange={(e) => setRememberUsername(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: '#0f62fe', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 14, color: '#161616', lineHeight: '18px', letterSpacing: '0.16px' }}>
                      Remember username
                    </span>
                  </label>
                </form>

                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: 0, width: 447 }} />
              </div>

              {/* Alternative logins */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 14, color: '#525252', lineHeight: '18px', letterSpacing: '0.16px', margin: 0 }}>
                  Alternative logins
                </p>
                <button
                  style={{
                    width: '100%',
                    height: 48,
                    backgroundColor: 'transparent',
                    color: '#0f62fe',
                    border: '1px solid #0f62fe',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                  }}
                  onClick={() => onLogin()}
                >
                  Log in with Windows
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            /* ── PASSWORD STEP ── */
            <>
              {/* Title + subtitle + divider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontSize: 32, fontWeight: 400, lineHeight: '40px', color: '#161616', margin: 0 }}>
                  Log in
                </p>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, lineHeight: '18px', letterSpacing: '0.16px', color: '#000000' }}>
                    Logging in as {username || 'geet_saini'}
                  </span>
                  <a
                    href="#"
                    style={{ fontSize: 14, color: '#0f62fe', textDecoration: 'underline', lineHeight: '18px', letterSpacing: '0.16px' }}
                    onClick={(e) => { e.preventDefault(); setStep('username'); }}
                  >
                    Not you?
                  </a>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: 0, width: 448 }} />

              {/* Password form */}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Password input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <label
                      htmlFor="password"
                      style={{ fontSize: 12, fontWeight: 400, lineHeight: '16px', letterSpacing: '0.32px', color: '#525252' }}
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      style={{ fontSize: 14, color: '#0f62fe', textDecoration: 'underline', lineHeight: '18px', letterSpacing: '0.16px' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: 48,
                        backgroundColor: '#f4f4f4',
                        border: 'none',
                        borderBottom: '1px solid #8d8d8d',
                        padding: '0 48px 0 16px',
                        fontSize: 14,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        color: '#161616',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: 48,
                        width: 48,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#525252',
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Log in button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    height: 48,
                    backgroundColor: '#0f62fe',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                  }}
                >
                  Log in
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right illustration */}
        <div
          style={{
            position: 'absolute',
            left: 512,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 800,
            height: 642,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <img
            alt=""
            src={imgIso}
            style={{
              position: 'absolute',
              top: 0,
              left: '-22.25%',
              width: '150.13%',
              height: '104.84%',
              maxWidth: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
