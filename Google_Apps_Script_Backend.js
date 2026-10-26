// ==========================================================
// ZUDONET TECHNOLOGIES - GOOGLE APPS SCRIPT FOR GOOGLE SHEETS
// Adopted from html-form-to-google-sheet repository
// ==========================================================

var sheetName = 'Sheet1';
var scriptProp = PropertiesService.getScriptProperties();

// STEP 1: Run this function ONCE after pasting the code to link your sheet automatically
function initialSetup() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
  Logger.log('Connected to Sheet ID: ' + activeSpreadsheet.getId());
}

// Backward compatibility with intialSetup typo from original repo
function intialSetup() {
  initialSetup();
}

// STEP 2: Handles POST requests from the website form
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);

    // Read the column headers in Row 1
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    // Support both FormData (e.parameter) and JSON postData
    var data = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var k in parsed) {
          if (!data[k]) data[k] = parsed[k];
        }
      } catch (err) {}
    }

    // Map each column header to the incoming field
    var newRow = headers.map(function(header) {
      if (header === 'timestamp') {
        return new Date();
      }
      return data[header] !== undefined ? data[header] : '';
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
