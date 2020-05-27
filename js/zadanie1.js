let served = 0;
let rejected = 0;

// const generatorTimeButton = document.querySelector("#generatorTime");
// const officialsTimeButton = document.querySelector("#officialsTime");
// const generatorTimeInput = document.querySelector("#generatorTimeInput");
// const officialsTimeInput = document.querySelector("#officialsTimeInput");

const officialWorkerA = new Worker('../js/officialWorker.js')
const officialWorkerB = new Worker('../js/officialWorker.js')
const officialWorkerC = new Worker('../js/officialWorker.js')
let freeOfficials = [officialWorkerA, officialWorkerB, officialWorkerC];

const queueWorker = new Worker('../js/queueWorker.js');
const queueGeneratorWorker = new Worker('../js/queueGeneratorWorker.js');

let availableOfficials = [officialWorkerA, officialWorkerB, officialWorkerC];

// generatorTimeButton.addEventListener("click", function(){ queueGeneratorWorker.postMessage({ type: 'setTime', time: generatorTimeInput.value }); });


const incrementRejected = () => {
    rejected++;
    document.querySelector('#rejected').innerText = 'Odrzucenie klienci: ' + rejected;
};

const incrementServed = () => {
    served++;
    document.querySelector('#served').innerText = 'Obsłużeni klienci: ' + served;
};

const addToQueue = (queue) => {
    document.querySelector('#queue').innerHTML = queue
        .map((c) => `<div id="${c.clientId}">${c.name}</div>`)
        .join('');
};

const initOfficial = (official, officialName) => {
    official.addEventListener(
      'message',
      function (e) {
        switch (e.data.type) {
          case 'changeClient':
            document.getElementById(e.data.clientId).innerText = e.data.name;
            break;
          case 'finished':
            incrementServed();
            document.getElementById(e.data.clientId).innerText = '';
            freeOfficials.push(this);
            queueWorker.postMessage({ type: 'popNext' });
            break;
          default:
            break;
        }
      },
      false
    );
  
    official.postMessage({
      type: 'init',
      officialName,
    });
};



queueWorker.addEventListener(
    'message',
    function (e) {
      switch (e.data.type) {
        case 'result':
          if (e.data.isSuccessful) {
            addToQueue(e.data.queue);
            if (freeOfficials.length > 0) {
              queueWorker.postMessage({ type: 'popNext' });
            }
          } else {
            incrementRejected();
          }
          break;
        case 'popNext':
          if (freeOfficials.length > 0) {
            const official = freeOfficials.shift();
            official.postMessage({
              type: 'changeClient',
              name: e.data.client.name
            });
          }
          addToQueue(e.data.queue);
          break;
  
        default:
          break;
      }
    },
    false
  );

queueGeneratorWorker.addEventListener(
    'message',
    function (e) {
      switch (e.data.type) {
        case 'newClient':
          queueWorker.postMessage({
            type: 'addClient',
            client: e.data.client,
          });
          queueGeneratorWorker.postMessage({ type: 'newClient' });
          break;
        default:
          break;
      }
    },
    false
);

initOfficial(officialWorkerA, 'officialA', 5);
initOfficial(officialWorkerB, 'officialB', 6);
initOfficial(officialWorkerC, 'officialC', 7);

queueGeneratorWorker.postMessage({ type: 'newClient' });