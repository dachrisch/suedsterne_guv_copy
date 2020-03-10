function copy_suedsterne_guv_to_central_guv() {  
  const label = 'guv copy'
  console.time(label)

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    hot_run()
  } catch(error) {
    if(error['type'] === 'validation_failed') {
      MailApp.sendEmail(property().failure_email, error['subject'], error['action'])
      throw error['subject']
    } else {
      throw error
    }
  }
  
  
  lock.releaseLock();

  console.timeEnd(label)
}

function hot_run() {
  const suedsterne_guv = SpreadsheetApp.openById(property().suedsterne_guv_sheet_id)
  const central_guv = SpreadsheetApp.openById(property().itagile_guv_sheet_id)
  console.info('performing hot run on [%s]...', central_guv.getName())
  return run_and_validate(suedsterne_guv, central_guv)
}

function run_and_validate(source, destination) {
  console.log('backing up original guv [%s]...', destination.getName())
  const backup_file = create_copy(destination, 'Backup')
  delete_old_entries(destination)
  copy_new_values(source, destination)
  if(validate(destination, SpreadsheetApp.openById(backup_file.getId()), source)) {
    console.info('successfully validated all data rows. all is fine')
    log_update(destination)
  } else {
    const subject = Utilities.formatString('Failure during update of [%s]', destination.getName())
    const action = Utilities.formatString('Revert to previous version in [%s]', destination.getUrl())
    console.error('%s: %s', subject, action)
    throw {'type' : 'validation_failed', 'subject' : subject, 'action' : action }
  }

  return backup_file
}

function create_copy(guv_sheet, prefix) {
  backup_folder = DriveApp.getFoldersByName(property().backup_folder_name).next()
  backup_file = DriveApp.getFileById(guv_sheet.getId()).makeCopy(prefix + '_' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyyMMddHHmmss'), backup_folder)
  return backup_file
}
