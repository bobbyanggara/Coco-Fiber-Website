# CocoFiber Website

Website perusahaan untuk **PT Apa Saja Indonesia** (dikelola oleh CV Kreasi
Asa Indonesia) — eksportir coco fiber, cocopeat, dan produk turunan sabut
kelapa. Landing page statis (HTML/CSS/JS) + AI chat assistant lewat
serverless function di Vercel.

## Struktur Project

```
├── index.html                          Landing page utama
├── artikel-*.html                      3 halaman artikel/blog
├── main.js                             Semua interaksi (menu, i18n, AI chat, dll)
├── styling.css                         Semua styling
├── api/chat.js                         Serverless function AI chat (Groq)
├── images/                             Foto produk & artikel (BELUM DIISI, lihat di bawah)
├── vercel.json                         Config deploy + security headers
├── robots.txt / sitemap.xml            SEO
└── .env.example                        Contoh env var (GROQ_API_KEY)
```

## Checklist Sebelum Go-Live

- [ ] **Isi folder `images/`** — semua tag `<img>` di `index.html` dan
      halaman artikel masih menunjuk ke file yang belum ada
      (`images/gallery-coco-fiber.webp`, dll — lihat daftar lengkap dengan
      `grep -o 'images/[a-zA-Z0-9_.-]*' *.html | sort -u`). Situs akan
      tetap jalan (browser cuma menampilkan gambar rusak/kosong), tapi
      ini wajib diisi foto asli sebelum diumumkan ke publik.
- [ ] **Set `GROQ_API_KEY`** di Environment Variables Vercel (lihat
      `README-AI-CHAT.md` untuk langkah lengkap).
- [ ] **Ganti domain placeholder.** Semua `canonical`, `og:url`, dan
      `sitemap.xml` saat ini memakai `https://cocofiber-website.vercel.app/`.
      Setelah domain final (custom domain atau URL Vercel asli) diketahui,
      cari-ganti string tersebut di seluruh file.
- [ ] **Cek nomor WhatsApp & email** di `index.html`, `main.js`
      (`WHATSAPP_NUMBER`), dan footer — pastikan semua konsisten dan aktif.
- [ ] **Test form kontak**: submit form kontak akan membuka WhatsApp Web/App
      dengan pesan terisi otomatis. Tidak ada email/server yang menyimpan
      data — pastikan ini sudah sesuai kebutuhan (kalau butuh histori lead
      tersimpan, form ini perlu diarahkan ke Google Sheet/CRM alih-alih WA).
- [ ] **Test chatbot AI** setelah deploy: klik "Tanya AI" → kirim pertanyaan
      contoh dari `README-AI-CHAT.md`.
- [ ] **Jalankan Lighthouse** (Chrome DevTools) untuk cek performa,
      accessibility, dan SEO setelah gambar diisi (skor akan berubah
      signifikan begitu gambar production ditambahkan).

## Development Lokal

```bash
npm install -g vercel   # sekali saja
vercel dev               # menjalankan static site + api/chat.js secara lokal
```

Buat file `.env` (dari `.env.example`) berisi `GROQ_API_KEY` asli untuk
testing chatbot secara lokal. File `.env` sudah di-ignore oleh git.

## Deploy

Lihat langkah lengkap di `README-AI-CHAT.md` (push ke GitHub → import ke
Vercel → set `GROQ_API_KEY` → Deploy).
