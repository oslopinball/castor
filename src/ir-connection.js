import SerialPort from 'serialport';
import Q from 'q';
export default options => {
  return Q.Promise((resolve, reject) => {
    const serialPort = new SerialPort.SerialPort(options.port, {
      baudrate: options.baudrate
    });

    serialPort.on('error', err => {
      reject(err);
    });

    serialPort.on('open', () => {
      serialPort.on('data', data => {
        console.log(data.toString());
      });

      const controller = {
        send(data) {
          console.log(`Sending ${data}`);
          return Q.Promise((resolve, reject) => {
            serialPort.write(`${data}\n`, (err, res) => {
              if (err) {
                return reject(new Error(err));
              } else {
                return resolve(res);
              }
            });
          })
        }
      };

      setTimeout(() => {
        resolve(controller);
      }, 2000);

    });
  });
};
