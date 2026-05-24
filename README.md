# Sahabat AI - Teman Curhat

**Sahabat AI - Teman Curhat** adalah aplikasi chatbot AI berbasis web yang dirancang khusus sebagai ruang aman bagi pengguna untuk berkeluh kesah, menceritakan masalah sehari-hari, dan meluapkan perasaan mereka. Chatbot ini bertindak sebagai sahabat yang suportif, hangat, peduli, dan tidak menghakimi.

Proyek ini dibangun menggunakan **Node.js** dan **Express** di sisi backend, serta **Vanilla HTML, CSS, dan JavaScript** di sisi frontend, terintegrasi langsung dengan **Google Gemini API**.

---

## 🚀 Fitur Utama

- **Empat AI Persona (Teman Curhat):** AI dikonfigurasi secara khusus agar memberikan respons yang menenangkan, memvalidasi perasaan pengguna, dan tidak terburu-buru menceramahi atau memberikan solusi kecuali diminta.
- **Premium Gemini-inspired UI:** Desain antarmuka modern dengan Dark Theme premium, layout responsif (Flexbox/Grid), tipografi cantik (Outfit & Inter), dan elemen masukan berbentuk pill yang clean.
- **Memori & Riwayat Percakapan (Conversation History):** Mengirimkan konteks percakapan sebelumnya secara utuh ke backend agar AI mengingat topik pembicaraan sepanjang sesi.
- **Render Markdown Aman (XSS Protected):** Mendukung visualisasi teks terformat (list, teks tebal, blockquote, kode) dengan konversi markdown (`Marked.js`) yang disanitasi secara ketat (`DOMPurify`) di sisi klien.
- **Multi-modal Capabilities:** Endpoint backend siap memproses input Teks biasa (`/api/chat`, `/generate-text`), Gambar (`/generate-from-image`), Dokumen (`/generate-from-document`), serta Audio (`/generate-from-audio`).

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **SDK:** `@google/genai` (Google Gen AI SDK Resmi)
- **Utilities:** Multer (untuk file upload), Dotenv (untuk pengelolaan env variables)

### Frontend
- **Structure:** Vanilla HTML5 (Semantik)
- **Styling:** Vanilla CSS3 (Custom Variables, Flexbox, Grid, Animasi/Transisi)
- **Interactions:** Vanilla JavaScript (ES6+, Fetch API, DOM Manipulation)
- **Libraries (CDN):**
  - [Marked.js](https://marked.js.org/) (Markdown Parser)
  - [DOMPurify](https://github.com/cure53/DOMPurify) (HTML Sanitizer)

---

## 📂 Struktur Proyek

```text
├── public/
│   ├── index.html     # Halaman utama aplikasi (UI Chat)
│   ├── script.js      # Logika interaksi frontend, API fetch, & markdown parsing
│   └── style.css      # Desain tema premium dark mode & responsive styles
├── index.js           # Server Node.js + Express & integrasi Gemini API
├── package.json       # Informasi dependensi npm proyek
├── .env               # File konfigurasi API Key (tidak dicommit)
└── README.md          # Dokumentasi proyek
```

---

## ⚙️ Prasyarat & Panduan Instalasi

### Prasyarat
- **Node.js** versi 20.0.0 atau yang lebih baru.
- **Google Gemini API Key** (Dapatkan di Google AI Studio).

### Langkah-langkah Instalasi

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/rizkijuliadi03/sahabat-ai-chatbot.git
   cd sahabat-ai
   ```

2. **Instal Dependensi:**
   Instal semua dependensi backend yang terdaftar di `package.json`:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable:**
   Buat file bernama `.env` di direktori utama proyek, lalu tambahkan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini
   ```

4. **Jalankan Server:**
   Jalankan server Node.js lokal Anda:
   ```bash
   node index.js
   ```
   *Atau jika menggunakan nodemon:*
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi:**
   Buka browser Anda dan akses tautan berikut:
   [http://localhost:3000](http://localhost:3000)

---

## 📝 Catatan untuk Pengujian Proyek Akhir (Hacktiv8 Final Project)

- **API Specification:** Endpoint utama chat berada di `POST /api/chat` dengan format input JSON:
  ```json
  {
    "conversation": [
      { "role": "user", "text": "Halo, saya sedang merasa cemas hari ini." },
      { "role": "model", "text": "Halo, aku di sini. Mau cerita apa yang membuatmu cemas?" }
    ]
  }
  ```
- **Error Handling:** Jika server atau koneksi internet terputus, antarmuka chat frontend akan menampilkan pesan galat `"Failed to get response from server."` atau `"Sorry, no response received."` agar pengguna mendapatkan feedback yang jelas.
- **Safety & UX:** Tombol kirim dan kolom teks akan dinonaktifkan sementara (disabled) selama proses tunggu balasan dari Gemini AI untuk mencegah submit ganda.

---
*Proyek ini dikembangkan oleh **JULLY** sebagai bagian dari syarat kelulusan Kelas AI Hacktiv8.*
