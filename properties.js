function property() {
  return {
    'guv' : {
      'suedsterne' : {
        'data' : {
          'id' : '1RoA5J-fHX-KyE5nDLFFenLrxhwA065K-fiyk4laYG3k',
          'tab' : 'Dateneingabe'
        }
      },
      'it_agile' : {
        'data' : {
          // *******!!!!! Production GuV !!!!!!*********
          'id' : '1X1iHySk9hoSNphzSiqNnE0ikV27VqMHHF3aD5r_lgec',
          // *** Test ***
//          'id' : '1jE5oAF3QY329IYOoOkoRpKlglwlZBJOkVDCbp3_t9-0',
          'tab' : 'Rohdaten',
        },
        'details' : {
          'tab' : 'Zell-Details',
          'cell' : 'C1'
        }
      }
    },
    'copy' : {
      'range' : 'A:O',
      'year' : 2020
    },
    'team' : 'Südsterne',
    'backup' : {
      'folder' : '_guv_backups'
    },
    'notification' : {
      'email' : 'suedsterne+guv_bot@it-agile.de'
    },
    'health' : {
      'indicator' : 'healthy',
      'error' : 'error',
      'runtime' : 'run_time'
    }
  }
}

function prop_set(property, value) {
  PropertiesService.getScriptProperties().setProperty(property, JSON.stringify(value))
}

function prop_get(property) {
  return JSON.parse(PropertiesService.getScriptProperties().getProperty(property))
}

function prop_del(property) {
  PropertiesService.getScriptProperties().deleteProperty(property)
}