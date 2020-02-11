function update_guv_with_sued_data() {
  console.info('updating GuV...')
  let guv_data = current_guv_data_without_current_sued()
  let sued_data = current_sued_data()
  let updated_data = guv_data.concat(sued_data)
  
  update_guv(updated_data)
  
  console.info('finished updating [%s] data rows.', updated_data.length)
}


function current_guv_data_without_current_sued() {
  let guv_sheet = SpreadsheetApp.openById(property().itagile_guv_sheet_id)
  let current_guv_data = guv_sheet
  .getSheetByName(property().itagile_guv_data_tab)
  .getRange(property().copy_range).getValues()
  
  let header_row = current_guv_data[0]
  let expected_header = 'Jahr,Monat,Zelle,µZell,MA,Beschreibung,Kernprodukt,Typ,Ertrag,Aufwand,#Sätze,#Tagessatz,#RK,Reisekosten,RG-Nr'.split(',')
  
  if(array_equals(header_row, expected_header)) {
    current_guv_data = current_guv_data.slice(1)
  } else {
    throw Utilities.formatString('header row not correct: [%s] <> [%s]', header_row, expected_header)
  }
  
  console.info('found [%d] entries in GuV [%s]', current_guv_data.length, guv_sheet.getName())
  
  let current_data_without_current_sued = current_guv_data
  .filter(function (row)
          {
            return !(row[2] === property().team_name && row[0] === property().copy_year)
          })
  
  console.log('[%d] other teams values after filtering out sued values', current_data_without_current_sued.length)
  
  return current_data_without_current_sued
}

function current_sued_data() {
  let sued_sheet = SpreadsheetApp.openById(property().suedsterne_guv_sheet_id)
  let current_sued_data = sued_sheet
  .getSheetByName(property().suedsterne_guv_data_tab)
  .getRange(property().copy_range).getValues()
  .filter(function(row){ 
    return (row[0] === property().copy_year)
  })
  console.info('found [%d] entries in Sued GuV [%s]', current_sued_data.length, sued_sheet.getName())
  
  return current_sued_data
}

function update_guv(data) {
  let guv_tab = SpreadsheetApp.openById(property().itagile_guv_sheet_id).getSheetByName(property().itagile_guv_data_tab)
  let last_row = guv_tab.getLastRow()
  let range_x_y = property().copy_range.split(':')
  let clear_range = guv_tab.getRange(Utilities.formatString('%s%d:%s%d', range_x_y[0], 2, range_x_y[1], last_row))
  let insert_range = guv_tab.getRange(Utilities.formatString('%s%d:%s%d', range_x_y[0], 2, range_x_y[1], data.length + 1))
  let copy_range = guv_tab.getRange(property().copy_range)
  
  let backup_values = clear_range.getValues()
  let backup_validations = copy_range.getDataValidations()
  try {
    console.log('clearing range [%s]', clear_range.getA1Notation())
    clear_range.clear()
    copy_range.setDataValidation(null)
    
    console.info('inserting [%d] data into new range [%s]', data.length, insert_range.getA1Notation())
    insert_range.setValues(data)
  } catch (error) {
    console.error('error while inserting new values: [%s]...restoring data', error)
    clear_range.setValues(backup_values)
  } finally {
    copy_range.setDataValidations(backup_validations)
  }
}