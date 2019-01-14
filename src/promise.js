/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

class OwnPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Promise executor must be a function');
    }

    this.state = PENDING;
    this.cbArray = [];

    // === helping function ===
    const putProcessInLine = () => {
      setTimeout(() => {
        try {
          executor(resolve, reject)
        } catch (err) {
          reject(err)
        };
      }, 0);
    }
    // ========================

    const resolve = data => {
      if (this.state !== PENDING) {
        return
      }

      if (!(data instanceof OwnPromise)) {
        // console.log('step2 - 1st promise resolved');
        this.state = RESOLVED;
        this.value = data;
      } else {
        if (data.state === PENDING) {
          putProcessInLine();
        }

        if (data.state === RESOLVED) {
          if (!(data.value instanceof OwnPromise)) {
            setTimeout(() => {
              // console.log('step4 - then resolved')
              this.state = RESOLVED;
              this.value = data.cbArray.shift()['onResolve'](data.value);
            }, 0);
          } else {
            if (data.value.state === PENDING) {
              putProcessInLine();
            } else {
              this.state = RESOLVED;
              this.value = data.cbArray.shift()['onResolve'](data.value.value);
            }
          }
        }
      }
    }

  
    const reject = error => {
      if (this.state !== PENDING) {
        return
        // return res(this.value);

      this.state = REJECTED;
      this.value = error;
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    };
  }



  // вспомогательная функция для проверки состояния, чтобы ее вызывать

  then(onResolve, onReject) {
    if (typeof onResolve !== 'function') {
      throw new TypeError('onResolve must be a function');
    }

    this.cbArray.push({ onResolve, onReject });

    if (this.state === RESOLVED || PENDING) {
      // console.log('step3 - then creates new Promise');
      return new OwnPromise(resolve => {
        resolve(this);
      });
    }
  }

  catch(rej) {

  }
}

// module.exports = OwnPromise;


const p = new OwnPromise(function (resolve, reject) {
  // if (true) {
  setTimeout(() => {
    console.log('basic promise')
    resolve(0)
  }, 2000);
  // } else {reject('Error')}
  //   reject()
});




// p.then(console.log('abc')) //будет ошибка, если если console.log(F()) внутри сет таймаут

// =======================================

// console.log(p
// .then((data) => {console.log(data + 1); return data + 1})
// .then((data) => {console.log(data + 1); return data + 1})
// .then((data) => {console.log(data + 1); return data + 1})
// )

// =======================================

// p.then(v => {
//   console.log('1');
// })
//   .then(v => {
//     console.log('4');
//   });

// p.then(v => {
//   console.log('2');
// })
// p.then(v => {
//     console.log('3');
//   });

// =======================================

p.then((v) => {
  // console.log(v,'first then 1');
  // return 1;

  const p1 = new OwnPromise(function (resolve, reject) {

    setTimeout(() => {
      console.log(v, 'first then 1');
      resolve(1);
    },
      1000)

  });

  return p1.then(a => a * 2).then(a => a * 3)

}).then((v) => {
  console.log(v, 'second after first then 4');
  return 2;
});

p.then((v) => {
  console.log(v, 'first independed then 2');

});
p.then((v) => {
  console.log(v, 'second independed then 3');
});
