# Manisa Trafik Aksaklık Bildirim Paneli

## Gereksinimler

- .NET 8 SDK
- Node.js
- PostgreSQL

## Kurulum

### 1. Veritabanı

PostgreSQL kurulu ve çalışır durumda olmalı. `backend/ManisaTrafik.Api/appsettings.json` dosyasındaki bağlantı bilgilerini kendi ortamınıza göre düzenleyin:

```
Host=localhost;Database=manisatrafik;Username=postgres;Password=your_password
```

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

## Kullanım

- Ana sayfa: vatandaş bildirim formu (giriş gerektirmez)
- /admin/login: yetkili giriş ekranı
- /admin/dashboard: ihbarları listeleme ve durum güncelleme

## Notlar

- Local proje olduğu için admin şifreleri db şifrelerini basit tuttum.
- 
## Sayfalar

- `/` — Vatandaş bildirim formu (giriş gerektirmez)
- `/admin/login` — Yetkili giriş ekranı
- `/admin/dashboard` — İhbar yönetim paneli
- `/admin/users` — Kullanıcı yönetimi (sadece Admin)