
const quizData = {
  iot: [
    { answer: 'C', explanation: 'IoT adalah singkatan dari Internet of Things.' },
    { answer: 'B', explanation: 'Smartwatch adalah contoh perangkat IoT.' },
    { answer: 'A', explanation: 'Komponen utama IoT: Sensor, Aktuator, dan Jaringan.' },
    { answer: 'B', explanation: 'Tujuan utama IoT: Menghubungkan perangkat ke internet untuk mengirim dan menerima data.' },
    { answer: 'C', explanation: 'IoT menggunakan jaringan Wi-Fi, Bluetooth, Zigbee.' },
    { answer: 'A', explanation: 'Smart irrigation system adalah contoh IoT di pertanian.' },
    { answer: 'B', explanation: 'Perangkat IoT dapat mengirim data ke cloud server.' },
    { answer: 'C', explanation: 'Tantangan utama IoT: Keamanan data dan privasi.' },
    { answer: 'B', explanation: 'Sensor berfungsi mendeteksi perubahan lingkungan.' },
    { answer: 'B', explanation: 'IoT mengotomatisasi proses dengan bantuan aktuator.' },
    { answer: 'B', explanation: 'Smart home: rumah terkoneksi dan otomatis.' },
    { answer: 'A', explanation: 'Smart band untuk pemantauan detak jantung adalah contoh IoT di kesehatan.' },
    { answer: 'C', explanation: 'Data IoT biasanya dikirim ke cloud untuk analisis.' },
    { answer: 'C', explanation: 'Aktuator berfungsi melakukan tindakan fisik.' },
    { answer: 'B', explanation: 'Keuntungan IoT: meningkatkan efisiensi dan otomatisasi.' },
  ],
  saas: [
    { answer: 'C', explanation: 'SaaS menyediakan aplikasi siap pakai melalui internet.' },
    { answer: 'A', explanation: 'Google Docs adalah contoh layanan SaaS.' },
    { answer: 'C', explanation: 'Kelebihan utama SaaS: dapat diakses dari mana saja.' },
    { answer: 'B', explanation: 'Pengguna SaaS tidak perlu memelihara infrastruktur.' },
    { answer: 'B', explanation: 'SaaS disediakan oleh penyedia layanan cloud.' },
    { answer: 'B', explanation: 'Update software SaaS dilakukan oleh penyedia layanan.' },
    { answer: 'C', explanation: 'SaaS memungkinkan kolaborasi real-time.' },
    { answer: 'C', explanation: 'Penggunaan SaaS memerlukan koneksi internet.' },
    { answer: 'C', explanation: 'Data SaaS disimpan di cloud server.' },
    { answer: 'C', explanation: 'Kekurangan SaaS: bergantung pada koneksi internet.' },
    { answer: 'B', explanation: 'Dropbox/OneDrive adalah SaaS.' },
    { answer: 'C', explanation: 'SaaS digunakan bisnis dan perorangan untuk produktivitas.' },
    { answer: 'B', explanation: 'SaaS dapat diakses melalui browser.' },
    { answer: 'C', explanation: 'Gmail adalah layanan SaaS.' },
    { answer: 'C', explanation: 'Pengguna SaaS bertanggung jawab atas penggunaan aplikasi.' },
  ],
  iaas: [
    { answer: 'B', explanation: 'IaaS menyediakan infrastruktur TI virtual.' },
    { answer: 'C', explanation: 'Amazon EC2 adalah contoh IaaS.' },
    { answer: 'B', explanation: 'Pengguna IaaS bertanggung jawab terhadap OS dan aplikasi.' },
    { answer: 'C', explanation: 'Kelebihan IaaS: skalabilitas tinggi dan fleksibel.' },
    { answer: 'B', explanation: 'IaaS cocok untuk developer dan perusahaan yang butuh kontrol penuh.' },
    { answer: 'C', explanation: 'Amazon S3 adalah layanan penyimpanan IaaS.' },
    { answer: 'B', explanation: 'Pengguna IaaS bisa mengatur virtual machine dan jaringan.' },
    { answer: 'C', explanation: 'IaaS dapat dikustomisasi sesuai kebutuhan.' },
    { answer: 'B', explanation: 'Amazon Web Services adalah penyedia IaaS.' },
    { answer: 'B', explanation: 'IaaS mengurangi kebutuhan infrastruktur fisik lokal.' },
    { answer: 'B', explanation: 'Penyedia layanan cloud mengelola infrastruktur fisik.' },
    { answer: 'C', explanation: 'Hosting website adalah skenario penggunaan IaaS.' },
    { answer: 'B', explanation: 'IaaS memungkinkan menyewa infrastruktur TI secara virtual.' },
    { answer: 'C', explanation: 'IaaS biasanya dibayar dengan model pay-as-you-go.' },
    { answer: 'C', explanation: 'Kelemahan IaaS: kompleksitas pengelolaan oleh pengguna.' },
  ],
  paas: [
    { answer: 'B', explanation: 'PaaS menyediakan platform untuk membangun dan menjalankan aplikasi.' },
    { answer: 'A', explanation: 'Heroku adalah contoh layanan PaaS.' },
    { answer: 'C', explanation: 'PaaS cocok untuk developer yang membangun aplikasi.' },
    { answer: 'C', explanation: 'PaaS menyediakan server, runtime, database, dan tools developer.' },
    { answer: 'C', explanation: 'Penyedia layanan cloud mengelola infrastruktur dan platform.' },
    { answer: 'B', explanation: 'Pengguna PaaS fokus pada pengembangan aplikasi.' },
    { answer: 'B', explanation: 'Keuntungan PaaS: mengurangi beban manajemen infrastruktur.' },
    { answer: 'C', explanation: 'PaaS mendukung pengembangan dan deployment aplikasi.' },
    { answer: 'B', explanation: 'Google App Engine adalah contoh PaaS.' },
    { answer: 'C', explanation: 'Penyedia platform bertanggung jawab atas sistem operasi.' },
    { answer: 'A', explanation: 'PaaS memungkinkan developer membangun aplikasi tanpa mengelola server.' },
    { answer: 'B', explanation: 'Kelemahan PaaS: ketergantungan pada vendor.' },
    { answer: 'C', explanation: 'PaaS mendukung banyak bahasa pemrograman.' },
    { answer: 'B', explanation: 'PaaS ideal untuk developer aplikasi.' },
    { answer: 'C', explanation: 'Layanan database PaaS sudah termasuk dalam platform.' },
  ]
};

export async function GET(request) {
  const url = request.nextUrl;
  const category = url.searchParams.get('category'); // iot, saas, iaas, paas
  const number = url.searchParams.get('number'); // nomor soal (1-based)
  const answer = url.searchParams.get('answer'); // jawaban user (A/B/C/D)

  if (!category || !number || !answer) {
    return new Response(JSON.stringify({ status: 'error', message: 'Parameter kurang lengkap.' }), { status: 400 });
  }

  const soalArr = quizData[category];
  if (!soalArr) {
    return new Response(JSON.stringify({ status: 'error', message: 'Kategori tidak ditemukan.' }), { status: 404 });
  }

  const idx = parseInt(number, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= soalArr.length) {
    return new Response(JSON.stringify({ status: 'error', message: 'Nomor soal tidak valid.' }), { status: 400 });
  }

  const kunci = soalArr[idx];
  const benar = answer.toUpperCase() === kunci.answer;
  return new Response(JSON.stringify({
    status: benar ? 'benar' : 'salah',
    explanation: kunci.explanation
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
