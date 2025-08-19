"use client";

import Image from 'next/image';
import Link from 'next/link';
import { questions } from './questions';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/lib/supabaseClient";

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
  const timerRef = useRef();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState(1);
  const [jawaban, setJawaban] = useState("");
  const [hasil, setHasil] = useState(null);

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

  // Timer berjalan saat kuis aktif
  useEffect(() => {
    if (step >= 0 && step < quizQuestions.length) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [step, quizQuestions.length]);

  // Reset timer saat mulai ulang kuis
  useEffect(() => {
    if (step === 0) setSeconds(0);
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
    setAnswerTimes([...answerTimes, seconds]);
    // Jawaban huruf (A/B/C/D)
    const answerLetter = String.fromCharCode(65 + idx);
    let correct = false;
    try {
      const res = await fetch('/api/cekjawaban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, number: step + 1, answer: answerLetter })
      });
      const data = await res.json();
      correct = data.status === 'benar';
    } catch (e) {
      // Fallback: current.answer bisa string/huruf
      correct = answerLetter === current.answer || idx === current.answer;
    }
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

  // Handle submit function
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/cekjawaban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          category,
          number,
          jawaban,
        }),
      });

      const data = await res.json();
      setHasil(data);
    } catch (err) {
      console.error("Error submit:", err);
    }
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
    </AnimatePresence>
  );
}

// KategoriComponent dihapus, pemilihan kategori hanya di home page

function NamaComponent({ name, setName, error, setError, setStep }) {
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

function SelesaiComponent({ name, score, category, quizQuestions, setStep, setScore, setName, setCategory }) {
  // ⬇️ STATUS SIMPAN KE SUPABASE
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedId, setSavedId] = useState(null);
  const savedOnce = useRef(false); // cegah double-insert (StrictMode dll)

  // ⬇️ SIMPAN SCORE SEKALI SAJA SAAT HALAMAN "SELESAI" MUNCUL
  useEffect(() => {
    const save = async () => {
      if (!name || savedOnce.current) return;
      setSaving(true);
      setSaveError("");

      const payload = {
        name,
        category,
        score,
        total: quizQuestions.length,
        // kamu boleh tambahkan kolom lain jika tabelnya punya, misal:
        // took_seconds: totalSeconds, etc.
      };

      const { data, error } = await supabase
        .from("scores")
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
    // dependency berisi nilai final hasil kuis
  }, [name, score, category, quizQuestions.length]);

  // ⬇️ AMBIL STATISTIK DARI SUPABASE (GANTI SIMULASI)
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activePlayers: 0,
    avgScore: 0, // rata2 (%) dari score/total * 100
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Ambil kolom yang dibutuhkan saja biar ringan
      const { data, error } = await supabase
        .from("scores")
        .select("name, score, total");

      if (error) {
        // Kalau error, biarin dulu UI tetap jalan
        console.error(error);
        return;
      }

      const totalQuizzes = data.length;
      const activePlayers = new Set(data.map((d) => d.name)).size;
      const avgScore = totalQuizzes
        ? Math.round(
            (data.reduce((acc, d) => acc + d.score / d.total, 0) / totalQuizzes) *
              100
          )
        : 0;

      setStats({ totalQuizzes, activePlayers, avgScore });
    };

    fetchStats();
    // panggil ulang setelah berhasil simpan (savedId berubah)
  }, [savedId]);

  // ⬇️ PERHITUNGAN UI (masih sama seperti punyamu)
  const totalSeconds = quizQuestions.length * 5 + Math.floor(Math.random() * 30); // masih simulasi
  const avgSeconds = Math.round(totalSeconds / quizQuestions.length);

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

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => {
            setStep(-2);
            setScore(0);
            setName("");
            setCategory("");
          }}
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
          Ulangi Quiz
        </button>
        <button
          onClick={() => alert("Fitur review jawaban belum tersedia.")}
          style={{
            padding: "12px 32px",
            background: "#eee",
            color: "#222",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: "pointer",
            border: "none",
          }}
        >
          Review Jawaban
        </button>
        <a
          href="/leaderboard"
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
          Leaderboard
        </a>
      </div>

      <div style={{ marginTop: 32, textAlign: "left" }}>
        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Platform Statistics</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.activePlayers}</div>
            <div style={{ fontSize: 13, color: "#444" }}>Total Users</div>
          </div>
          <div style={{ flex: 1, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.totalQuizzes}</div>
            <div style={{ fontSize: 13, color: "#444" }}>Quizzes Taken</div>
          </div>
          <div style={{ flex: 1, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.avgScore}%</div>
            <div style={{ fontSize: 13, color: "#444" }}>Average Score</div>
          </div>
          <div style={{ flex: 1, background: "#f7f7f7", borderRadius: 12, padding: 16 }}>
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
        {current.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.97 }}
            whileHover={!showFeedback ? { scale: 1.03, boxShadow: '0 2px 12px #2196f355' } : {}}
            onClick={() => {
              if (!showFeedback) setSelected(idx);
            }}
            disabled={showFeedback}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '12px',
              padding: '16px',
              background: selected === idx ? '#e3f2fd' : '#fff',
              color: selected === idx ? '#2196f3' : '#222',
              borderRadius: '8px',
              border: selected === idx ? '2px solid #2196f3' : '1px solid #bbb',
              cursor: showFeedback ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'background 0.2s, color 0.2s',
              textAlign: 'left',
              fontSize: 18
            }}
          >
            <span style={{fontWeight: 700, marginRight: 12}}>{String.fromCharCode(65 + idx)}</span> {opt}
          </motion.button>
        ))}
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
          <p style={{color: selected === current.answer ? '#222' : '#f44336', fontWeight: 'bold'}}>
            {selected === current.answer ? 'Jawaban Benar!' : 'Jawaban Salah!'}
          </p>
          <small style={{color: '#444'}}>{current.explanation}</small>
          <div style={{marginTop: '18px', textAlign:'right'}}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.04 }}
              onClick={nextQuestion}
              style={{padding: '10px 28px', background: '#2196f3', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display:'inline-flex',alignItems:'center',gap:8}}
            >
              Selanjutnya
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.main>
  );
}