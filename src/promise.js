/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

class OwnPromise {
  constructor(executer) {
    this.state = PENDING;
    this.callbacks = [];

    if (typeof executer !== 'function') {
      throw new TypeError('Executer is not a function');
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


  then(onFulfilled, onRejected) {
    return new this.constructor((resolve, reject) => {
      const internalOnfulfill = value => {
        try {
          resolve(onFulfilled(value));
        } catch (error) {
          reject(error);
        }
      };

      const internalOnreject = reason => {
        if (onRejected && typeof onRejected === 'function') {
          try {
            resolve(onRejected(reason));
          } catch (error) {
            reject(error);
          }
        } else {
          reject(reason);
        }
      };

      if (this.state === PENDING) {
        this.callbacks.push({ onFulfilled: internalOnfulfill, onRejected: internalOnreject });
      } else if (this.callbacks.length > 0) {
        this.callHandlers();
      } else {
        this.state === RESOLVED
          ? setTimeout(() => internalOnfulfill(this.value), 0)
          : setTimeout(() => internalOnreject(this.value), 0);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(data) {
    if (typeof this !== 'function') {
      throw new TypeError('`This` is not an instance of OwnPromise');
    }

    if (data instanceof OwnPromise) {
      return data;
    }

    return new this((resolve, reject) => {
      if (typeof resolve !== 'function') {
        throw new TypeError(`${resolve} Is not a function`);
      }

      if (typeof reject !== 'function') {
        throw new TypeError(`${reject} Is not a function`);
      }

      resolve(data);
    });
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
