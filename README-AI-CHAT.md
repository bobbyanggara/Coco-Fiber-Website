# CocoFiber AI Assistant: Panduan Setup & Deploy

Chatbot AI sudah ditambahkan ke situs (tombol "Tanya AI" di FAB kanan bawah).
Backend-nya butuh di-deploy ke Vercel supaya API key Groq aman.

## 1. Buat API Key Groq

1. Buka https://console.groq.com
2. Daftar / login
3. Masuk ke menu **API Keys** → **Create API Key**
4. Salin key-nya (format `gsk_...`), simpan sementara di catatan aman.
   JANGAN ditulis di file kode manapun.

## 2. Push project ke GitHub

```bash
git init
git add .
git commit -m "CocoFiber website with AI chat assistant"
```

Buat repo baru di GitHub, lalu:

```bash
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git branch -M main
git push -u origin main
```

## 3. Deploy ke Vercel

1. Buka https://vercel.com → daftar/login (bisa pakai akun GitHub)
2. Klik **Add New → Project**
3. Pilih repo GitHub yang baru di-push
4. Sebelum klik Deploy, buka bagian **Environment Variables**:
   - Name: `GROQ_API_KEY`
   - Value: (tempel API key dari langkah 1)
5. Klik **Deploy**

Setelah selesai, Vercel akan kasih URL situs kamu, misalnya
`https://cocofiber-website.vercel.app`, chatbot langsung aktif di situ.

## 4. Testing

- Buka situs yang sudah live
- Klik tombol "Hubungi Kami" di kanan bawah → pilih **Tanya AI**
- Coba tanya: "Cocopeat itu untuk apa?" atau "Bagaimana cara pesan produk?"

## 5. Update system prompt (opsional)

Kalau mau sesuaikan gaya jawaban, harga, atau info produk, edit bagian
`SYSTEM_PROMPT` di file `api/chat.js`, lalu push ulang ke GitHub. Vercel
otomatis re-deploy.

File `api/chat.js` inilah backend serverless yang dipanggil oleh
`main.js` lewat `fetch('/api/chat')`. File ini sudah termasuk validasi
input dasar (batas jumlah pesan & panjang teks) dan penanganan error,
jadi aman dipakai langsung setelah `GROQ_API_KEY` diset di Vercel.

## 6. Ganti model (opsional)

Model default yang dipakai adalah `openai/gpt-oss-120b` (model open-weight
yang di-host Groq, cepat dan murah). Kalau mau ganti ke model Groq lain
(misalnya yang lebih ringan/murah atau lebih pintar), ubah nilai `model`
di `api/chat.js`. Daftar model yang tersedia bisa dicek di
https://console.groq.com/docs/models. Groq cukup sering memperbarui
daftar modelnya, jadi selalu cek link tersebut untuk model terbaru
sebelum deploy.

## Catatan biaya

- Hosting Vercel: gratis untuk skala kecil (hobby plan)
- Groq API: berbayar per pemakaian (per token), umumnya jauh lebih murah
  dibanding provider lain karena Groq fokus pada inferensi cepat untuk
  model open-weight. Cek harga terbaru di https://groq.com/pricing

## Kenapa harus lewat backend (Vercel), bukan langsung dari browser?

Kalau API key ditaruh langsung di file JS yang dikirim ke browser, siapa
saja bisa membukanya lewat DevTools dan mencuri key-nya untuk dipakai
sendiri (dan tagihan API-nya masuk ke akun kamu). Dengan cara ini, key
disimpan aman di server Vercel dan tidak pernah dikirim ke browser
pengunjung.
