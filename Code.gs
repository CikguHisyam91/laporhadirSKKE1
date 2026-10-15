/**
 * SISTEM KEHADIRAN GURU & STAF - SK KING EDWARD VII (1)
 * Backend Google Apps Script (Google Sheet sebagai pangkalan data)
 * Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone
 */

const CHUNK = 45000;

function doGet() {
  try {
    return json_(readData_());
  } catch (err) {
    return json_({ error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'upload') return json_(uploadPhoto_(data));
    const stamp = new Date().toISOString();
    data.stamp = stamp;
    writeData_(data);
    writeReadableSheets_(data);
    return json_({ ok: true, stamp: stamp });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Berfungsi sama ada skrip dibuat dari Google Sheet (Sambungan > Apps Script)
// atau terus di script.google.com (Sheet baharu akan dicipta secara automatik).
function ss_() {
  let ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (err) {}
  if (ss) return ss;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  ss = SpreadsheetApp.create('Kehadiran Guru SKKE1');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function sheet_(name) {
  const ss = ss_();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function readData_() {
  const sh = sheet_('_DATA');
  const last = sh.getLastRow();
  if (last < 1) return {};
  const text = sh.getRange(1, 1, last, 1).getValues().map(r => r[0]).join('');
  try { return JSON.parse(text); } catch (err) { return {}; }
}

function writeData_(data) {
  const sh = sheet_('_DATA');
  const text = JSON.stringify(data);
  const rows = [];
  for (let i = 0; i < text.length; i += CHUNK) rows.push([text.substr(i, CHUNK)]);
  sh.clear();
  sh.getRange(1, 1, rows.length, 1).setNumberFormat('@').setValues(rows);
}

function writeReadableSheets_(data) {
  // Senarai Staf
  const st = sheet_('STAF');
  st.clear();
  const staffRows = [['BIL', 'ID', 'NAMA', 'JAWATAN', 'KATEGORI', 'NO. KP']];
  (data.staff || []).forEach(s => staffRows.push([s.bil, s.id, s.name, s.role, s.category, "'" + (s.ic || '')]));
  st.getRange(1, 1, staffRows.length, 6).setValues(staffRows);
  st.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#b91c1c').setFontColor('#ffffff');

  // Rekod Kehadiran (semua program)
  const kh = sheet_('KEHADIRAN');
  kh.clear();
  const rows = [['TARIKH', 'PROGRAM', 'BIL', 'NAMA', 'JAWATAN', 'KATEGORI', 'STATUS', 'MASA', 'CATATAN']];
  (data.programs || []).forEach(p => {
    (data.staff || []).forEach(s => {
      const r = (p.records || {})[s.id];
      rows.push([p.date, p.title, s.bil, s.name, s.role, s.category,
        r ? (r.status || 'HADIR') : 'TIDAK HADIR', r ? (r.timeIn || '') : '', r ? (r.note || '') : '']);
    });
  });
  kh.getRange(1, 1, rows.length, 9).setValues(rows);
  kh.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#b91c1c').setFontColor('#ffffff');
  kh.setFrozenRows(1);
}

function uploadPhoto_(d) {
  try {
    const folder = getFolder_();
    const parts = d.data.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(parts[1]), mime, d.name || 'gambar.jpg');
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return { id: file.getId() };
  } catch (err) {
    return { error: String(err) };
  }
}

function getFolder_() {
  const name = 'GAMBAR OPR SKKE1';
  const it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

// Jalankan fungsi ini SEKALI dari editor untuk beri kebenaran Google Drive
function setupKebenaran() {
  getFolder_();
  Logger.log('Google Sheet data: ' + ss_().getUrl());
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
