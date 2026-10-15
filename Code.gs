/**
 * SISTEM KEHADIRAN GURU & STAF - SK KING EDWARD VII (1)
 * Backend Google Apps Script (Google Sheet sebagai pangkalan data)
 * Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone
 */

const CHUNK = 45000;

function doGet() {
  const props = readData_();
  return json_(props);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const stamp = new Date().toISOString();
    data.stamp = stamp;
    writeData_(data);
    writeReadableSheets_(data);
    return json_({ ok: true, stamp: stamp });
  } finally {
    lock.releaseLock();
  }
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
