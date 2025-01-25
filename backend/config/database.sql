-- Veritabanını oluştur (eğer yoksa)
CREATE DATABASE IF NOT EXISTS klucampus;
USE klucampus;

-- Mevcut tabloları sil
DROP TABLE IF EXISTS trends;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

-- Kullanıcılar Tablosu
CREATE TABLE kullanicilar (
    id VARCHAR(255) PRIMARY KEY,
    tam_ad VARCHAR(255) NOT NULL,
    fakulte VARCHAR(255) NOT NULL,
    fakulte_adi VARCHAR(255) NOT NULL,
    bolum VARCHAR(255) NOT NULL,
    sartlari_kabul BOOLEAN NOT NULL DEFAULT FALSE,
    sozlesmeyi_kabul BOOLEAN NOT NULL DEFAULT FALSE,
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mesajlar Tablosu
CREATE TABLE mesajlar (
    id VARCHAR(255) PRIMARY KEY,
    kullanici_id VARCHAR(255) NOT NULL,
    kullanici_adi VARCHAR(255) NOT NULL,
    icerik TEXT NOT NULL,
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
);

-- Kitaplar Tablosu
CREATE TABLE kitaplar (
    id VARCHAR(255) PRIMARY KEY,
    baslik VARCHAR(255) NOT NULL,
    kategori VARCHAR(255) NOT NULL,
    fiyat DECIMAL(10, 2) NOT NULL,
    instagram VARCHAR(255),
    resim_url TEXT,
    satici_id VARCHAR(255) NOT NULL,
    satici_adi VARCHAR(255) NOT NULL,
    satici_fakulte VARCHAR(255),
    satici_bolum VARCHAR(255),
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    durum ENUM('müsait', 'satıldı', 'beklemede') NOT NULL DEFAULT 'müsait',
    FOREIGN KEY (satici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
);

-- Gündem Konuları Tablosu
CREATE TABLE gundem_konulari (
    id VARCHAR(255) PRIMARY KEY,
    siralama INT NOT NULL CHECK (siralama > 0),
    olusturma_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP
); 