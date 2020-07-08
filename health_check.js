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
  const health = prop_get(property().health.indicator)
  console.log(`checking if script is healty: ${health}`)
  if(health != true) {
    const error = prop_get('error') || {toString:    function(){return 'no error recorded'}}
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
  const previous_run_time = prop_get(property().health.runtime)
  if(previous_run_time != null && (run_time <= previous_run_time*.6 || run_time >= previous_run_time*1.4)) {
    on_error({toString:    function(){return `runtime deviated by more than 40%. was [${previous_run_time}], is now [${run_time}]`}})
  } else {
    prop_del(property().health.error)
    prop_set(property().health.indicator, true)
    prop_set(property().health.runtime, run_time)
    console.info(`script is HEALTHY! [${run_time}]s.`)
  }
}

function on_error(error) {
  prop_set(property().health.indicator, false)
  prop_set(property().health.error, error)
  console.error(error)
  throw error
}
