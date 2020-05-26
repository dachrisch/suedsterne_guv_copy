function mate_to_inital(mate) {
  const mapping = {
    'Christian' : 'CD',
    'Benjamin' : 'BI',
    'Tom' : 'TZ',
    'Anna' : 'AL',
    'Sebastian' : 'SK',
    'Christoph' : 'CK',
    'Myriam' : 'MT',
    'Maren' : 'MU',
    'Peter' : 'PR',
    'Ilja' : 'IP'
  }
  if (!mapping[mate]) {
    throw {'type' : 'mapping_error', 'message' : 'Invalid Mate: ' + mate}
  }
  return mapping[mate]
}

function sued_to_guv(data) {
  return data.map(function(row){
    try {
      //      Jahr	Monat	Zelle			µZell	MA				Beschreibung	Kernprodukt	Typ	Ertrag	Aufwand	#Sätze	#Tagessatz	#RK	Reisekosten	RG-Nr
      return [row[1], row[0], property().team, '', mate_to_inital(row[2]), row[3], row[10], row[11], row[4], row[5], row[6], row[7], row[8], row[9], row[13]]
    } catch(error) {
      error['details'] = 'While mapping row: ' + row
      throw error
    }
  })
}