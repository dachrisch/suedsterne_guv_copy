function _current_guv_data_without_current_sued() {
  let current_guv_data = filter_sheet(property().itagile_guv_sheet,
                                       property().itagile_guv_data_tab,
                                       function(row){return row[0]})
  
  let header_row = current_guv_data[0]
  
  if(array_equals(header_row, property().expected_header)) {
    current_guv_data = current_guv_data.slice(1)
  } else {
    throw Utilities.formatString('header row not correct: [%s] <> [%s]', header_row, property().expected_header)
  }
  
  console.info('found [%d] entries in GuV [%s]', current_guv_data.length, property().itagile_guv_sheet.getName())
  
  let current_data_without_current_sued = current_guv_data
  .filter(function (row, index){return !(row[2] === property().team_name && row[0] === property().copy_year)})
  
  console.log('[%d] other teams values after filtering out sued values', current_data_without_current_sued.length)
  
  return current_data_without_current_sued
}

function _current_sued_data() {  
  let _current_sued_data = filter_sheet(property().suedsterne_guv_sheet, 
                                         property().suedsterne_guv_data_tab,
                                         function(row){ 
                                           return (row[0] === property().copy_year)
                                         })
  console.info('found [%d] entries in Sued GuV [%s]', _current_sued_data.length, property().suedsterne_guv_sheet.getName())
  
  return _current_sued_data
}


function filter_sheet(sheet, tab, predicate) {
  var data = sheet
  .getSheetByName(tab)
  .getRange(property().copy_range)
  .getValues()
  .filter(function(row, index){ 
    return predicate(row, index)
  }).filter(function(row) {return !(row === undefined)})
  
  return data
}