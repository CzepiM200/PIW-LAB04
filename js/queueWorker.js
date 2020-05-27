const queue = [];
const limit = 5;

self.addEventListener(
  'message',
  function (e) {
    switch (e.data.type) {
      case 'addClient':
        if (queue.length < limit) {
          queue.push(e.data.client);
          self.postMessage({ type: 'result', isSuccessful: true, queue});
        } else {
          self.postMessage({ type: 'result', isSuccessful: false });
        }
        break;
      case 'popNext':
        if (queue.length > 0) {
          self.postMessage({ ...e.data, client: queue.shift(), queue });
        }
        break;
      default:
        break;
    }
  },
  false
);
