function delete_old_entries(guv_sheet, backup_file) {
  var rohdaten = guv_sheet.getSheetByName(property().itagile_guv_data_tab)
  
  // collect indexes and reverse sort them (so we can delete from bottom to top to ensure index position to be safe)
  var suedsterne_row_indexes = rohdaten.getRange('A:C').getValues().map(function(row, index){ 
    if(row[2] === property().team_name && row[0] === property().copy_year) {
      return index
    }
  }).filter(function(row) {return !(row === undefined)}).sort(function(a, b){ return b-a})
  
  console.info('deleting [%d] %s entries in [%s]...', suedsterne_row_indexes.length, property().team_name, guv_sheet.getName())
  
  console.log('deleting rows [%s]...', suedsterne_row_indexes)
  suedsterne_row_indexes.forEach(function(row, index){ 
    console.log(Utilities.formatString('[%02d%%]deleting row[%d]', (index / suedsterne_row_indexes.length*100), row + 1));
    rohdaten.deleteRow(row + 1) 
    validate_untouched_values(guv_sheet, backup_file)
  })
  console.log('deleted [%d] entries', suedsterne_row_indexes.length)
}

function copy_new_values(source, destination) {
  var source_sheet = source.getSheetByName(property().suedsterne_guv_data_tab)
  var target_sheet = destination.getSheetByName(property().itagile_guv_data_tab)
  var source_data = source_sheet.getRange(property().copy_range).getValues().filter(function(row){ 
    return (row[0] === property().copy_year)
  })
  var first_row_for_copy = target_sheet.getLastRow() + 1

  var range_x_y = property().copy_range.split(':')
  
  if(source_data.length < 1) { throw 'Nothing to copy' }
  var target_range = Utilities.formatString('%s%d:%s%d', range_x_y[0], first_row_for_copy, range_x_y[1], first_row_for_copy + source_data.length - 1)
  console.info('copying from [%d] entries from [%s] to [%s]:[%s]...', source_data.length, source.getName(), destination.getName(), target_range)
  
  target_sheet.getRange(target_range).setValues(source_data)
  console.log('done')
}