
import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage
    const data = localStorage.getItem('leaderboard');
    if (data) {
      const arr = JSON.parse(data);
      // Urutkan dari skor tertinggi
      arr.sort((a, b) => b.score - a.score);
      setLeaderboard(arr);
    }
  }, []);

  return (
    <main style={{padding: '32px', maxWidth: '500px', margin: '0 auto'}}>
      <header style={{display:'flex',alignItems:'center',gap:16,padding:'16px 0'}}>
        <img src="/leaderboard.png" alt="Leaderboard" style={{height:40}} />
        <h1 style={{fontWeight:700,fontSize:24,color:'var(--primary)'}}>Leaderboard</h1>
      </header>
      {leaderboard.length === 0 ? (
        <p>Belum ada data leaderboard.</p>
      ) : (
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '24px'}}>
          <thead>
            <tr style={{background: '#222', color: '#fff'}}>
              <th style={{padding: '12px', borderRadius: '8px 0 0 8px'}}>Peringkat</th>
              <th style={{padding: '12px'}}>Nama</th>
              <th style={{padding: '12px', borderRadius: '0 8px 8px 0'}}>Skor</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={user.name + idx} style={{background: idx % 2 === 0 ? '#f7f7f7' : '#fff'}}>
                <td style={{padding: '12px', textAlign: 'center', fontWeight: 'bold'}}>{idx + 1}</td>
                <td style={{padding: '12px', display:'flex',alignItems:'center',gap:8}}>
                  <img src="/user.png" alt="User" style={{height:28,marginRight:8}} />{user.name}
                </td>
                <td style={{padding: '12px', textAlign: 'center'}}>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
