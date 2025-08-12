
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main} style={{background:'#f5faff',minHeight:'100vh',paddingBottom:64}}>
      <header style={{display:'flex',alignItems:'center',gap:16,padding:'32px 0 16px 0',justifyContent:'center'}}>
        <img src="/logoutama.png" alt="Logo utama" style={{height:56}} />
        <h1 className={styles.title} style={{color:'#2196f3',fontWeight:800,fontSize:32,letterSpacing:1}}>edusijaexpert.<br />Quiz Challenge</h1>
      </header>
      <p className={styles.subtitle} style={{textAlign:'center',fontSize:20,color:'#222',marginBottom:32}}>
        Uji kemampuan programming Anda dengan 25 pertanyaan pilihan ganda yang mencakup IoT, IaaS, PaaS, dan SaaS.
      </p>
      <section className={styles.categorySection}>
        <h2 style={{color:'#2196f3',marginBottom:24,textAlign:'center',fontWeight:700,fontSize:26}}>Pilih Kategori Quiz</h2>
        <div className={styles.categories} style={{display:'flex',gap:32,justifyContent:'center',margin:'32px 0'}}>
          <Link href="/quiz?category=iot" className={styles.categoryBtn} style={{background:'#e3f2fd',color:'#2196f3',border:'2px solid #2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(33,150,243,0.08)',textDecoration:'none',cursor:'pointer'}}>IoT</Link>
          <Link href="/quiz?category=iaas" className={styles.categoryBtn} style={{background:'#e8f5e9',color:'#43a047',border:'2px solid #43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(67,160,71,0.08)',textDecoration:'none',cursor:'pointer'}}>IaaS</Link>
          <Link href="/quiz?category=paas" className={styles.categoryBtn} style={{background:'#e3f2fd',color:'#2196f3',border:'2px solid #2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(33,150,243,0.08)',textDecoration:'none',cursor:'pointer'}}>PaaS</Link>
          <Link href="/quiz?category=saas" className={styles.categoryBtn} style={{background:'#e8f5e9',color:'#43a047',border:'2px solid #43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,transition:'0.2s',boxShadow:'0 2px 8px rgba(67,160,71,0.08)',textDecoration:'none',cursor:'pointer'}}>SaaS</Link>
        </div>
      </section>
      <section className={styles.statsSection}>
        <h2 style={{color:'#43a047',textAlign:'center',fontWeight:700,fontSize:24}}>Statistik Platform</h2>
        <div className={styles.stats} style={{display:'flex',gap:32,justifyContent:'center',margin:'32px 0'}}>
          <div style={{background:'#e3f2fd',color:'#2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(33,150,243,0.08)'}}>
            <span>14</span>
            <p>Total Users</p>
          </div>
          <div style={{background:'#e8f5e9',color:'#43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(67,160,71,0.08)'}}>
            <span>15</span>
            <p>Quiz Taken</p>
          </div>
          <div style={{background:'#e3f2fd',color:'#2196f3',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(33,150,243,0.08)'}}>
            <span>72%</span>
            <p>Average Score</p>
          </div>
          <div style={{background:'#e8f5e9',color:'#43a047',borderRadius:12,padding:'24px 32px',fontWeight:600,fontSize:20,boxShadow:'0 2px 8px rgba(67,160,71,0.08)'}}>
            <span>14</span>
            <p>Active Players</p>
          </div>
        </div>
      </section>
    </main>
  );
}

