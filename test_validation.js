function test_validation() {
  var backup_sheet = SpreadsheetApp.openById("1-FZbnmT09Rcca90Wzw4w4EtOlAo76cJI8FaKqE_bZ5g")
  var changed_sheet = SpreadsheetApp.openById("1SCpIlHvLVIMT-HOmFgAHOSZ0lSkt_eXzK6o_eACrgI4")
  var suedsterne_guv = SpreadsheetApp.openById(property().suedsterne_guv_sheet_id)
  
  console.log(ScriptApp.getUserTriggers(backup_sheet))
  ScriptApp.getUserTriggers(backup_sheet).forEach(function(trigger){
    console.log(trigger.getEventType())
  })
  
  // TODO: refactor me
  Sheets.Spreadsheets.batchUpdate(resource, spreadsheetId)
//  validate(changed_sheet, backup_sheet, suedsterne_guv)
}
