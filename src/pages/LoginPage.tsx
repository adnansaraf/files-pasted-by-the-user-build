import React, { useState } from 'react';
import { Train, Shield, ArrowRight, Lock, User, MapPin, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, division, setDivision } = useApp();
  const [empId, setEmpId] = useState('RP-04821');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(empId);
  };

  return (
    <div className="login-screen">
      {/* Left Visual Railway Branding Panel */}
      <div className="login-art-panel">
        <div className="art-overlay" />
        <div className="art-content">
          <div className="art-brand-badge">
            <Train size={28} className="text-maroon-light" />
            <div className="brand-titles">
              <span className="brand-logo-text">SOLVEX</span>
              <span className="brand-subtext">INTELLIGENT RAILWAY MAINTENANCE BLOCK PLANNING</span>
            </div>
          </div>

          <div className="art-hero-text">
            <h2>Railway Operations Decision Support Platform</h2>
            <p>
              Coordinating multi-departmental maintenance possessions, train operations, and
              infrastructure availability across Palakkad Division (Southern Railway).
            </p>
          </div>

          {/* Schematic Graphic Track Silhouette */}
          <div className="track-art-visual">
            <svg viewBox="0 0 400 120" className="track-svg">
              <line x1="0" y1="40" x2="400" y2="40" stroke="#991b1b" strokeWidth="4" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#991b1b" strokeWidth="4" />
              {/* Sleepers */}
              {Array.from({ length: 25 }, (_, i) => (
                <line
                  key={i}
                  x1={i * 16 + 8}
                  y1="34"
                  x2={i * 16 + 8}
                  y2="66"
                  stroke="#ef4444"
                  strokeWidth="2"
                  opacity="0.6"
                />
              ))}
              <circle cx="60" cy="50" r="8" fill="#ffffff" stroke="#991b1b" strokeWidth="3" />
              <text x="60" y="85" fill="#fca5a5" fontSize="11" textAnchor="middle">PGT (0 km)</text>

              <circle cx="200" cy="50" r="8" fill="#ffffff" stroke="#991b1b" strokeWidth="3" />
              <text x="200" y="85" fill="#fca5a5" fontSize="11" textAnchor="middle">OTP (33 km)</text>

              <circle cx="340" cy="50" r="10" fill="#ffffff" stroke="#991b1b" strokeWidth="4" />
              <text x="340" y="85" fill="#fca5a5" fontSize="11" textAnchor="middle">SRR Jn (46 km)</text>
            </svg>
          </div>

          <div className="art-footer">
            <div className="sih-tag">
              Smart India Hackathon 2026 · Problem Statement 26027
            </div>
            <small>Prototype decision support system · Simulated data layer</small>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-box">
          <div className="login-header">
            <div className="auth-chip">
              <Shield size={14} className="text-maroon" />
              <span>OFFICIAL USE ONLY</span>
            </div>
            <h1>Planner Sign In</h1>
            <p>Access the divisional maintenance block optimization console.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label>Division & Zone</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <select
                  value={division}
                  onChange={e => setDivision(e.target.value)}
                >
                  <option value="Palakkad (PGT) · Southern Railway">
                    Palakkad Division (PGT) · Southern Railway
                  </option>
                  <option value="Thiruvananthapuram (TVC) · Southern Railway">
                    Thiruvananthapuram Division (TVC) · Southern Railway
                  </option>
                  <option value="Madurai (MDU) · Southern Railway">
                    Madurai Division (MDU) · Southern Railway
                  </option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Employee ID / Official Email</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. RP-04821 or planner.pgt@sr.railnet.gov.in"
                  value={empId}
                  onChange={e => setEmpId(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Authorization Passcode</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="Enter secure password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary login-btn">
              <span>Sign In to Control Desk</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="login-disclaimer">
            <AlertCircle size={14} className="text-muted flex-shrink-0" />
            <p>
              SolveX is an internal decision-support prototype for authorized railway planners.
              AI recommendations do not directly control railway signalling or interlocking and require
              human review and sign-off prior to block imposition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
