# Analisis Sentimen Chess.com

Sistem analisis sentimen ulasan aplikasi Chess.com dari Google Play Store menggunakan metode **Support Vector Machine (SVM)** dengan fitur **TF-IDF**.

## 🌐 Demo Online

Kunjungi versi demo statis di: **[GitHub Pages](https://AnwarFebrian1208.github.io/skripsi-chess/)**

> ⚠️ Versi demo hanya menampilkan tampilan website. Fitur backend (database, login, analisis) memerlukan server PHP + MySQL.

## 📋 Fitur

- **Impor Data**: Upload dataset CSV hasil scraping Google Play Store
- **Preprocessing**: Case folding, cleansing, stopword removal, stemming
- **Prediksi Sentimen**: Klasifikasi menggunakan model SVM
- **Visualisasi**: Dashboard interaktif dengan chart dan statistik
- **Evaluasi Model**: Confusion matrix, accuracy, precision, recall, F1-score

## 🛠️ Teknologi

- **Backend**: PHP 8.x, MySQL
- **Machine Learning**: Python (scikit-learn, SVM)
- **Frontend**: HTML, CSS, JavaScript
- **Icons**: Font Awesome 6.4

## 📁 Struktur Proyek

```
skripsi_chess/
├── docs/              ← Versi statis untuk GitHub Pages
│   ├── index.html
│   ├── dashboard.html
│   ├── result.html
│   └── assets/
├── landing.php        ← Landing page (PHP)
├── dashboard.php      ← Dashboard utama
├── index.php          ← Beranda
├── result.php         ← Hasil analisis
├── import.php         ← Impor data CSV
├── preprocess.php     ← Preprocessing teks
├── predict.php        ← Prediksi sentimen
├── config.php         ← Konfigurasi database
├── includes.php       ← Helper functions
├── train_svm.py       ← Training model SVM
├── predict_svm.py     ← Prediksi menggunakan SVM
└── text_preprocess.py ← Preprocessing teks Python
```

## 🚀 Setup Lokal

Lihat file `README_SETUP.txt` untuk panduan instalasi lengkap.

