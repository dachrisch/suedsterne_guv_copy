function update_guv_with_sued_data() {
  console.info('updating GuV...')
  let guv_data = _current_guv_data_without_current_sued()
  let sued_data = _current_sued_data()
  let updated_data = guv_data.concat(sued_data)
  
  _update_guv(updated_data)
  
  console.info('finished updating [%s] data rows.', updated_data.length)
}


function _update_guv(data) {
  let guv_tab = property().itagile_guv_sheet.getSheetByName(property().itagile_guv_data_tab)
  let clear_range = guv_tab.getRange(2, 1, guv_tab.getLastRow(), property().copy_rows)
  let insert_range = guv_tab.getRange(2, 1, data.length + 1, property().copy_rows)
  let copy_range = guv_tab.getRange(property().copy_range)
  
  let backup_file = create_copy(property().itagile_guv_sheet, 'Backup')
  
  let backup_values = clear_range.getValues()
  let backup_validations = copy_range.getDataValidations()
  try {
    console.log('clearing range [%s]', clear_range.getA1Notation())
    clear_range.clear()
    copy_range.setDataValidation(null)
    
    console.info('inserting [%d] data into new range [%s]', data.length, insert_range.getA1Notation())
    _sliced_insert(guv_tab, data, insert_range)
    
    if(!validate(property().itagile_guv_sheet, SpreadsheetApp.openById(backup_file.getId()), property().suedsterne_guv_sheet)) {
      throw 'failed to validate data'
    }
//  } catch (error) {
//    console.error('error while inserting new values: [%s]...restoring data', error)
//    clear_range.setValues(backup_values)
  } finally {
    copy_range.setDataValidations(backup_validations)
  }
}

function _sliced_insert(guv_tab, data, range, slice=1000) {
  for(let start = 0; start < data.length; start += slice) {
    let end = Math.min(start + slice, data.length)
    let insert_range = guv_tab.getRange(start + 2, 1, end - start, 15)
    let data_slice = data.slice(start, end)
    console.log('updating [%d] data into slice [%s]', data_slice.length, insert_range.getA1Notation())
    insert_range.setValues(data_slice)
  }
}