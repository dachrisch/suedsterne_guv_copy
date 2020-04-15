function test_validation() {
  var guv_sheet = SpreadsheetApp.openById(property().guv.it_agile.data.id)
  var suedsterne_guv = SpreadsheetApp.openById(property().guv.suedsterne.data.id)
  
  console.log(validate_copied_values(suedsterne_guv, guv_sheet))
}

function test_delete_sleep() {
  var guv_sheet = SpreadsheetApp.openById(property().guv.it_agile.data.id)
  
  batch_delete_old_entries(guv_sheet)
}

function delete_file() {
  DriveApp.getFilesByName('Backup_20200415114054').next().setTrashed(true)
}  