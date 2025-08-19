"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeaderboard(data);
        }
      } catch (err) {
        console.error("Gagal ambil leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main style={{padding: '32px', maxWidth: '600px', margin: '40px auto', background:'#e3f2fd', borderRadius:24, boxShadow:'0 2px 16px rgba(33,150,243,0.07)'}}>
      <header style={{display:'flex',alignItems:'center',gap:16,padding:'24px 0',justifyContent:'center'}}>
        <Image src="/leaderboard.png" alt="Leaderboard" width={48} height={48} />
        <h1 style={{fontWeight:800,fontSize:32,color:'#2196f3',letterSpacing:1}}>Leaderboard</h1>
      </header>
      {leaderboard.length === 0 ? (
        <p style={{textAlign:'center',color:'#222',fontSize:18}}>Belum ada data leaderboard.</p>
      ) : (
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '24px', background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 8px rgba(33,150,243,0.08)'}}>
          <thead>
            <tr style={{background: '#2196f3', color: '#fff'}}>
              <th style={{padding: '16px',fontSize:18}}>Peringkat</th>
              <th style={{padding: '16px',fontSize:18}}>Nama</th>
              <th style={{padding: '16px',fontSize:18}}>Skor</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={user.id} style={{background: idx % 2 === 0 ? '#e3f2fd' : '#fff'}}>
                <td style={{padding: '14px', textAlign: 'center', fontWeight: 'bold', color:'#2196f3',fontSize:17}}>{idx + 1}</td>
                <td style={{padding: '14px', display:'flex',alignItems:'center',gap:8,fontSize:17}}>
                  <Image src="/user.png" alt="User" width={28} height={28} /> {user.username}
                </td>
                <td style={{padding: '14px', textAlign: 'center', color:'#43a047',fontWeight:700,fontSize:17}}>{user.skor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
