function array_equals(a, b){
  if(!(a.length === b.length)) {
    console.log('array size differs: [%d] <> [%d]', a.length, b.length)
  }
  return a.length === b.length && a.every(function(item,idx) { 
    if(!(item === b[idx])) {
      console.log('row[%d] FAIL: [%s] <> [%s]', idx, item, b[idx])
    }
    return item === b[idx]
  })
}

function d2_array_equals(a, b){
  if(!(a.length === b.length)) {
    console.log('array size differs: [%d] <> [%d]', a.length, b.length)
  }
  return a.length === b.length && a.every(function(item,idx) { return array_equals(item, b[idx])})
}

function filter_sheet(sheet, tab, predicate) {
  var data = sheet
  .getSheetByName(tab)
  .getRange(property().copy.range)
  .getValues()
  .filter(function(row, index){ 
    return predicate(row, index)
  })
  
  var defined_data = data.filter(function(row) {return !(row === undefined)})
  
  var filled_data = defined_data.filter(function(row){ 
    return row.some(function(item){ 
      return Boolean(item)
    })
  })
  
  return filled_data
}