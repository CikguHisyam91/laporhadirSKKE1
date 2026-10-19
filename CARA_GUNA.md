# Cara Sambung Sistem Kehadiran ke Google Sheet

1. Buka https://sheets.new (Google Sheet baharu). Namakan: **Kehadiran Guru SKKE1**.
2. Klik **Sambungan (Extensions) > Apps Script**.
3. Padam semua kod sedia ada, tampal SEMUA kod dari fail `Code.gs`. Klik ikon **Simpan**.
4. Klik **Deploy > New deployment** > ikon gear > pilih **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Klik **Deploy**, beri kebenaran (Authorize) > Advanced > Go to project > Allow.
6. Salin **Web app URL** (berakhir dengan `/exec`).
7. Dalam fail `index.html`, cari `TAMPAL_URL_WEB_APP_DI_SINI` dan gantikan dengan URL tadi. Simpan.

Siap! Semua peranti akan berkongsi data yang sama. Tab **KEHADIRAN** dan **STAF** dalam Google Sheet boleh dibaca terus.

## Sijil Kehadiran
Tab **Sijil**: pilih program, pilih penerima (hanya yang HADIR), sijil digital tanpa tandatangan. Klik **Cetak Sijil Ini** atau **Cetak Semua Yang Hadir**. Dalam tetingkap cetak pilih **Simpan sebagai PDF** dan tandakan **Background graphics**.

## Akses Admin
Tab **Panel Admin & Rekod** dan **Pangkalan Data IC** dikunci. Log masuk guna No. IC.
- Automatik dibenarkan: jawatan bermula GURU BESAR / PK / PENOLONG KANAN.
- Guru lain: Guru Besar / PK tandakan **Beri akses** dalam tab Pangkalan Data IC.
- Pentadbir mesti sudah daftar IC (cara paling mudah: daftar hadir sekali di kiosk).

## Fasilitator, Pautan Program & Duplicate
- **Fasilitator**: semasa cipta/edit program, tanda nama dalam "Fasilitator / Moderator". Mereka log masuk dengan IC dan hanya nampak program sendiri.
- **Peserta Sasaran**: pilih peserta; statistik & cetakan ikut senarai ini. Kosong = semua staf.
- **Pautan / QR**: butang QR pada setiap program. Hantar ke WhatsApp / Telegram atau tayang QR. Peranti yang buka pautan terkunci kepada program itu.
- **Duplicate**: butang salin (admin sahaja). Masukkan nama baharu, semak tarikh, simpan.

### WAJIB selepas kemas kini ini: kemas kini Apps Script
1. Buka Apps Script > padam semua kod > tampal SEMUA kod `Code.gs` baharu > Simpan.
2. **Deploy > Manage deployments** > ikon pensel (Edit) > Version: **New version** > **Deploy**.
URL kekal sama; tak perlu ubah index.html.
