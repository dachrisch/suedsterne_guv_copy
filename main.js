function copy_suedsterne_guv_to_central_guv() {  
  const label = 'guv copy'
  console.time(label)

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    hot_run()
  } catch(error) {
    if(error['type'] === 'validation_failed') {
      MailApp.sendEmail(property().notification.email, error['subject'], Utilities.formatString('%s\n%s', error['message'], error['action']))
      throw Utilities.formatString('%s: %s', error['subject'], error['message'])
    } else if(error['type'] === 'mapping_error') {
      MailApp.sendEmail(property().notification.email, 'Mapping error - check Source file', Utilities.formatString('%s\n%s', error['message'], error['details']))
      throw Utilities.formatString('[%s] %s', error['message'], error['details'])
    } else {
      throw error
    }
  }
  
  
  lock.releaseLock();

  console.timeEnd(label)
}

function hot_run() {
  const suedsterne_guv = SpreadsheetApp.openById(property().guv.suedsterne.data.id)
  const central_guv = SpreadsheetApp.openById(property().guv.it_agile.data.id)
  console.info('performing hot run on [%s]...', central_guv.getName())
  run_and_validate(suedsterne_guv, central_guv)
}

function run_and_validate(source, destination) {
  console.log('backing up original guv [%s]...', destination.getName())
  const backup_file = create_copy(destination, 'Backup')
  batch_delete_old_entries(destination)
  copy_new_values(source, destination)
  try {
    validate(destination, SpreadsheetApp.openById(backup_file.getId()), source)
    console.info('successfully validated all data rows. all is fine')
    log_update(destination)
    backup_file.setTrashed(true)
  } catch(error) {
    const subject = Utilities.formatString('Failure during update of [%s]', destination.getName())
    const action = Utilities.formatString('Revert to previous version in [%s]', destination.getUrl())
    const error_message = error
    console.error('%s: %s', subject, error_message)
    throw {'type' : 'validation_failed', 'subject' : subject, 'action' : action, 'message' : error_message }
  }
}
