function test_validation() {
  var backup_sheet = SpreadsheetApp.openById("1CruxuGxQp7YO3L3gvcAHK7QQ9bBxczViPsexCjHXF2Q")
  var changed_sheet = SpreadsheetApp.openById("1SCpIlHvLVIMT-HOmFgAHOSZ0lSkt_eXzK6o_eACrgI4")
  var suedsterne_guv = SpreadsheetApp.openById(property().suedsterne_guv_sheet_id)
  
  validate(changed_sheet, backup_sheet, suedsterne_guv)
}
