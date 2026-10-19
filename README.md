# Manisa Trafik Aksaklık Bildirim Paneli

## Gereksinimler

- .NET 8 SDK
- Node.js 20.19+
- PostgreSQL

## Kurulum

### 1. Veritabanı

PostgreSQL kurulu ve çalışır durumda olmalı. `backend/ManisaTrafik.Api/appsettings.json` dosyasındaki bağlantı bilgilerini kendi ortamınıza göre düzenleyin:

```
Host=localhost;Port=5432;Database=manisa_trafik;Username=postgres;Password=12345
```

`Password` kısmına kendi PostgreSQL şifrenizi yazın. Veritabanı ilk çalıştırmada otomatik oluşturulur.

### 2. Backend

```
cd backend/ManisaTrafik.Api
dotnet run
```

API http://localhost:5038 adresinde çalışır. Tablolar ve varsayılan admin kullanıcısı otomatik oluşturulur.

Giriş bilgileri: kullanıcı adı `admin`, şifre `admin123`

### 3. Frontend

```
cd frontend
npm install
npm run dev
```

Uygulama http://localhost:5173 adresinde açılır.

## Sayfalar

- `/` — Vatandaş bildirim formu (giriş gerektirmez)
- `/admin/login` — Yetkili giriş ekranı
- `/admin/dashboard` — İhbar yönetim paneli
- `/admin/users` — Kullanıcı yönetimi (sadece Admin)

## Notlar

- Local proje olduğu için admin ve veritabanı şifrelerini basit tuttum.