const http = require('http');
const fs = require('fs');

const data = JSON.stringify({
  userId: '69ba6567f2a118ddab30fcfe',
  triggerEvent: 'Heavy Rain',
  city: 'Mumbai',
  expectedIncome: 500,
  actualIncome: 200,
  isWorkerActive: true,
  isGpsVerified: true,
  isTelemetryValid: true
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/insurance/simulate-event',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let resData = '';
  res.on('data', c => resData += c);
  res.on('end', () => {
    fs.writeFileSync('error_stack.json', resData);
    console.log('Done!');
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(e);
  process.exit(1);
});
req.write(data);
req.end();
