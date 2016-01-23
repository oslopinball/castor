import express from 'express';
import * as commands from './commands';
import createIRConnection from './ir-connection';
const config = {
  port: 2424,
  baudrate: 9600,
  irPort: '/dev/cu.usbserial-A4001t5c'
}
createIRConnection({port: config.irPort, baudrate: config.baudrate})
  .then(controller => {

    console.log(`IR connection established on ${irPort}`);
    app.get('/on', (req, res) => {
      controller.send(commands.IR_ON)
        .then(() => res.send('led on'), err => res.send(`Error: ${err}`));
    });

    app.get('/off', (req, res) => {
      controller.send(commands.IR_OFF)
        .then(() => res.send('led off'), err => res.send(`Error: ${err}`));
    });

    app.get('/cmd', (req, res) => {
      res.render('remote', {commands: commands});
    });

    app.get('/cmd/:cmd', ({params}, res) => {
      if (params.cmd in commands) {
        const cmd = commands[params.cmd];
        controller.send(cmd)
          .then(() => res.send(`${cmd} sent`), err => res.send(`Error: ${err}`));
      } else {
        res.send(`Unknown command ${params.cmd}`);
      }
    });

    app.get('/raw/:rawCmd', ({params}, res) => {
      controller.send(params.rawCmd)
        .then(() => res.send(`${params.rawCmd} sent`), err => res.send(`Error: ${err}`));
    });

    app.listen(config.port, () => {
      console.log(`Web server running on http://localhost:${config.port}`);
    });
  })
  .catch(err => {
    console.log(`${err}. Exiting.`);
  });

const app = express();

