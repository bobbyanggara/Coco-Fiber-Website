# CocoFiber AI Assistant — Panduan Setup & Deploy

Chatbot AI sudah ditambahkan ke situs (tombol "Tanya AI" di FAB kanan bawah).
Backend-nya butuh di-deploy ke Vercel supaya API key Anthropic aman.

## 1. Buat API Key Anthropic

1. Buka https://console.anthropic.com
2. Daftar / login
3. Masuk ke menu **API Keys** → **Create Key**
4. Salin key-nya (format `sk-ant-...`), simpan sementara di catatan aman —
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
   - Name: `ANTHROPIC_API_KEY`
   - Value: (tempel API key dari langkah 1)
5. Klik **Deploy**

Setelah selesai, Vercel akan kasih URL situs kamu, misalnya
`https://cocofiber-website.vercel.app` — chatbot langsung aktif di situ.

## 4. Testing

- Buka situs yang sudah live
- Klik tombol "Hubungi Kami" di kanan bawah → pilih **Tanya AI**
- Coba tanya: "Cocopeat itu untuk apa?" atau "Bagaimana cara pesan produk?"

## 5. Update system prompt (opsional)

Kalau mau sesuaikan gaya jawaban, harga, atau info produk, edit bagian
`SYSTEM_PROMPT` di file `api/chat.js`, lalu push ulang ke GitHub — Vercel
otomatis re-deploy.

## Catatan biaya

- Hosting Vercel: gratis untuk skala kecil (hobby plan)
- Anthropic API: berbayar per pemakaian (per token), sangat murah untuk
  traffic company profile biasa. Cek harga terbaru di
  https://www.anthropic.com/pricing

## Kenapa harus lewat backend (Vercel), bukan langsung dari browser?

Kalau API key ditaruh langsung di file JS yang dikirim ke browser, siapa
saja bisa membukanya lewat DevTools dan mencuri key-nya untuk dipakai
sendiri (dan tagihan API-nya masuk ke akun kamu). Dengan cara ini, key
disimpan aman di server Vercel dan tidak pernah dikirim ke browser
pengunjung.
