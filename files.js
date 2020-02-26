function create_copy(guv_sheet, prefix) {
  backup_folder = DriveApp.getFoldersByName(property().backup_folder_name).next()
  backup_file = DriveApp.getFileById(guv_sheet.getId()).makeCopy(prefix + '_' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyyMMddHHmmss'), backup_folder)
  return backup_file
}

function open_sheet(sheet_id) {
  return SpreadsheetApp.openById(sheet_id)
}