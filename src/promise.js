/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';
const CONSTRUCTOR_TIMEOUT = 500;

class OwnPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Promise executor must be a function');
    }

    this.state = PENDING;
    this.cbArray = [];

    // === helping function ===
    const putResolveInLine = data => {
      setTimeout(() =>
        resolve(data),
        CONSTRUCTOR_TIMEOUT
        );
    }
    // ========================

    const resolve = data => {
      if (this.state !== PENDING) {
        return
      }

      if (!(data instanceof OwnPromise)) { // for initial promise
        this.state = RESOLVED;
        this.value = data;
      }

      if (data instanceof OwnPromise) { // when resolve(promise) or then
        if (data.state === PENDING) {
          putResolveInLine(data);
        }

        if (data.state === RESOLVED) {
          if (!(data.value instanceof OwnPromise)) { // when resolve(promise) or then(return value)
            if (data.cbArray[0] === undefined || data.cbArray[0]['onResolve'] === undefined) { // when there is no callback (in case resolve(promise) or empty then())
              this.state = RESOLVED;
              this.value = data.value;
            }

            if (data.cbArray[0] !== undefined && data.cbArray[0]['onResolve'] !== undefined) { // when there is a callback in then
                this.state = RESOLVED;
                this.value = data.cbArray.shift()['onResolve'](data.value);
            }
          }

          if (data.value instanceof OwnPromise) { //when then(return promise)
            if (data.value.state === PENDING) {
              putResolveInLine(data);
            }

            if (data.value.state === RESOLVED) {
              if (data.cbArray.length === 0) { // when there is no callback in then (empty then())
                this.state = RESOLVED;
                this.value = data.value.value;
              }

              if (data.cbArray.length !== 0) {// when there is a callback in then
                this.state = RESOLVED;
                this.value = data.cbArray.shift()['onResolve'](data.value.value);
              }
            }
          }
        }
        
            // нужен ли сценарий, если он REJECTED?
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

// ===================== METHODS ======================

  // вспомогательная функция для проверки состояния, чтобы ее вызывать

  then(onResolve, onReject) {

    if (onResolve !== undefined && typeof onResolve !== 'function') {
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

// =====================================================
// ===================== TESTS =========================

let a = 2;

const p2 = new OwnPromise(function (resolve, reject) {

  setTimeout(() => {
    console.log('basic aside promise');
    resolve(2);
  },
    2000)

});

const p = new OwnPromise(function (resolve, reject) {
  if (true) {
  setTimeout(() => {
    console.log('basic promise')
    console.log(a)
    a = a + 2;

    resolve(p2)
  }, 1000);
  } else {reject('Ошибочка')}
});



// =======================================

p.then((v) => {
  // console.log(v,'first then 1');
  // return 1;
  const p1 = new OwnPromise(function (resolve, reject) {

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

p.then().then((v) => {
  console.log(v, 'second independed then 3');
});


// Если resolve возвращает другой Promise. Тогда дальнейшее выполнение ожидает его результата (в очередь помещается специальная задача), и функции-обработчики выполняются уже с ним. - добавить в сценарий для resolve?
