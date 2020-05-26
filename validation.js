function validate(guv_sheet, backup_sheet, suedsterne_guv) {
  validate_untouched_values(guv_sheet, backup_sheet)
  validate_copied_values(suedsterne_guv, guv_sheet)
}

function validate_untouched_values(guv_sheet, backup_sheet) {
  validate_untouched_values_not_year(guv_sheet, backup_sheet)
  validate_untouched_values_not_team(guv_sheet, backup_sheet)
}

function validate_untouched_values_not_year(guv_sheet, backup_sheet) {

  var original = filter_sheet(backup_sheet, property().guv.it_agile.data.tab, 
                              function(row, index) {return (row[2] === property().team && row[0] != property().copy.year)})
  
  var validation = filter_sheet(guv_sheet, property().guv.it_agile.data.tab, 
                                function(row, index) {return (row[2] === property().team && row[0] != property().copy.year)})

  console.log('validating [%d] existing %s team values remaining intact...', original.length, property().team)
  validate_values(original, validation)
}

function validate_untouched_values_not_team(guv_sheet, backup_sheet) {
  var original = filter_sheet(backup_sheet, property().guv.it_agile.data.tab, 
                              function(row, index) {return (index > 0 && row[2] != property().team)})
  var validation = filter_sheet(guv_sheet, property().guv.it_agile.data.tab,
                                function(row, index) {return (index > 0 && row[2] != property().team)})

  console.log('validating [%d] existing other team values remaining intact...', original.length)
  validate_values(original, validation)
}

function validate_copied_values(suedsterne_guv, guv_sheet) {
  var original = sued_to_guv(filter_sheet(suedsterne_guv, property().guv.suedsterne.data.tab,
                              function(row, index){return (row[1] === property().copy.year)}))
  
  
  var copied = filter_sheet(guv_sheet, property().guv.it_agile.data.tab, 
                            function(row, index) {return (row[2] === property().team && row[0] === property().copy.year)})
  
  console.log('validating [%d] %s values successfully copied...', original.length, property().team)
  validate_values(original, copied)
}

