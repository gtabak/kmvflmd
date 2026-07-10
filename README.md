# KMVFLMD Web Sitesi

Karabük Mehmet Vergili Fen Lisesi Mezunlar Derneği için hazırlanmış, Cloudflare Pages üzerinde ücretsiz yayınlanabilen statik web sitesi.

## Yerelde çalıştırma

Dosyaları doğrudan `file://` ile açmak yerine klasör içinde basit bir sunucu başlatın:

```bash
cd public
python3 -m http.server 8080
```

Sonra tarayıcıda `http://localhost:8080` adresini açın.

## Duyuru ekleme

`data/duyurular.json` dosyasına aşağıdaki şablonla yeni bir nesne ekleyin:

```json
[
  {
    "slug": "ilk-genel-kurul-duyurusu",
    "baslik": "İlk Genel Kurul Duyurusu",
    "tarih": "2026-07-10",
    "ozet": "Duyurunun ana sayfada görünen kısa özeti.",
    "icerik": "Duyurunun tam metni.\n\nYeni paragraf için iki satır boşluk kullanabilirsiniz.",
    "yayinla": true
  }
]
```

Kurallar:

- `slug`: Türkçe karakter ve boşluk içermeyen benzersiz adres adı.
- `tarih`: `YYYY-AA-GG` biçiminde.
- `yayinla`: `false` yapılırsa duyuru sitede görünmez.
- JSON içinde son nesneden sonra virgül bırakmayın.

Commit ve push işlemi sonrasında Cloudflare Pages otomatik olarak yeni sürümü yayınlar.

## Cloudflare Pages ayarları

Bu proje build sistemi kullanmaz:

- Framework preset: `None`
- Build command: boş bırakın
- Build output directory: `public`
- Production branch: `main`

## Dosya yapısı

```text
kmvflmd-site/
├── README.md
└── public/
    ├── index.html
    ├── duyurular.html
    ├── duyuru.html
    ├── 404.html
    ├── _headers
    ├── robots.txt
    ├── data/duyurular.json
    └── assets/
```
