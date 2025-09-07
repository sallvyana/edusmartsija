// Komponen LeaderboardTable sederhana
function LeaderboardTable() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // Ganti dengan API/DB sesuai kebutuhan, contoh pakai Supabase
        const { data: rows, error } = await supabase
          .from('leaderboard')
          .select('username, skor')
          .order('skor', { ascending: false });
        if (!error && rows) setData(rows);
      } catch (e) {
        setData([]);
      }
    }
    fetchLeaderboard();
  }, []);
  return (
    <table style={{width:'100%',background:'#fff',borderRadius:8,boxShadow:'0 2px 8px #2196f322',margin:'0 auto',fontSize:16}}>
      <thead>
        <tr style={{background:'#e3f2fd',color:'#222'}}>
          <th style={{padding:8}}>#</th>
          <th style={{padding:8}}>Nama</th>
          <th style={{padding:8}}>Skor</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr><td colSpan={3} style={{padding:16,textAlign:'center'}}>Belum ada data leaderboard.</td></tr>
        )}
        {data.map((row, i) => (
          <tr key={row.username+row.skor} style={{background:i%2?'#f7f7f7':'#fff'}}>
            <td style={{padding:8}}>{i+1}</td>
            <td style={{padding:8}}>{row.username}</td>
            <td style={{padding:8}}>{row.skor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { questions } from './questions'; // FIXED: Ubah dari './questions' menjadi sama dengan nama file
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
// ...existing code...

export default function QuizPage() {
  // State
  const [category, setCategory] = useState('');
  const [step, setStep] = useState(-1); // -1: input nama, 0+: soal
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakMax, setStreakMax] = useState(0);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [startTime, setStartTime] = useState(null); // FIXED: Timer berbasis Date.now()
  const timerRef = useRef();
  
  // State untuk review - TAMBAHAN BARU
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]); // Menyimpan jawaban user untuk setiap soal

  // Soal sesuai kategori
  const quizQuestions = category && questions[category] ? questions[category] : [];
  const current = quizQuestions[step];

  // Ambil kategori dari URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat && questions[cat]) setCategory(cat);
    }
  }, []);

  // FIXED: Timer akurat berbasis Date.now()
  useEffect(() => {
    if (step >= 0 && step < quizQuestions.length) {
      if (!startTime) {
        setStartTime(Date.now());
      }
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
        setSeconds(elapsed);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [step, quizQuestions.length, startTime]);

  // Reset timer saat mulai ulang kuis
  useEffect(() => {
    if (step === 0) {
      setSeconds(0);
      setStartTime(Date.now());
    }
  }, [step]);

  // Set background body khusus halaman quiz
  useEffect(() => {
    document.body.style.background = '#e3f2fd';
    return () => { document.body.style.background = ''; };
  }, []);

  // Jika kategori tidak valid atau tidak ada soal, tampilkan pesan error
  if (!category) {
    return (
      <main style={{padding: 32, textAlign: 'center'}}>
        <h2 style={{color: '#f44336'}}>Kategori tidak ditemukan</h2>
        <p>Silakan kembali ke halaman utama dan pilih kategori quiz.</p>
        <Link href="/" style={{color: '#2196f3', textDecoration: 'underline'}}>Kembali ke Home</Link>
      </main>
    );
  }
  if (quizQuestions.length === 0) {
    return (
      <main style={{padding: 32, textAlign: 'center'}}>
        <h2 style={{color: '#f44336'}}>Soal tidak ditemukan</h2>
        <p>Tidak ada soal untuk kategori ini. Silakan pilih kategori lain.</p>
        <Link href="/" style={{color: '#2196f3', textDecoration: 'underline'}}>Kembali ke Home</Link>
      </main>
    );
  }

  const handleAnswer = async (idx) => {
    setSelected(idx);
    setShowFeedback(true);
    
    // Hitung waktu per soal
    const timeForThisQuestion = startTime ? Math.floor((Date.now() - startTime) / 1000) - answerTimes.reduce((a,b) => a+b, 0) : 10;
    setAnswerTimes([...answerTimes, timeForThisQuestion]);
    
    // FIXED: Jawaban huruf (A/B/C/D) konsisten dengan questions.js
    const answerLetter = String.fromCharCode(65 + idx);
    const correct = answerLetter === current.answer;
    
    // Simpan jawaban user untuk review - TAMBAHAN BARU
    const newUserAnswers = [...userAnswers];
    newUserAnswers[step] = {
      questionIndex: step,
      selectedAnswer: answerLetter,
      selectedIndex: idx,
      isCorrect: correct,
      timeSpent: timeForThisQuestion
    };
    setUserAnswers(newUserAnswers);
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      if (streak + 1 > streakMax) setStreakMax(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowFeedback(false);
    setStep(step + 1);
  };

  return (
    <AnimatePresence mode="wait">
      {step === -1 && (
        <motion.div
          key="nama"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4, type: 'spring' }}
        >
          <NamaComponent
            name={name}
            setName={setName}
            error={error}
            setError={setError}
            setStep={setStep}
            category={category}
          />
        </motion.div>
      )}
      {step >= quizQuestions.length && (
        <motion.div
          key="selesai"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4, type: 'spring' }}
        >
          <SelesaiComponent
            name={name}
            score={score}
            category={category}
            quizQuestions={quizQuestions}
            setStep={setStep}
            setScore={setScore}
            setName={setName}
            setCategory={setCategory}
            setStreak={setStreak}
            setStreakMax={setStreakMax}
            setAnswerTimes={setAnswerTimes}
            setStartTime={setStartTime}
            totalSeconds={seconds}
            answerTimes={answerTimes}
            // Props untuk review - TAMBAHAN BARU
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            setShowReview={setShowReview}
            setReviewData={setReviewData}
          />
        </motion.div>
      )}
      {step >= 0 && step < quizQuestions.length && (
        <motion.div
          key={`soal-${step}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, type: 'spring' }}
        >
          <SoalComponent
            step={step}
            setStep={setStep}
            quizQuestions={quizQuestions}
            current={current}
            selected={selected}
            setSelected={setSelected}
            showFeedback={showFeedback}
            handleAnswer={handleAnswer}
            nextQuestion={nextQuestion}
            answerTimes={answerTimes}
            streak={streak}
            seconds={seconds}
          />
        </motion.div>
      )}
      
..      {/* Leaderboard langsung tampil di bawah tombol setelah quiz selesai */}
      {step >= quizQuestions.length && (
        <motion.div
          key="leaderboard"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4, type: 'spring' }}
          style={{marginTop: 32, textAlign: 'center'}}
        >
          <h2 style={{color:'#43a047',fontWeight:700,fontSize:24,marginBottom:16}}>Leaderboard</h2>
          <LeaderboardTable />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NamaComponent({ name, setName, error, setError, setStep, category }) {
  return (
    <main style={{
      padding: '32px',
      textAlign: 'center',
      maxWidth: '400px',
      margin: '0 auto',
      background: '#e3f2fd',
      color: '#222',
      borderRadius: '16px',
      boxShadow: '0 2px 16px rgba(33,150,243,0.07)'
    }}>
      <h1 style={{color: '#222'}}>Masukkan Nama Anda</h1>
      <p style={{color: '#666', marginBottom: 20}}>Kategori: <strong>{category?.toUpperCase()}</strong></p>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nama pemain"
        style={{padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #bbb', width: '100%', marginBottom: '16px', background: '#f7f7f7', color: '#222'}}
      />
      {error && <p style={{color: '#f44336'}}>{error}</p>}
      <button
        style={{padding: '12px 32px', background: '#222', color: '#fff', borderRadius: '8px', fontWeight: '600', fontSize: '1.1rem', cursor: 'pointer', border: 'none'}}
        onClick={() => {
          if (!name.trim()) {
            setError('Nama tidak boleh kosong!');
            return;
          }
          setStep(0);
        }}
      >Mulai Kuis</button>
    </main>
  );
}

function SelesaiComponent({ 
  name, 
  score, 
  category, 
  quizQuestions, 
  setStep, 
  setScore, 
  setName, 
  setCategory,
  setStreak,
  setStreakMax,
  setAnswerTimes,
  setStartTime,
  totalSeconds,
  answerTimes,
  // Props baru untuk review
  userAnswers,
  setUserAnswers,
  setShowReview,
  setReviewData
}) {
  // Status simpan ke Supabase
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedId, setSavedId] = useState(null);
  const savedOnce = useRef(false); // cegah double-insert

  // FIXED: Simpan ke table leaderboard (bukan scores)
  useEffect(() => {
    const save = async () => {
      if (!name || savedOnce.current) return;
      setSaving(true);
      setSaveError("");

      const payload = {
        username: name, // FIXED: Ganti dari 'name' ke 'username' sesuai API
        skor: score * 10, // FIXED: Skor dalam bentuk nilai (10 per benar)
        // Bisa tambahkan field lain jika diperlukan
      };

      const { data, error } = await supabase
        .from("leaderboard") // FIXED: Pakai table leaderboard
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        setSaveError(error.message);
      } else {
        setSavedId(data.id);
        savedOnce.current = true;
      }
      setSaving(false);
    };

    save();
  }, [name, score]);

  // Setup data review saat komponen dimuat - TAMBAHAN BARU
  useEffect(() => {
    if (userAnswers.length > 0 && quizQuestions.length > 0) {
      setReviewData({
        soalList: quizQuestions,
        jawabanUser: userAnswers
      });
    }
  }, [userAnswers, quizQuestions, setReviewData]);

  // Ambil statistik dari Supabase
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activePlayers: 0,
    avgScore: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Ambil data dari table leaderboard
      const { data, error } = await supabase
        .from("leaderboard")
        .select("username, skor");

      if (error) {
        console.error(error);
        return;
      }

      const totalQuizzes = data.length;
      const activePlayers = new Set(data.map((d) => d.username)).size;
      const avgScore = totalQuizzes
        ? Math.round(
            (data.reduce((acc, d) => acc + d.skor, 0) / totalQuizzes) 
          )
        : 0;

      setStats({ totalQuizzes, activePlayers, avgScore });
    };

    fetchStats();
  }, [savedId]);

  // Perhitungan UI
  const avgSeconds = answerTimes.length > 0 
    ? Math.round(answerTimes.reduce((a,b) => a+b, 0) / answerTimes.length) 
    : Math.round(totalSeconds / quizQuestions.length);

  const percent = Math.round((score / quizQuestions.length) * 100);
  let grade = "A";
  if (percent >= 90) grade = "A";
  else if (percent >= 80) grade = "B";
  else if (percent >= 70) grade = "C";
  else if (percent >= 60) grade = "D";
  else grade = "E";

  let badge = "";
  if (percent >= 95) badge = "Excellent!";
  else if (avgSeconds < 6) badge = "Speed Demon!";
  else if (avgSeconds < 10) badge = "Quick Thinker!";
  else badge = "Good Job!";

  // FIXED: Reset quiz function - DIPERBARUI UNTUK REVIEW
  const handleResetQuiz = () => {
    setStep(-1); // FIXED: Kembali ke input nama (bukan -2)
    setScore(0);
    setName("");
    setStreak(0);
    setStreakMax(0);
    setAnswerTimes([]);
    setStartTime(null);
    setUserAnswers([]); // Reset jawaban user
    setShowReview(false); // Tutup review
    setReviewData(null); // Hapus data review
    savedOnce.current = false; // Reset save status
  };

  // Fungsi untuk membuka review - TAMBAHAN BARU
  const handleShowReview = () => {
    setShowReview(true);
  };
  
  return (
    <main
      style={{
        padding: "32px",
        textAlign: "center",
        background: "#e3f2fd",
        color: "#222",
        borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(33,150,243,0.07)",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: "#222", fontWeight: 700 }}>Quiz Selesai!</h1>
        <p style={{ fontSize: "1.1rem", color: "#444" }}>Luar biasa! 🎉</p>
        <p style={{ color: "#666" }}>Kategori: <strong>{category?.toUpperCase()}</strong></p>

        {/* STATUS SIMPAN */}
        {saving && (
          <p style={{ color: "#222", marginTop: 8 }}>Menyimpan skor ke server…</p>
        )}
        {saveError && (
          <p style={{ color: "#f44336", marginTop: 8 }}>
            Gagal simpan skor: {saveError}
          </p>
        )}
        {savedId && (
          <p style={{ color: "#2e7d32", marginTop: 8 }}>
            Skor tersimpan ✓
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "24px 0",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "8px solid #222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {grade}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{percent}%</div>
          <div style={{ width: "100%", marginTop: 12 }}>
            <progress
              value={score}
              max={quizQuestions.length}
              style={{
                width: "100%",
                accentColor: "#222",
                background: "#eee",
                height: 8,
                borderRadius: 8,
              }}
            />
            <div style={{ fontSize: 14, color: "#444", marginTop: 4 }}>
              {score} dari {quizQuestions.length} benar
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            margin: "16px 0",
          }}
        >
          <span
            style={{
              padding: "8px 18px",
              background: "#ffe066",
              borderRadius: 24,
              fontWeight: 600,
              color: "#222",
              fontSize: 16,
            }}
          >
            {badge}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            {score}/{quizQuestions.length}
          </div>
          <div style={{ fontSize: 13, color: "#444" }}>Jawaban Benar</div>
        </div>
        <div style={{ flex: 1, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            {Math.floor(totalSeconds / 60)}:{(totalSeconds % 60).toString().padStart(2, "0")}
          </div>
          <div style={{ fontSize: 13, color: "#444" }}>Total Waktu</div>
        </div>
        <div style={{ flex: 1, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{avgSeconds}s</div>
          <div style={{ fontSize: 13, color: "#444" }}>Rata-rata per Soal</div>
        </div>
      </div>

      {/* TOMBOL AKSI - DIPERBARUI DENGAN REVIEW */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={handleResetQuiz}
          style={{
            padding: "12px 32px",
            background: "#222",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: "pointer",
            border: "none",
          }}
        >
          🔄 Ulangi Quiz
        </button>
        
  // ...existing code...
        
        <Link
          href="/"
          style={{
            padding: "12px 32px",
            background: "#eee",
            color: "#222",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.1rem",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          🏠 Pilih Kategori Lain
        </Link>
        <Link
          href="/leaderboard"
          style={{
            padding: "12px 32px",
            background: "#43a047",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.1rem",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          🏆 Leaderboard
        </Link>
      </div>

      <div style={{ marginTop: 32, textAlign: "left" }}>
        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Platform Statistics</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.activePlayers}</div>
            <div style={{ fontSize: 13, color: "#444" }}>Total Users</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.totalQuizzes}</div>
            <div style={{ fontSize: 13, color: "#444" }}>Quizzes Taken</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.avgScore}</div>
            <div style={{ fontSize: 13, color: "#444" }}>Average Score</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.activePlayers}</div>
            <div style={{ fontSize: 13, color: "#444" }}>Active Players</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SoalComponent({ step, setStep, quizQuestions, current, selected, setSelected, showFeedback, handleAnswer, nextQuestion, answerTimes, streak, seconds }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.35, type: 'spring' }}
      style={{
        padding: '32px',
        maxWidth: '500px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.95)',
        color: '#222',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(33,150,243,0.07)',
        position: 'relative'
      }}
    >
      {/* Statistik Live */}
      <div style={{position: 'fixed', left: 16, bottom: 16, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 18, minWidth: 120, zIndex: 10}}>
        <div style={{fontWeight: 700, fontSize: 15, marginBottom: 8}}>Statistik Live</div>
        <div style={{fontSize: 13, marginBottom: 4}}>Progress</div>
        <div style={{fontWeight: 600, fontSize: 15}}>{step + 1}/{quizQuestions.length} <span style={{fontSize: 12}}>({Math.round(((step + 1) / quizQuestions.length) * 100)}%)</span></div>
        <div style={{fontSize: 13, marginTop: 8}}>Waktu</div>
        <div style={{fontWeight: 600, fontSize: 15}}>{Math.floor(seconds/60)}:{(seconds%60).toString().padStart(2,'0')}</div>
        <div style={{fontSize: 13, marginTop: 8}}>Rata-rata</div>
        <div style={{fontWeight: 600, fontSize: 15}}>
          {answerTimes.length > 0
            ? `${Math.round(answerTimes.reduce((a,b) => a+b, 0) / answerTimes.length)}s/soal`
            : '0s/soal'}
        </div>
        <div style={{fontSize: 13, marginTop: 8}}>Streak</div>
        <div style={{fontWeight: 600, fontSize: 15}}>{streak} berturut-turut</div>
        <div style={{fontSize: 13, marginTop: 8}}>Kecepatan</div>
        <div style={{fontWeight: 600, fontSize: 15}}>{seconds/(step+1) < 7 && step > 0 ? 'Cepat' : 'Normal'}</div>
      </div>

      {/* Header progress dan timer */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
        <div style={{fontWeight: 600, fontSize: 16}}>Pertanyaan {step + 1} dari {quizQuestions.length}</div>
        <div style={{fontWeight: 600, fontSize: 16}}>{Math.floor(seconds/60)}:{(seconds%60).toString().padStart(2,'0')}</div>
      </div>
      <progress value={step + 1} max={quizQuestions.length} style={{width: '100%', accentColor: '#222', background: '#eee', height: 6, borderRadius: 8}} />
      <div style={{fontSize: 13, color: '#444', margin: '8px 0 18px 0'}}>{Math.round(((step + 1) / quizQuestions.length) * 100)}% selesai</div>

      <div style={{margin: '24px 0'}}>
        <strong style={{color: '#222', fontSize: 22}}>{current.question}</strong>
      </div>

      <div>
        {current.options.map((opt, idx) => {
          // FIXED: Tampilkan feedback visual saat showFeedback
          let buttonStyle = {
            display: 'block',
            width: '100%',
            marginBottom: '12px',
            padding: '16px',
            borderRadius: '8px',
            cursor: showFeedback ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            transition: 'background 0.2s, color 0.2s',
            textAlign: 'left',
            fontSize: 18,
            border: '2px solid',
          };

          if (showFeedback) {
            // Tampilkan jawaban yang benar dan salah
            const isCorrect = String.fromCharCode(65 + idx) === current.answer;
            const isSelected = selected === idx;
            
            if (isCorrect) {
              buttonStyle.background = '#c8e6c9';
              buttonStyle.color = '#2e7d32';
              buttonStyle.borderColor = '#4caf50';
            } else if (isSelected) {
              buttonStyle.background = '#ffcdd2';
              buttonStyle.color = '#d32f2f';
              buttonStyle.borderColor = '#f44336';
            } else {
              buttonStyle.background = '#f5f5f5';
              buttonStyle.color = '#666';
              buttonStyle.borderColor = '#ddd';
            }
          } else {
            // Style normal
            if (selected === idx) {
              buttonStyle.background = '#e3f2fd';
              buttonStyle.color = '#2196f3';
              buttonStyle.borderColor = '#2196f3';
            } else {
              buttonStyle.background = '#fff';
              buttonStyle.color = '#222';
              buttonStyle.borderColor = '#bbb';
            }
          }

          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97 }}
              whileHover={!showFeedback ? { scale: 1.03, boxShadow: '0 2px 12px #2196f355' } : {}}
              onClick={() => {
                if (!showFeedback) setSelected(idx);
              }}
              disabled={showFeedback}
              style={buttonStyle}
            >
              <span style={{fontWeight: 700, marginRight: 12}}>{String.fromCharCode(65 + idx)}</span> {opt}
            </motion.button>
          );
        })}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginTop:32}}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={step !== 0 && !showFeedback ? { scale: 1.04 } : {}}
          onClick={() => setStep(step > 0 ? step - 1 : 0)}
          disabled={step === 0 || showFeedback}
          style={{padding:'10px 28px',background:step === 0 ? '#eee' : '#43a047',color:step === 0 ? '#bbb' : '#fff',borderRadius:8,border:'none',fontWeight:'600',cursor:step === 0 ? 'not-allowed' : 'pointer',fontSize:16}}
        >Previous</motion.button>
        
        {!showFeedback && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={selected !== null ? { scale: 1.04 } : {}}
            onClick={() => selected !== null && handleAnswer(selected)}
            disabled={selected === null}
            style={{padding:'10px 28px',background:selected === null ? '#eee' : '#2196f3',color:selected === null ? '#bbb' : '#fff',borderRadius:8,border:'none',fontWeight:'600',cursor:selected === null ? 'not-allowed' : 'pointer',fontSize:16}}
          >Jawab</motion.button>
        )}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{marginTop: '18px'}}
        >
          <p style={{color: String.fromCharCode(65 + selected) === current.answer ? '#2e7d32' : '#f44336', fontWeight: 'bold'}}>
            {String.fromCharCode(65 + selected) === current.answer ? '✅ Jawaban Benar!' : '❌ Jawaban Salah!'}
          </p>
          <p style={{color: '#666', fontSize: 14, marginTop: 8}}>
            <strong>Jawaban yang benar:</strong> {current.answer}
          </p>
          <p style={{color: '#444', fontSize: 14, marginTop: 8}}>
            <strong>Penjelasan:</strong> {current.explanation}
          </p>
          <div style={{marginTop: '18px', textAlign:'right'}}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.04 }}
              onClick={nextQuestion}
              style={{padding: '10px 28px', background: '#2196f3', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display:'inline-flex',alignItems:'center',gap:8}}
            >
              {step + 1 < quizQuestions.length ? 'Selanjutnya →' : 'Lihat Hasil'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.main>
  );
}