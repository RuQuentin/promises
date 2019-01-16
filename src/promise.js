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
      }, 50);
    }
    // ========================

    const resolve = data => {
      if (this.state !== PENDING) {
        return
      }

      if (!(data instanceof OwnPromise)) {
        this.state = RESOLVED;
        this.value = data;
      } else {
        if (data.state === PENDING) {
          putProcessInLine();
        }

        if (data.state === RESOLVED) {
          if (!(data.value instanceof OwnPromise)) {
            setTimeout(() => {
              this.state = RESOLVED;
              this.value = data.cbArray.shift()['onResolve'](data.value);
            }, 50);
          } else {
            if (data.value.state === PENDING) {
              putProcessInLine();
            }

            if (data.value.state === RESOLVED) {
              this.state = RESOLVED;
              this.value = data.cbArray.shift()['onResolve'](data.value.value);
            }

            // нужен ли сценарий, если он REJECTED?
          }
        }
      }
    }

    const reject = error => {
      if (this.state !== PENDING) {
        return
      }

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

    if (this.state === RESOLVED || this.state === PENDING) {
      // console.log('step3 - then creates new Promise');
      return new OwnPromise(resolve => {
        resolve(this);
      });
    }

    // if (this.state === REJECTED) {
    //   // console.log('step3 - then creates new Promise');
    //   return new OwnPromise(resolve => {
    //     resolve(this);
    //   });
    // }
  }

  catch(rej) {

  }
}

// module.exports = OwnPromise;


const p = new Promise(function (resolve, reject) {
  if (false) {
  setTimeout(() => {
    console.log('basic promise')
    resolve(0)
  }, 2000);
  } else {reject('Ошибочка')}
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
  const p1 = new Promise(function (resolve, reject) {

    setTimeout(() => {
      console.log(v, 'first then 1');
      resolve(v + 2);
    },
      1000)

  });

  return p1.then(a => a * 2).then(a => a * 3)

}).then(
  (v) => {
  console.log(v, 'second after first then 4');
  return 2;
});

p.then(
  (v) => {
  console.log(v, 'first independed then 2');
// },
  // (reason) => {
  // console.log(reason)
});

p.then((v) => {
  console.log(v, 'second independed then 3');
});

console.log(p)