const { exec } = require('child_process');
const CronJob = require('cron').CronJob;
const restartCommand = "pm2 restart 0";
const listCommand = "pm2 list";

console.log("Starting App Restarter");

const restartApp = function () {
  exec(restartCommand, (err, stdout, stderr) => {
    if (!err && !stderr) {
      console.log(new Date(), `App restarted!!!`);
      listApps();
    }
    else if (err || stderr) {
      console.log(new Date(), `Error in executing ${restartCommand}`, err || stderr);
    }
  });
}

function listApps() {
  exec(listCommand, (err, stdout, stderr) => {
    // handle err if you like!
    console.log(`pm2 list`);
    console.log(`${stdout}`);
  });
}

new CronJob('*/5 * * * *', function() {
  console.log('2 am Los_Angeles time, restarting the zombieApp');
  restartApp();
}, null, true, 'Asia/Singapore');