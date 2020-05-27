let clientLastId = 0;
let time = 800;
const names = [
    'Krzysztof Bosak',
    'Kamil Sobolewski',
    'Maciek Czepiela',
    'Adrian Nowak',
    'Szymon Sarna',
    'Kacper Sarna',
    'Artur Sobolewski',
    'Ewelina Nowak',
    'Adrianna',
    'Eliza Bosak',
    'Kamila Woda',
    'Jakub Woda',
    'Sławomir Mentzen',
    'Tomasz Woda'
  ];
  
  const createClient = async (self) => {
    await new Promise((resolve) => setTimeout(resolve, randomTime()));
    clientLastId++;
    self.postMessage({ type: 'newClient', client: { name: randomName(), clientId: clientLastId } });
  };
  
  const randomName = () =>
    names[Math.floor(Math.random() * names.length)];

  const randomTime = () => time + Math.floor(Math.random() * 500);
  
  self.addEventListener(
    'message',
    function (e) {
        switch (e.data.type) {
        case 'newClient':
            createClient(self);
            break;
        case 'setTime':
            time = e.data.time;
            console.log(time)
            break;
        default:
          break;
      }
    },
    false
  );
  