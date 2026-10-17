// LaganMantra -> Google Sheet live sync (Google Apps Script)
// 1) Open your Google Sheet -> Extensions -> Apps Script -> paste this whole file -> Save
// 2) SECRET is already filled and matches the website file - do not change it
// 3) Deploy -> New deployment -> type: Web app -> Execute as: Me -> Who has access: Anyone -> Deploy
// 4) Copy the "Web app URL" and paste it in the admin panel -> Google Sheet tab
const SECRET = "LM-cbc34b700370c4b8d0609016";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.token !== SECRET) return out({ ok: false, error: "bad token" });
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(d.sheet) || ss.insertSheet(d.sheet);
    const rows = d.rows || [];
    if (!rows.length) return out({ ok: true, n: 0 });

    // headers (add any new columns automatically)
    let head = sh.getLastRow() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String) : [];
    const want = [];
    rows.forEach(r => Object.keys(r).forEach(k => { if (want.indexOf(k) < 0) want.push(k); }));
    const add = want.filter(k => head.indexOf(k) < 0);
    if (add.length) {
      head = head.concat(add);
      sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight("bold").setBackground("#f3e3b5");
      sh.setFrozenRows(1);
    }

    // find existing rows by key column (update instead of duplicate)
    const keyCol = head.indexOf(d.key) + 1;
    const last = sh.getLastRow();
    const idx = {};
    if (last > 1) sh.getRange(2, keyCol, last - 1, 1).getValues().forEach((r, i) => { idx[String(r[0])] = i + 2; });

    const appendRows = [];
    rows.forEach(r => {
      const arr = head.map(h => (r[h] === undefined ? "" : r[h]));
      const k = String(r[d.key]);
      if (idx[k]) sh.getRange(idx[k], 1, 1, head.length).setValues([arr]);
      else appendRows.push(arr);
    });
    if (appendRows.length) sh.getRange(sh.getLastRow() + 1, 1, appendRows.length, head.length).setValues(appendRows);
    return out({ ok: true, n: rows.length });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, msg: "LaganMantra sync is running" }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
