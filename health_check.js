function health_check() {

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const start_time = new Date()
    
    dry_run()
    
    const end_time = new Date()
    const run_time = Number(end_time) - Number(start_time)
    on_success(run_time)
  } catch(error) {
    on_error(error)
  }
  
  lock.releaseLock();
}

function raise_if_unhealty() {
  const script_properties = PropertiesService.getScriptProperties()
  if(script_properties.getProperty('healty') != true) {
    const error = script_properties.getProperty('error') || {toString:    function(){return 'no error recorded'}}
    error['type'] = 'unhealthy'
    throw error
  }
}

function dry_run() {
  const suedsterne_guv = SpreadsheetApp.openById(property().guv.suedsterne.data.id)
  const dry_run_file = create_copy({'getId': function() { return property().guv.it_agile.data.id}}, 'Dry')
  console.info('performing dry run on [%s]...', dry_run_file.getName())
  run_and_validate(suedsterne_guv, SpreadsheetApp.openById(dry_run_file.getId()))
  dry_run_file.setTrashed(true)
}

function on_success(run_time) {
  const script_properties = PropertiesService.getScriptProperties()
  const previous_run_time = script_properties.getProperty('run_time')
  if(previous_run_time != null && (run_time <= previous_run_time*.6 || run_time >= previous_run_time*1.4)) {
    on_error({'reason': `runtime deviated by more than 40%. was [${previous_run_time}], is now [${run_time}]`})
  } else {
    script_properties.deleteProperty('error')
    script_properties.setProperty('healthy', true)
    script_properties.setProperty('run_time', run_time)
    console.info(`script is HEALTHY! [${run_time}]s.`)
  }
}

function on_error(error) {
  const script_properties = PropertiesService.getScriptProperties()
  script_properties.setProperty('healthy', false)
  script_properties.setProperties({'error': error})
  console.error(error)
  throw error
}