function validate(guv_sheet, backup_sheet, suedsterne_guv) {
  return validate_untouched_values(guv_sheet, backup_sheet) && 
    validate_copied_values(suedsterne_guv, guv_sheet)
}

function validate_untouched_values(guv_sheet, backup_sheet) {
  return validate_untouched_values_not_year(guv_sheet, backup_sheet) &&
    validate_untouched_values_not_team(guv_sheet, backup_sheet)
}

function validate_untouched_values_not_year(guv_sheet, backup_sheet) {

  var original = filter_sheet(backup_sheet, property().itagile_guv_data_tab, 
                              function(row, index) {return (row[2] === property().team_name && row[0] != property().copy_year)})
  
  var validation = filter_sheet(guv_sheet, property().itagile_guv_data_tab, 
                                function(row, index) {return (row[2] === property().team_name && row[0] != property().copy_year)})

  console.log('validating [%d] existing %s team values remaining intact...', validation.length, property().team_name)
  return validate_values(original, validation)
}

function validate_untouched_values_not_team(guv_sheet, backup_sheet) {
  var original = filter_sheet(backup_sheet, property().itagile_guv_data_tab, 
                              function(row, index) {return (index > 0 && row[2] != property().team_name)})
  var validation = filter_sheet(guv_sheet, property().itagile_guv_data_tab,
                                function(row, index) {return (index > 0 && row[2] != property().team_name)})

  console.log('validating [%d] existing other team values remaining intact...', validation.length)
  return validate_values(original, validation)
}

function validate_copied_values(suedsterne_guv, guv_sheet) {
  var original = filter_sheet(suedsterne_guv, property().suedsterne_guv_data_tab,
                              function(row, index){return (row[0] === property().copy_year)})
  
  var copied = filter_sheet(guv_sheet, property().itagile_guv_data_tab, 
                            function(row, index) {return (row[2] === property().team_name && row[0] === property().copy_year)})
  
  console.log('validating [%d] %s values successfully copied...', original.length, property().team_name)
  return validate_values(original, copied)
}

function array_equals(a, b){
  return a.length === b.length && a.every(function(item,idx) { return item === b[idx]})
}

function d2_array_equals(a, b){
  return a.length === b.length && a.every(function(item,idx) { return array_equals(item, b[idx])})
}

function validate_values(original_data, validation_data) {
  var same = d2_array_equals(original_data,validation_data)
  if(same) {
    console.log('success')
  } else {
    console.log('fail! validating every row...')
    for(var i=0; i<validation_data.length; i++) {
      if(array_equals(original_data[i], validation_data[i])) {
        console.log('row[%d] OK', i)
      } else {
        console.log('row[%d] FAIL: [%s] <> [%s]', i, original_data[i], validation_data[i])
      }
    }
    console.log(original_data)
    console.log(validation_data)
  }
  return same
}
