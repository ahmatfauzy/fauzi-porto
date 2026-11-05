---
title: "Mengenal PM2 dan Fungsinya untuk Aplikasi Node.js"
description: "Mengenal PM2, process manager untuk menjalankan, memantau, dan menjaga aplikasi Node.js tetap aktif di server."
date: '2026-11-05'
draft: false
tags:
  - Node.js
  - PM2
  - DevOps
categories:
  - Node.js
---

## Pendahuluan

Saat aplikasi Node.js dijalankan langsung dengan `node app.js`, prosesnya terikat pada sesi terminal. Jika terminal ditutup atau proses mengalami crash, aplikasi bisa berhenti. Di server, kita biasanya membutuhkan cara yang lebih praktis untuk menjalankan dan mengelola proses tersebut.

**PM2** adalah process manager untuk aplikasi Node.js. PM2 menjalankan aplikasi di latar belakang dan menyediakan perintah untuk memantau status, membaca log, serta mengatur restart proses. Artikel ini membahas fungsi PM2 dan cara menggunakannya untuk aplikasi Node.js.

## Fungsi PM2

PM2 membantu mengelola proses aplikasi melalui beberapa fitur berikut:

- Menjalankan aplikasi di latar belakang agar tidak bergantung pada terminal.
- Memulai ulang aplikasi ketika proses berhenti atau mengalami crash.
- Menampilkan status proses dan penggunaan sumber daya.
- Mengumpulkan log aplikasi untuk membantu mencari masalah.
- Menjalankan beberapa instance aplikasi Node.js dengan **cluster mode**.
- Menyimpan daftar proses agar dapat dipulihkan setelah server dinyalakan kembali.

PM2 membantu mengelola proses aplikasi, tetapi tidak menggantikan kebutuhan akan konfigurasi server, keamanan, pemantauan, dan backup yang baik.

## Menginstal PM2

Pastikan Node.js dan npm sudah tersedia, lalu instal PM2 secara global:

```bash title="Terminal"
npm install pm2@latest -g
```

Periksa instalasi dengan perintah:

```bash title="Terminal"
pm2 --version
```

## Menjalankan Aplikasi Node.js

Misalnya entry point aplikasi berada di file `app.js`. Jalankan aplikasi menggunakan PM2:

```bash title="Terminal"
pm2 start app.js --name api-node
```

Opsi `--name` memberi nama proses agar lebih mudah dikenali. PM2 akan menjalankan proses di latar belakang. Untuk aplikasi yang menggunakan script `start` di `package.json`, Anda juga dapat menjalankannya seperti ini:

```bash title="Terminal"
pm2 start npm --name api-node -- start
```

## Melihat Status dan Log

Gunakan perintah berikut untuk melihat proses yang sedang dikelola PM2:

```bash title="Terminal"
pm2 list
```

Untuk mengikuti log secara langsung:

```bash title="Terminal"
pm2 logs api-node
```

Dashboard di terminal dapat dibuka dengan:

```bash title="Terminal"
pm2 monit
```

Log membantu melihat output aplikasi maupun pesan error. Pastikan pengelolaan dan rotasi log juga diperhatikan agar file log tidak terus membesar.

## Mengelola Proses Aplikasi

PM2 menyediakan beberapa perintah umum untuk mengatur aplikasi:

```bash title="Terminal"
pm2 restart api-node  # Mulai ulang aplikasi
pm2 stop api-node     # Hentikan aplikasi
pm2 start api-node    # Jalankan kembali proses yang berhenti
pm2 delete api-node   # Hapus proses dari daftar PM2
```

`restart` menghentikan lalu menjalankan kembali proses. Untuk aplikasi dalam cluster mode, `reload` dapat mengganti worker secara bertahap agar koneksi tetap dilayani saat proses diperbarui:

```bash title="Terminal"
pm2 reload api-node
```

## Cluster Mode untuk Node.js

Secara default, aplikasi berjalan sebagai satu proses. Untuk aplikasi Node.js yang sesuai, PM2 dapat menjalankannya dalam beberapa worker melalui cluster mode:

```bash title="Terminal"
pm2 start app.js --name api-node -i max
```

Opsi `-i max` meminta PM2 membuat worker berdasarkan jumlah CPU yang tersedia. Cluster mode berguna untuk memanfaatkan beberapa core pada satu server, tetapi aplikasi dan cara aplikasi mengelola state serta koneksi perlu mendukung pola ini.

## Menjalankan Kembali Aplikasi Setelah Server Reboot

Agar PM2 dapat memulihkan aplikasi setelah server dinyalakan ulang, buat konfigurasi startup dan simpan daftar proses:

```bash title="Terminal"
pm2 startup
pm2 save
```

Perintah `pm2 startup` akan menampilkan perintah lanjutan yang perlu dijalankan untuk mengaktifkan startup script pada sistem operasi. Ikuti instruksi yang ditampilkan, kemudian gunakan `pm2 save` untuk menyimpan daftar proses yang ingin dipulihkan.

## Menggunakan Ecosystem File

Jika aplikasi membutuhkan konfigurasi yang konsisten atau ada beberapa proses yang dikelola, simpan pengaturan di `ecosystem.config.js`:

```js title="ecosystem.config.js"
module.exports = {
  apps: [
    {
      name: 'api-node',
      script: './app.js',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

Jalankan aplikasi dengan konfigurasi tersebut:

```bash title="Terminal"
pm2 start ecosystem.config.js --env production
```

Ecosystem file memudahkan pengaturan nama proses, file entry point, jumlah instance, dan environment dalam satu tempat.

## Kapan PM2 Digunakan?

PM2 cocok ketika Anda menjalankan aplikasi Node.js langsung di server atau virtual private server dan membutuhkan pengelolaan proses melalui terminal. Jika aplikasi sudah dijalankan di platform yang mengelola proses dan restart secara otomatis, evaluasi kebutuhan sebelum menambahkan PM2 agar pengelolaan proses tidak bertumpuk.

## Kesimpulan

PM2 memudahkan pengelolaan aplikasi Node.js di server. Dengan PM2, Anda dapat menjalankan aplikasi di latar belakang, memeriksa status dan log, mengatur restart, mencoba cluster mode, serta memulihkan proses setelah server reboot.

Untuk mempelajari perintah dan konfigurasi lebih lanjut, kunjungi [dokumentasi Quick Start PM2](https://pm2.keymetrics.io/docs/usage/quick-start/), [dokumentasi Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/), dan [panduan Startup Script](https://pm2.keymetrics.io/docs/usage/startup/).
