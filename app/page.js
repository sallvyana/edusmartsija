import Image from "next/image";
import styles from "./page.module.css";


export default function Home() {
  return (
    <main className={styles.main}>
      <header style={{display:'flex',alignItems:'center',gap:16,padding:'16px 0'}}>
        <img src="/logoutama.png" alt="Logo utama" style={{height:48}} />
        <h1 className={styles.title} style={{color:'var(--primary)'}}>edusijaexpert.<br />Quiz Challenge</h1>
      </header>
      <p className={styles.subtitle}>
        Uji kemampuan programming Anda dengan 25 pertanyaan pilihan ganda yang mencakup IoT, IaaS, PaaS, dan SaaS.
      </p>
      <div className={styles.features}>
        <div>
          <h3>Materi Komprehensif</h3>
          <p>Pertanyaan seputar IoT, IaaS, PaaS, dan SaaS.</p>
        </div>
        <div>
          <h3>Tanpa Batas Waktu</h3>
          <p>Kerjakan dengan santai, fokus pada pemahaman.</p>
        </div>
        <div>
          <h3>Feedback Instan</h3>
          <p>Dapatkan penjelasan untuk setiap jawaban.</p>
        </div>
        <div>
          <h3>Tingkatkan Skill</h3>
          <p>Asah kemampuan programming Anda.</p>
        </div>
      </div>
      <section className={styles.categorySection}>
        <h2>Kategori Quiz</h2>
        <div className={styles.categories} style={{display:'flex',gap:32,justifyContent:'center',margin:'32px 0'}}>
          <Link href="/quiz?category=iot" className={styles.categoryBtn} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <img src="/iot.png" alt="IoT" style={{height:40}} />IoT
          </Link>
          <Link href="/quiz?category=iaas" className={styles.categoryBtn} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <img src="/iaas.png" alt="IaaS" style={{height:40}} />IaaS
          </Link>
          <Link href="/quiz?category=paas" className={styles.categoryBtn} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <img src="/paas.png" alt="PaaS" style={{height:40}} />PaaS
          </Link>
          <Link href="/quiz?category=saas" className={styles.categoryBtn} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <img src="/saas.png" alt="SaaS" style={{height:40}} />SaaS
          </Link>
        </div>
      </section>
      <button className={styles.startBtn}>
        <Link href="/quiz">Mulai Quiz</Link>
      </button>
      <section className={styles.statsSection}>
        <h2>Platform Statistics</h2>
        <div className={styles.stats}>
          <div>
            <span>14</span>
            <p>Total Users</p>
          </div>
          <div>
            <span>15</span>
            <p>Quiz Taken</p>
          </div>
          <div>
            <span>72%</span>
            <p>Average Score</p>
          </div>
          <div>
            <span>14</span>
            <p>Active Players</p>
          </div>
        </div>
      </section>
    </main>
  );
}
