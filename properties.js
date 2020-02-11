function property() {
  return new function() {
    this.suedsterne_guv_sheet_id = '1Jt3hcAmm3m_pLZ9OjNLZG8TcqY9yE9xMVeZVCtinFfw'
    this.suedsterne_guv_sheet = open_sheet(this.suedsterne_guv_sheet_id)
    this.suedsterne_guv_data_tab = 'Kopiere das'
    // GuV zum Testen
    // this.itagile_guv_sheet_id = '1wkcR4JffEwbJ7IwuoqtDH1bktq3un9RTGTL6IUmvtvs'
    // *******!!!!! Production GuV !!!!!!*********
    // Dry Run
    this.itagile_guv_sheet_id = '1uKkwqCx-E8lhzT0_edUJhwYteRaGpwKX8AkDMq0985o'
    this.itagile_guv_sheet = open_sheet(this.itagile_guv_sheet_id)
    this.itagile_guv_data_tab = 'Rohdaten'
    this.expected_header = 'Jahr,Monat,Zelle,µZell,MA,Beschreibung,Kernprodukt,Typ,Ertrag,Aufwand,#Sätze,#Tagessatz,#RK,Reisekosten,RG-Nr'.split(',')
    this.copy_range = 'A:O'
    this.copy_rows = 15
    this.copy_year = 2020
    this.team_name = 'Südsterne'
    this.backup_folder_name = '_guv_backups'
    this.failure_email = 'cd+guv_bot@it-agile.de'
  }
}
