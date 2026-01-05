import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthScreenProps {
  mode: 'LOGIN' | 'SIGNUP';
  role: UserRole;
  onLogin: (id: string, pass: string, role: UserRole) => void;
  onSignup: (user: User) => void;
  onBackToHome: () => void;
  onToggleSignup: () => void;
  onBackToLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ 
  mode, role, onLogin, onSignup, onBackToHome, onToggleSignup, onBackToLogin 
}) => {
  const [libId, setLibId] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'LOGIN') {
      onLogin(libId, pass, role);
    } else {
      if (!libId || !pass || !name || !email) {
        alert("Please fill all required fields.");
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        libraryId: libId,
        password: pass,
        email,
        role,
        xp: 0,
        badges: [],
      };
      onSignup(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F9FC] animate-spring">
      <div className="bg-white p-12 rounded-[56px] shadow-2xl w-full max-w-xl border border-slate-100">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={mode === 'SIGNUP' ? onBackToLogin : onBackToHome}
            className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-[#5DA9E9] hover:bg-blue-50 rounded-2xl transition-all"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-[#1F2A44] heading-serif">
              {mode === 'LOGIN' ? `${role === 'ADMIN' ? 'Admin' : 'Student'} Login` : 'Register Account'}
            </h2>
            <p className="text-[10px] text-[#5DA9E9] uppercase tracking-[0.3em] font-black">VAYMN GATEWAY</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'SIGNUP' && (
            <div className="animate-spring">
              <label className="block text-xs font-black text-[#1F2A44] uppercase tracking-widest mb-2 px-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:ring-4 focus:ring-blue-50 focus:border-[#5DA9E9] focus:bg-white transition-all outline-none font-semibold text-[#1F2A44]"
                placeholder="Ex. Yash Kekan"
              />
            </div>
          )}

          {mode === 'SIGNUP' && (
            <div className="animate-spring" style={{ animationDelay: '0.05s' }}>
              <label className="block text-xs font-black text-[#1F2A44] uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:ring-4 focus:ring-blue-50 focus:border-[#5DA9E9] focus:bg-white transition-all outline-none font-semibold text-[#1F2A44]"
                placeholder="hello@vaymn.com"
              />
            </div>
          )}

          <div className="animate-spring" style={{ animationDelay: '0.1s' }}>
            <label className="block text-xs font-black text-[#1F2A44] uppercase tracking-widest mb-2 px-1">Library ID</label>
            <input 
              type="text" 
              value={libId}
              onChange={(e) => setLibId(e.target.value)}
              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:ring-4 focus:ring-blue-50 focus:border-[#5DA9E9] focus:bg-white transition-all outline-none font-semibold text-[#1F2A44]"
              placeholder="Enter ID (Ex. PP1707)"
            />
          </div>

          <div className="animate-spring" style={{ animationDelay: '0.15s' }}>
            <label className="block text-xs font-black text-[#1F2A44] uppercase tracking-widest mb-2 px-1">Authentication Key</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] focus:ring-4 focus:ring-blue-50 focus:border-[#5DA9E9] focus:bg-white transition-all outline-none font-semibold text-[#1F2A44]"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-[#1F2A44] hover:bg-slate-800 text-white rounded-[28px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.96] mt-8"
          >
            {mode === 'LOGIN' ? 'Authorize Access' : 'Create Profile'}
          </button>
        </form>

        <div className="mt-12 text-center">
          {mode === 'LOGIN' ? (
            <p className="text-[#1F2A44] text-sm font-medium opacity-60">
              New to the library? {' '}
              <button onClick={onToggleSignup} className="text-[#5DA9E9] font-black hover:underline tracking-tight">Register Portal Account</button>
            </p>
          ) : (
            <p className="text-[#1F2A44] text-sm font-medium opacity-60">
              Returning student? {' '}
              <button onClick={onBackToLogin} className="text-[#5DA9E9] font-black hover:underline tracking-tight">Secure Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
