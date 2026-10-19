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
Tab **Sijil**: pilih program, pilih penerima (hanya yang HADIR), isi nama Guru Besar sekali sahaja (diingati). Klik **Cetak Sijil Ini** atau **Cetak Semua Yang Hadir**. Dalam tetingkap cetak pilih **Simpan sebagai PDF** dan tandakan **Background graphics**.
