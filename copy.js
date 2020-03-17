function update_sheet(source, destination) {
  var requests = batch_delete_old_entries_requests(destination)
  
  requests.push(copy_new_values_requests(source, destination))
  
  Sheets.Spreadsheets.batchUpdate({'requests': requests}, destination.getId())
}

function batch_delete_old_entries_requests(destination) {
  var rohdaten = destination.getSheetByName(property().itagile_guv_data_tab)
  var sheet_id = rohdaten.getSheetId()
  
  // filtered values aren't deleted properly
  if(rohdaten.getFilter() !== null) {
    rohdaten.getFilter().remove()
  }
  
  // collect indexes and reverse sort them (so we can delete from bottom to top to ensure index position to be safe)
  var suedsterne_row_delete_dimensions = rohdaten.getRange(property().copy_range).getValues().map(function(row, index){ 
    if(row[2] === property().team_name && row[0] === property().copy_year) {
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
  
  console.info('deleting [%d] %s entries in [%s]...', suedsterne_row_delete_dimensions.length, property().team_name, destination.getName())
  
  console.log('deleting rows [%s]', suedsterne_row_delete_dimensions.map(function(item){ return item.deleteDimension.range.startIndex}))

  return suedsterne_row_delete_dimensions  
}

function copy_new_values_requests(source, destination) {
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
  
   var value_input_option = {
    'valueInputOption': 'USER_ENTERED',
    'data': [
      {
        'range': Utilities.formatString('%s!%s', property().itagile_guv_data_tab, target_range),
        'majorDimension': 'ROWS',
        'values': source_data
      }
    ]
  }

  return value_input_option
}

function log_update(destination) {
  destination.getSheetByName(property().itagile_details_data_tab)
  .getRange(property().details_cell)
  .setValue(Utilities.formatString('Stand Daten Südsterne: %s', Utilities.formatDate(new Date(), "GMT+1", "dd.MM.yyyy")))
}