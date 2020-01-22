# Scheduler

The scheduler is a wrapper for 'node-schedule'

The scheduler can handle multiple jobs for you easaly.

Scheduler
```javascript
// javascript 
var smanager = require('schedule-manager').default;

// typescript
import smanager from 'schedule-manager';

//create a job
var jobManager = new smanager();

// scheduled example 
// timings.second = 10 => at 10 second of time

// static example
// timings.seconds = 10 => from now every 10 second

// every second, minute, hour, day, dayOfWeek, dayOfMonth...
// timings.second = -1;
var timings = smanager.getTimingsObject('static'); // static | scheduled

// example executes every 10 seconds
// -1 acts like a wildcard
timings.seconds= 10;
timings.minutes = -1;
timings.houres = -1;
timings.days = -1;
timings.dayOfWeek = -1;
timings.dayOfMonth = -1;

// add job
jobManager.addJob([name], timings, fn);

// remove job
jobManager.removeJob(name);

// start job direct
jobManager.startJob([name], timings, fn);

// stop job direct
jobManager.stopJob(name);

// start all unactive jobs
jobManager.start();

// stop all active jobs
jobManager.stop();
```

