function test_validation() {
  var guv_sheet = SpreadsheetApp.openById(property().guv.it_agile.data.id)
  var suedsterne_guv = SpreadsheetApp.openById(property().guv.suedsterne.data.id)
  
  validate_copied_values(suedsterne_guv, guv_sheet)
}
