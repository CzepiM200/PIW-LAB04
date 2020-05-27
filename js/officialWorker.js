let clientName;
let officialName;
let isServing = false;
let time = 5000;

const serveClient = async (self) => {
  await new Promise((resolve) => setTimeout(resolve, randomTime()));
  isServing = false;
  self.postMessage({ type: 'finished', clientId });
};

const randomTime = () => time + Math.floor(Math.random() * 500);

self.addEventListener(
  'message',
  function (e) {
    switch (e.data.type) {
      case 'init':
        clientId = e.data.officialName;
        break;
      case 'changeClient':
        clientName = e.data.name;
        if (!isServing) {
          isServing = true;
          serveClient(self);
          self.postMessage({ ...e.data, clientId });
        }
        break;
       case 'setTime':
        time = e.data.time;
        break;
      default:
        break;
    }
  },
  false
);
