function validate(guv_sheet, backup_sheet, suedsterne_guv) {
  return validate_untouched_values(guv_sheet, backup_sheet) && 
    validate_copied_values(suedsterne_guv, guv_sheet, backup_sheet)
}

function validate_untouched_values(guv_sheet, backup_sheet) {
  var team_name = property().team_name
  var copy_year = property().copy_year

  var original_data_not_team = filter_sheet(backup_sheet, property().itagile_guv_data_tab, 
                                            function(row, index) {return (index > 0 && row[2] != team_name)})

  var original_data_team_not_in_year = filter_sheet(backup_sheet, property().itagile_guv_data_tab, 
                                                    function(row, index) {return (row[2] === team_name && row[0] != copy_year)})
  
  var validation_data_not_team = filter_sheet(guv_sheet, property().itagile_guv_data_tab,
                                              function(row, index) {return (index > 0 && row[2] != team_name)})
  
  var validation_data_team_not_in_year = filter_sheet(guv_sheet, property().itagile_guv_data_tab, 
                                                      function(row, index) {return (row[2] === team_name && row[0] != copy_year)})

  console.log('validating [%d] existing other team values remaining intact...', original_data_not_team.length)
  validate_values(original_data_not_team, validation_data_not_team, guv_sheet, backup_sheet)
  console.log('validating [%d] existing %s team values remaining intact...', original_data_team_not_in_year.length, team_name)
  return validate_values(original_data_team_not_in_year, validation_data_team_not_in_year)
}

function validate_copied_values(suedsterne_guv, guv_sheet, backup_sheet) {
  var team_name = property().team_name
  var copy_year = property().copy_year

  var original_suedsterne_data = filter_sheet(suedsterne_guv, property().suedsterne_guv_data_tab,
                                              function(row, index){return (row[0] === copy_year)})
  
  var copied_suedsterne_data = filter_sheet(guv_sheet, property().itagile_guv_data_tab, 
                                                      function(row, index) {return (row[2] === team_name && row[0] === copy_year)})
  
  console.log('validating [%d] %s values successfully copied...', original_suedsterne_data.length, team_name)
  return validate_values(original_suedsterne_data, copied_suedsterne_data)
}

function array_equals(a, b){
  return a.length === b.length && a.every(function(item,idx) { return item === b[idx]})
}

function d2_array_equals(a, b){
  return a.length === b.length && a.every(function(item,idx) { return array_equals(item, b[idx])})
}

function validate_values(original_data, validation_data) {
  return d2_array_equals(original_data,validation_data)  
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