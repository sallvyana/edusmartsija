"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Page() {
  // Real-time stats dari Supabase
  const [stats, setStats] = useState({
    totalUsers: 0,
    quizTaken: 0,
    avgScore: 0,
    activePlayers: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ambil data dari table leaderboard
        const { data, error } = await supabase
          .from("leaderboard")
          .select("username, skor");

        if (error) {
          console.error("Error fetching stats:", error);
          setStats(prev => ({ ...prev, loading: false }));
          return;
        }

        if (!data) {
          setStats(prev => ({ ...prev, loading: false }));
          return;
        }

        const totalQuizzes = data.length;
        const uniqueUsers = new Set(data.map(d => d.username));
        const activePlayers = uniqueUsers.size;
        const avgScore = totalQuizzes > 0 
          ? Math.round((data.reduce((acc, d) => acc + (d.skor || 0), 0) / totalQuizzes) * 10) / 10
          : 0;

        setStats({
          totalUsers: activePlayers,
          quizTaken: totalQuizzes,
          avgScore: Math.round(avgScore),
          activePlayers: activePlayers,
          loading: false,
        });
      } catch (err) {
        console.error("Error:", err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    // Optional: Set interval untuk update real-time setiap 30 detik
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.main
      className={styles.main}
      style={{
        background: '#f5faff',
        minHeight: '100vh',
        paddingBottom: 64
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {/* Header Section */}
      <motion.header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '32px 0 16px 0',
          justifyContent: 'center'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <img 
          src="/logoutama.png" 
          alt="Logo utama" 
          style={{ height: 56 }} 
        />
        <h1 
          className={styles.title} 
          style={{
            color: '#2196f3',
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 1
          }}
        >
          edusijaexpert.<br />Quiz Challenge
        </h1>
      </motion.header>
      
      {/* Subtitle */}
      <motion.p
        className={styles.subtitle}
        style={{
          textAlign: 'center',
          fontSize: 20,
          color: '#222',
          marginBottom: 32
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Uji kemampuan programming Anda dengan pertanyaan pilihan ganda yang mencakup IoT, IaaS, PaaS, dan SaaS.
      </motion.p>

      {/* Category Section */}
      <motion.section
        className={styles.categorySection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 style={{
          color: '#2196f3',
          marginBottom: 24,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 26
        }}>
          Pilih Kategori Quiz
        </h2>
        
        <div 
          className={styles.categories} 
          style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            margin: '32px 0',
            flexWrap: 'wrap'
          }}
        >
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #2196f355' }} whileTap={{ scale: 0.97 }}>
            <Link 
              href="/quiz?category=iot" 
              className={styles.categoryBtn} 
              style={{
                background: '#e3f2fd',
                color: '#2196f3',
                border: '2px solid #2196f3',
                borderRadius: 12,
                padding: '24px 32px',
                fontWeight: 600,
                fontSize: 20,
                transition: '0.2s',
                boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'block',
                minWidth: 120,
                textAlign: 'center'
              }}
            >
              IoT
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>15 Soal</div>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #43a04755' }} whileTap={{ scale: 0.97 }}>
            <Link 
              href="/quiz?category=iaas" 
              className={styles.categoryBtn} 
              style={{
                background: '#e8f5e9',
                color: '#43a047',
                border: '2px solid #43a047',
                borderRadius: 12,
                padding: '24px 32px',
                fontWeight: 600,
                fontSize: 20,
                transition: '0.2s',
                boxShadow: '0 2px 8px rgba(67,160,71,0.08)',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'block',
                minWidth: 120,
                textAlign: 'center'
              }}
            >
              IaaS
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>15 Soal</div>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #2196f355' }} whileTap={{ scale: 0.97 }}>
            <Link 
              href="/quiz?category=paas" 
              className={styles.categoryBtn} 
              style={{
                background: '#e3f2fd',
                color: '#2196f3',
                border: '2px solid #2196f3',
                borderRadius: 12,
                padding: '24px 32px',
                fontWeight: 600,
                fontSize: 20,
                transition: '0.2s',
                boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'block',
                minWidth: 120,
                textAlign: 'center'
              }}
            >
              PaaS
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>15 Soal</div>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #43a04755' }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/quiz?category=saas" 
              className={styles.categoryBtn} 
              style={{
                background: '#e8f5e9',
                color: '#43a047',
                border: '2px solid #43a047',
                borderRadius: 12,
                padding: '24px 32px',
                fontWeight: 600,
                fontSize: 20,
                transition: '0.2s',
                boxShadow: '0 2px 8px rgba(67,160,71,0.08)',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'block',
                minWidth: 120,
                textAlign: 'center'
              }}
            >
              SaaS
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>15 Soal</div>
            </Link>
          </motion.div>
        </div>
        
        {/* Leaderboard Button */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link 
            href="/leaderboard" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '16px 32px',
              background: '#fff',
              color: '#2196f3',
              border: '2px solid #2196f3',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 18,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
              transition: 'all 0.2s'
            }}
          >
            🏆 Lihat Leaderboard
          </Link>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className={styles.statsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 style={{
          color: '#43a047',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 24,
          marginBottom: 32
        }}>
          Statistik Platform {stats.loading && <span style={{ fontSize: 14, color: '#999' }}>(Loading...)</span>}
        </h2>
        
        <div 
          className={styles.stats} 
          style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            margin: '32px 0',
            flexWrap: 'wrap'
          }}
        >
          <motion.div 
            whileHover={{ scale: 1.04 }} 
            whileTap={{ scale: 0.97 }} 
            style={{
              background: '#e3f2fd',
              color: '#2196f3',
              borderRadius: 12,
              padding: '24px 32px',
              fontWeight: 600,
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
              minWidth: 140,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
              {stats.loading ? '...' : stats.totalUsers}
            </div>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Total Users</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.04 }} 
            whileTap={{ scale: 0.97 }} 
            style={{
              background: '#e8f5e9',
              color: '#43a047',
              borderRadius: 12,
              padding: '24px 32px',
              fontWeight: 600,
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(67,160,71,0.08)',
              minWidth: 140,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
              {stats.loading ? '...' : stats.quizTaken}
            </div>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Quiz Taken</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.04 }} 
            whileTap={{ scale: 0.97 }} 
            style={{
              background: '#e3f2fd',
              color: '#2196f3',
              borderRadius: 12,
              padding: '24px 32px',
              fontWeight: 600,
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
              minWidth: 140,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
              {stats.loading ? '...' : `${stats.avgScore}`}
            </div>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Average Score</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.04 }} 
            whileTap={{ scale: 0.97 }} 
            style={{
              background: '#e8f5e9',
              color: '#43a047',
              borderRadius: 12,
              padding: '24px 32px',
              fontWeight: 600,
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(67,160,71,0.08)',
              minWidth: 140,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
              {stats.loading ? '...' : stats.activePlayers}
            </div>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>Active Players</p>
          </motion.div>
        </div>
        
        {!stats.loading && stats.quizTaken > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              textAlign: 'center',
              marginTop: 24,
              padding: 16,
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 12
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              📊 Data diperbarui secara real-time dari database
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ textAlign: 'center', marginTop: 48 }}
      >
        <h3 style={{
          color: '#666',
          fontWeight: 600,
          fontSize: 18,
          marginBottom: 16
        }}>
          Fitur Unggulan
        </h3>
        
        <div style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            maxWidth: 200
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <h4 style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 16,
              fontWeight: 600
            }}>
              Real-time Timer
            </h4>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              Waktu akurat dengan statistik live
            </p>
          </div>
          
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            maxWidth: 200
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🏆</div>
            <h4 style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 16,
              fontWeight: 600
            }}>
              Leaderboard
            </h4>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              Kompetisi dengan pemain lain
            </p>
          </div>
          
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            maxWidth: 200
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📚</div>
            <h4 style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 16,
              fontWeight: 600
            }}>
              Penjelasan Detail
            </h4>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              Belajar dari setiap jawaban
            </p>
          </div>
          
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            maxWidth: 200
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📱</div>
            <h4 style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 16,
              fontWeight: 600
            }}>
              Responsive Design
            </h4>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              Akses dari desktop & mobile
            </p>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
}