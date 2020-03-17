function batch_delete_old_entries(destination) {
  var rohdaten = destination.getSheetByName(property().guv.it_agile.data.tab)
  var sheet_id = rohdaten.getSheetId()
  
  // filtered values aren't deleted properly
  if(rohdaten.getFilter() !== null) {
    rohdaten.getFilter().remove()
  }
  
  // collect indexes and reverse sort them (so we can delete from bottom to top to ensure index position to be safe)
  var suedsterne_row_delete_dimensions = rohdaten.getRange(property().copy.range).getValues().map(function(row, index){ 
    if(row[2] === property().team && row[0] === property().copy.year) {
      return {
        "deleteDimension": {
          "range": {
            "sheetId" : sheet_id,
            "dimension": "ROWS",
            "startIndex": index,
            "endIndex": index + 1
          }
        }
      }
    }
  }).filter(function(row) {return !(row === undefined)}).sort(function(a, b){ return b.deleteDimension.range.startIndex-a.deleteDimension.range.startIndex})
  
  console.info('deleting [%d] %s entries in [%s]...', suedsterne_row_delete_dimensions.length, property().team, destination.getName())
  
  if(suedsterne_row_delete_dimensions.length > 0) {
    console.log('deleting rows [%s]', suedsterne_row_delete_dimensions.map(function(item){ return item.deleteDimension.range.startIndex}))
    Sheets.Spreadsheets.batchUpdate({'requests': suedsterne_row_delete_dimensions}, destination.getId())
    SpreadsheetApp.flush()

    console.info('deleted [%d] entries', suedsterne_row_delete_dimensions.length)
  }

}

function filter_team_values_in_year(sheet) {
  return filter_sheet(sheet, property().guv.it_agile.data.tab, function(row){
    return row[2] === property().team && row[0] === property().copy.year
  })
}

