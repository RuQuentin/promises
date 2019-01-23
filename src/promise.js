/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

class OwnPromise {
  constructor(executer) {
    this.state = PENDING;
    this.callbacks = [];

    if (typeof executer !== 'function') {
      throw new TypeError('Executer is not function');
    }

    const reject = error => {
      if (this.state !== PENDING) {
        return;
      }

      this.state = REJECTED;
      this.value = error;

      this.callbacks.forEach(({ onRejected }) => {
        this.value = onRejected(error);
      });
    };

    const resolve = data => {
      if (this.state !== PENDING) {
        return;
      }

      if (this.isThenable(data) && data.state === PENDING) {
        data.then(v => resolve(v), v => reject(v));
      }

      this.state = this.isThenable(data) ? data.state : RESOLVED;
      this.value = this.isThenable(data) ? data.value : data;

      this.callHandlers();
    };

    try {
      executer(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  isThenable(obj) {
    return obj && obj.then;
  }

  callHandlers() {
    const run = () => {
      this.callbacks.forEach((callback, i) => {
        const { onFulfilled, onRejected } = callback;

        if (this.callbacks.length === i) {
          this.value = this.state === RESOLVED ? onFulfilled(this.value) : onRejected(this.value);
        }

        this.state === RESOLVED ? onFulfilled(this.value) : onRejected(this.value);
      });
    };

    setTimeout(run, 0);
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
