import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.main
      className={styles.main}
      style={{background:'#f5faff',minHeight:'100vh',paddingBottom:64}}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <motion.header
        style={{display:'flex',alignItems:'center',gap:16,padding:'32px 0 16px 0',justifyContent:'center'}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <img src="/logoutama.png" alt="Logo utama" style={{height:56}} />
        <h1 className={styles.title} style={{color:'#2196f3',fontWeight:800,fontSize:32,letterSpacing:1}}>edusijaexpert.<br />Quiz Challenge</h1>
      </motion.header>
      <motion.p
        className={styles.subtitle}
        style={{textAlign:'center',fontSize:20,color:'#222',marginBottom:32}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Uji kemampuan programming Anda dengan 25 pertanyaan pilihan ganda yang mencakup IoT, IaaS, PaaS, dan SaaS.
      </motion.p>
      <motion.section
        className={styles.categorySection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 style={{color:'#2196f3',marginBottom:24,textAlign:'center',fontWeight:700,fontSize:26}}>Pilih Kategori Quiz</h2>
        <div className={styles.categories} style={{display:'flex',gap:32,justifyContent:'center',margin:'32px 0'}}>
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #2196f355' }} whileTap={{ scale: 0.97 }}>
            <Link href="/quiz?category=iot" className={styles.categoryBtn} style={{background:'#e3f2fd',color:'#2196f3',border:'2px solid #2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(33,150,243,0.08)',textDecoration:'none',cursor:'pointer'}}>IoT</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #43a04755' }} whileTap={{ scale: 0.97 }}>
            <Link href="/quiz?category=iaas" className={styles.categoryBtn} style={{background:'#e8f5e9',color:'#43a047',border:'2px solid #43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(67,160,71,0.08)',textDecoration:'none',cursor:'pointer'}}>IaaS</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #2196f355' }} whileTap={{ scale: 0.97 }}>
            <Link href="/quiz?category=paas" className={styles.categoryBtn} style={{background:'#e3f2fd',color:'#2196f3',border:'2px solid #2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(33,150,243,0.08)',textDecoration:'none',cursor:'pointer'}}>PaaS</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #43a04755' }} whileTap={{ scale: 0.97 }}>
            <Link href="/quiz?category=saas" className={styles.categoryBtn} style={{background:'#e8f5e9',color:'#43a047',border:'2px solid #43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(67,160,71,0.08)',textDecoration:'none',cursor:'pointer'}}>SaaS</Link>
          </motion.div>
        </div>
      </motion.section>
      <motion.section
        className={styles.statsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 style={{color:'#43a047',textAlign:'center',fontWeight:700,fontSize:24}}>Statistik Platform</h2>
        <div className={styles.stats} style={{display:'flex',gap:32,justifyContent:'center',margin:'32px 0'}}>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{background:'#e3f2fd',color:'#2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(33,150,243,0.08)'}}>
            <span>14</span>
            <p>Total Users</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{background:'#e8f5e9',color:'#43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(67,160,71,0.08)'}}>
            <span>15</span>
            <p>Quiz Taken</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{background:'#e3f2fd',color:'#2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(33,150,243,0.08)'}}>
            <span>72%</span>
            <p>Average Score</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{background:'#e8f5e9',color:'#43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(67,160,71,0.08)'}}>
            <span>14</span>
            <p>Active Players</p>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
}

