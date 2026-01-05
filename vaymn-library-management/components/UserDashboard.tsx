import React, { useState, useMemo } from 'react';
import { User, Book } from '../types';

interface UserDashboardProps {
  user: User;
  books: Book[];
  onIssueBook: (id: string) => void;
  onReIssueBook: (id: string) => void;
  onReserveBook: (id: string) => void;
  onGoHome: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, books, onIssueBook, onReIssueBook, onReserveBook }) => {
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const level = Math.floor((user.xp || 0) / 100) + 1;
  const xpInLevel = (user.xp || 0) % 100;

  const getLevelName = (lvl: number) => {
    const ranks = ["Amateur", "Novice", "Apprentice", "Scholar", "Bibliophile", "Archivist", "Researcher", "Sage", "Legend", "Grandmaster"];
    return ranks[Math.min(lvl - 1, 9)];
  };

  const categorizedBooks = useMemo(() => {
    const categories: Record<string, Book[]> = {};
    const safeBooks = Array.isArray(books) ? books : [];
    
    safeBooks.forEach(book => {
      const genre = book.genre || 'Other';
      if (!categories[genre]) categories[genre] = [];
      if (
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      ) {
        categories[genre].push(book);
      }
    });
    return Object.entries(categories).sort();
  }, [books, search]);

  const calculateDaysLeft = (date?: string) => {
    if (!date) return 0;
    const deadline = new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000);
    return Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-16 animate-spring">
      {/* Student Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 glass-panel p-12 rounded-[56px] flex flex-col md:flex-row items-center gap-12">
            <div className="w-32 h-32 bg-[#1F2A44] text-white rounded-[44px] flex flex-col items-center justify-center shadow-2xl relative group">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Rank</span>
               <span className="text-6xl font-black leading-none heading-serif">{level}</span>
               <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#5DA9E9] rounded-2xl flex items-center justify-center text-[11px] font-black shadow-lg group-hover:scale-110 transition-transform">XP</div>
            </div>
            <div className="flex-1 w-full text-center md:text-left">
               <p className="text-[10px] font-black text-[#5DA9E9] uppercase tracking-[0.4em] mb-2">Student Academic Rank</p>
               <h4 className="text-5xl font-bold text-[#1F2A44] mb-6 heading-serif">{getLevelName(level)}</h4>
               <div className="relative h-4 bg-slate-100/80 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div className="h-full bg-[#5DA9E9] progress-glow transition-all duration-1000" style={{ width: `${xpInLevel}%` }}></div>
               </div>
               <div className="flex justify-between px-1">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{xpInLevel} / 100 XP</span>
                  <span className="text-xs font-black text-[#5DA9E9] uppercase tracking-widest">{100 - xpInLevel} XP NEXT LEVEL</span>
               </div>
            </div>
         </div>
         <div className="lg:col-span-4 glass-panel p-12 rounded-[56px] flex flex-wrap gap-4 items-center justify-center">
            {(user.badges || []).map((b, i) => (
              <div key={i} className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-[#5DA9E9] border border-blue-50 hover:scale-110 hover:shadow-xl transition-all">
                <i className="fas fa-certificate text-3xl"></i>
              </div>
            ))}
            {(user.badges || []).length === 0 && (
              <div className="text-center opacity-40">
                <i className="fas fa-trophy text-4xl mb-4 text-slate-200"></i>
                <p className="text-xs font-black uppercase tracking-[0.2em]">Unlock Badges</p>
              </div>
            )}
         </div>
      </div>

      {/* Library Browser Component */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-1">
             <h2 className="text-4xl font-bold text-[#1F2A44] heading-serif tracking-tighter">Student Library</h2>
             <p className="text-xs font-black text-[#5DA9E9] uppercase tracking-[0.4em]">Browse Digital Collection</p>
           </div>
           <div className="relative w-full md:w-[450px]">
              <i className="fas fa-search absolute left-8 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Find titles, authors or ISBN..." 
                className="w-full pl-16 pr-10 py-5 bg-white rounded-[32px] border-2 border-transparent shadow-sm outline-none focus:ring-8 focus:ring-blue-50/50 focus:border-[#5DA9E9] transition-all font-semibold text-sm"
              />
           </div>
        </div>

        {categorizedBooks.map(([genre, items], gIdx) => (
          <section key={genre} className="stagger-item" style={{ animationDelay: `${gIdx * 0.1}s` }}>
             <div className="flex items-center gap-6 mb-10">
                <h3 className="text-2xl font-bold text-[#1F2A44] heading-serif tracking-tight">{genre}</h3>
                <div className="h-[2px] flex-1 bg-slate-100 rounded-full"></div>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
                {items.map((book, bIdx) => (
                  <div 
                    key={book.id} 
                    onClick={() => setSelectedBook(book)}
                    className="group cursor-pointer stagger-item"
                    style={{ animationDelay: `${(gIdx * 0.1) + (bIdx * 0.05)}s` }}
                  >
                     <div className="aspect-[3/4.5] overflow-hidden rounded-[40px] mb-5 relative shadow-xl transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] group-hover:-translate-y-4 border border-slate-100">
                        <img src={book.coverImage} className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000" alt={book.title} />
                        {!book.isAvailable && (
                          <div className="absolute inset-0 bg-[#1F2A44]/70 backdrop-blur-[3px] flex items-center justify-center p-6">
                             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-red-500 px-4 py-2 rounded-xl shadow-2xl">Checked Out</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <h5 className="font-bold text-base text-[#1F2A44] truncate heading-serif px-2">{book.title}</h5>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{book.author}</p>
                  </div>
                ))}
             </div>
          </section>
        ))}
      </div>

      {/* Book Interaction Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[500] bg-[#0B0F1A]/80 backdrop-blur-xl flex items-center justify-center p-8 animate-fade-in">
           <div className="bg-white rounded-[72px] w-full max-w-6xl flex flex-col md:flex-row overflow-hidden shadow-[0_100px_150px_rgba(0,0,0,0.5)] animate-spring">
              <div className="md:w-5/12 relative h-[400px] md:h-auto">
                 <img src={selectedBook.coverImage} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                 <button onClick={() => setSelectedBook(null)} className="absolute top-12 left-12 w-14 h-14 glass-panel text-[#1F2A44] rounded-2xl flex items-center justify-center hover:bg-[#1F2A44] hover:text-white transition-all shadow-2xl"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="flex-1 p-16 md:p-24 flex flex-col overflow-y-auto max-h-[90vh]">
                 <div className="flex gap-4 mb-10">
                    <span className="px-5 py-2 bg-blue-50 text-[#5DA9E9] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100">{selectedBook.genre}</span>
                    <span className="px-5 py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-100">{selectedBook.language}</span>
                 </div>
                 <h2 className="text-5xl md:text-6xl font-bold text-[#1F2A44] mb-4 heading-serif leading-none tracking-tighter">{selectedBook.title}</h2>
                 <p className="text-2xl font-bold text-[#5DA9E9] mb-12 tracking-tight">{selectedBook.author}</p>
                 <div className="flex-1 mb-16">
                    <p className="text-xl text-slate-500 font-medium leading-relaxed italic border-l-8 border-slate-50 pl-10">"{selectedBook.description}"</p>
                 </div>
                 
                 <div className="pt-12 border-t border-slate-50 flex gap-6">
                    {selectedBook.isAvailable ? (
                      <button onClick={() => { onIssueBook(selectedBook.id); setSelectedBook(null); }} className="flex-1 py-7 bg-[#1F2A44] text-white rounded-[32px] font-black uppercase tracking-[0.3em] shadow-[0_24px_48px_rgba(31,42,68,0.3)] hover:bg-[#2a3a5e] hover:-translate-y-1 transition-all active:scale-95">Issue to my account</button>
                    ) : selectedBook.issuedTo === user.libraryId ? (
                      <div className="flex-1 bg-blue-50/50 p-10 rounded-[48px] flex items-center justify-between border border-blue-100/50">
                         <div>
                            <p className="text-[10px] font-black text-[#5DA9E9] uppercase tracking-[0.4em] mb-2">Loan Expiry</p>
                            <p className="text-4xl font-bold text-[#1F2A44] tracking-tighter">{calculateDaysLeft(selectedBook.issuedDate)} Days Left</p>
                         </div>
                         <button onClick={() => { onReIssueBook(selectedBook.id); setSelectedBook(null); }} className="px-12 py-6 bg-white text-[#1F2A44] rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#5DA9E9] hover:text-white transition-all">Renew Assets</button>
                      </div>
                    ) : (
                      <button onClick={() => { onReserveBook(selectedBook.id); setSelectedBook(null); }} className="flex-1 py-7 bg-orange-500 text-white rounded-[32px] font-black uppercase tracking-[0.3em] shadow-[0_24px_48px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95">Join Priority Waitlist</button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
