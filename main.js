function copy_suedsterne_guv_to_central_guv() {  
  var label = 'guv copy'
  console.time(label)

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  // throws error when validating fails
  try {
    dry_run()
  } catch(error) {
    throw error
  }
  
  try {
    backup_file = hot_run()
  
    production_mailing(suedsterne_guv, central_guv, backup_file)
  } catch(error) {
    MailApp.sendEmail(property().failure_email, error['subject'], error['action'])
    throw message
  }
  
  lock.releaseLock();

  console.timeEnd(label)
}

function production_mailing(suedsterne_guv, central_guv, backup_file) {
  
  MailApp.sendEmail(property().failure_email, 
                    '[GuV copy] - Please check production run', 
                    Utilities.formatString('This was the first production run, which completed successfully. As a double check:\n'+
                                           '- Südsterne values are same in "%s" @ [%s] and "%s" @ [%s]\n\n'+
                                           '- Other team values are same in "%s" @ [%s] and "%s" @ [%s]\n\n'+
                                           '- logs under [%s]\n\n'+
                                           '- nothing else is boken (be creative ;) )\n',
                                           central_guv.getName(),central_guv.getUrl(),
                    suedsterne_guv.getName(), suedsterne_guv.getUrl(),
                    central_guv.getName(), central_guv.getUrl(),
                    backup_file.getName(), backup_file.getUrl(),
                    'https://console.cloud.google.com/logs/viewer?interval=PT1H&authuser=0&project=suedsterne-1328&resource=app_script_function'
                   )
  )
}

function dry_run() {
  var suedsterne_guv = SpreadsheetApp.openById(property().suedsterne_guv_sheet_id)
  var central_guv = SpreadsheetApp.openById(property().itagile_guv_sheet_id)
  var dry_file = create_copy(central_guv, 'Dry run')
  console.info('performing dry run on sheet [%s]', dry_file.getName())
  return run_and_validate(suedsterne_guv, SpreadsheetApp.openById(dry_file.getId()))
}

function hot_run() {
  var suedsterne_guv = SpreadsheetApp.openById(property().suedsterne_guv_sheet_id)
  var central_guv = SpreadsheetApp.openById(property().itagile_guv_sheet_id)
  console.info('performing hot run on [%s]', central_guv.getName())
  return run_and_validate(suedsterne_guv, central_guv)
}

function run_and_validate(source, destination) {
  console.log('backing up original guv [%s]...', destination.getName())
  var backup_file = create_copy(destination, 'Backup')
  delete_old_entries(destination)
  copy_new_values(source, destination)
  if(!validate(destination, SpreadsheetApp.openById(backup_file.getId()), source)) {
    console.info('successfully validated all [%d] data rows. all is fine', validation_data.length)
  } else {
    var subject = Utilities.formatString('Failure during update of [%s]', guv_sheet.getName())
    var action = Utilities.formatString('Please restore backup [%s]', backup_sheet.getUrl())
    console.error('%s: %s', subject, action)
    throw {'subject' : subject, 'action' : action }
  }

  
  return backup_file
}

function create_copy(guv_sheet, prefix) {
  backup_folder = DriveApp.getFoldersByName(property().backup_folder_name).next()
  backup_file = DriveApp.getFileById(guv_sheet.getId()).makeCopy(prefix + '_' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyyMMddHHmmss'), backup_folder)
  return backup_file
}
