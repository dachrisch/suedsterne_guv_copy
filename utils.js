function validate_values(original_data, validation_data) {
  assert_d2_array_equals(original_data,validation_data)
  console.log('SUCCESS')
}

function log_and_throw(error_message, recent_messages) {
  recent_messages.forEach(function(message) {
    console.log(message)
  })
  console.error('ERROR: ' + error_message)
  throw error_message
}

function assert_array_equals(a, b){
  if(!(a.length === b.length)) {
    let message = Utilities.formatString('array size differs: [%s](%d) <> [%s](%d)', a, a.length, b, b.length)
    log_and_throw(message)
  }
  let messages = []
  a.every(function(item,idx) { 
    // adding instead of stringFormat to be able to compute undefined values
    let message = 'comparing item(' + idx + ') in [' + a + '] <> [' + b + ']: [' + item + '] <> [' + b[idx] + ']'
    
    if(item === b[idx]) {
      messages.push(Utilities.formatString('SUCCESS %s', message))
      return true
    } else {
      log_and_throw(message, messages)
    }
  })
  return true
}

function assert_d2_array_equals(a, b){
  if(!(a.length === b.length)) {
    let message = Utilities.formatString('array size differs: (%d) <> (%d)', a.length, b.length)
    log_and_throw(message)
  }
  a.every(function(item,idx) { return assert_array_equals(item, b[idx])})
}

function filter_sheet(sheet, tab, predicate) {
  var data = sheet
  .getSheetByName(tab)
  .getRange(property().copy.range)
  .getValues()
  .filter(function(row, index){ 
    return predicate(row, index)
  })
  
  var defined_data = data.filter(function(row) {return !(row === undefined)})
  
  var filled_data = defined_data.filter(function(row){ 
    return row.some(function(item){ 
      return Boolean(item)
    })
  })
  
  return filled_data
}

function create_copy(guv_sheet, prefix) {
  backup_folder = DriveApp.getFoldersByName(property().backup.folder).next()
  backup_file = DriveApp.getFileById(guv_sheet.getId()).makeCopy(prefix + '_' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyyMMddHHmmss'), backup_folder)
  return backup_file
}
