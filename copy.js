function copy_new_values(source, destination) {
  const target_sheet = destination.getSheetByName(property().guv.it_agile.data.tab)
  const source_data = sued_to_guv(filter_sheet(source, property().guv.suedsterne.data.tab,
                                             function(row){ 
                                               return (row[1] === property().copy.year)
                                             })
                               )
  const first_row_for_copy = target_sheet.getLastRow() + 1

  const range_x_y = property().copy.range.split(':')
  
  if(source_data.length < 1) { throw 'Nothing to copy' }
  const target_range = Utilities.formatString('%s%d:%s%d', range_x_y[0], first_row_for_copy, range_x_y[1], first_row_for_copy + source_data.length - 1)
  console.info('copying from [%d] entries from [%s] to [%s]:[%s]...', source_data.length, source.getName(), destination.getName(), target_range)
  
  target_sheet.getRange(target_range).setValues(source_data)
  console.log('done')
}

function log_update(destination) {
  destination.getSheetByName(property().guv.it_agile.details.tab)
  .getRange(property().guv.it_agile.details.cell)
  .setValue(Utilities.formatString('Stand Daten Südsterne: %s', Utilities.formatDate(new Date(), "GMT+1", "dd.MM.yyyy")))
}