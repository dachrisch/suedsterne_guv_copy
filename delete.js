function delete_old_entries(guv_sheet) {
  var rohdaten = guv_sheet.getSheetByName(property().guv.it_agile.data.tab)
  
  // filtered values aren't deleted properly
  if(rohdaten.getFilter() !== null) {
    rohdaten.getFilter().remove()
  }
  
  // collect indexes and reverse sort them (so we can delete from bottom to top to ensure index position to be safe)
  var suedsterne_row_indexes = rohdaten.getRange('A:C').getValues().map(function(row, index){ 
    if(row[2] === property().team && row[0] === property().copy.year) {
      return index + 1
    }
  }).filter(function(row) {return !(row === undefined)}).sort(function(a, b){ return b-a})
  
  console.info('deleting [%d] %s entries in [%s]...', suedsterne_row_indexes.length, property().team, guv_sheet.getName())
  
  console.log('deleting rows [%s]...', suedsterne_row_indexes)
  suedsterne_row_indexes.forEach(function(row, index){ 
    console.log(Utilities.formatString('[%02d%%] deleting row[%d]', (index / suedsterne_row_indexes.length*100), row + 1));
    rohdaten.deleteRow(row)
  })
  console.log('deleted [%d] entries', suedsterne_row_indexes.length)
}
