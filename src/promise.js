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

    const resolve = data => {
      if (this.state !== PENDING) {
        return
      }

      if ( data instanceof OwnPromise ) {

        if (data.state === PENDING) {
          setTimeout(() => {
            try {
              executor(resolve, reject)
            } catch (err) {
              reject(err)
            };
          }, 1000);
          
          
        }

        if (data.state === RESOLVED) {

          setTimeout(() => {
            console.log('step4 - then resolved')
            this.state = RESOLVED;
            this.value = data.cbArray.shift()['onResolve'](data.value);
          }, 1000);
        }

      } else {
        console.log('step2 - 1st promise resolved');
        this.state = RESOLVED;
        this.value = data;
      }

      // cb(this.value)
      // this.cbArray.forEach(({res, rej}) => {
      //   // нужна проверка резолв или реджект
      //   this.value = res(this.value);
      // })
    }
  
    const reject = error => {
      if (this.state !== PENDING) {
        return
        // return res(this.value);
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

    this.cbArray.push({onResolve, onReject});

    if (RESOLVED || PENDING) {
      // cbArray.push({onResolve, onReject});
      // cbArray.push(onResolve);
      console.log('step3 - then creates new Promise');
      const newOwnPromise = new OwnPromise( resolve => {
      resolve(this);
      });

      return newOwnPromise;
    }

    // if (this.state === PENDING) {
    //   setTimeout(() => {
    //     console.log('step1 - then is waiting while pending');
    //     this.then(onResolve)
    //   }, 500);
    // }

  }

  catch(rej) {

  }
}

// module.exports = OwnPromise;


const p = new OwnPromise(function(resolve, reject) {
    // if (true) {
    setTimeout(() => {
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

p.then((v) =>  {
  console.log(v,'first then 1');
  return 1;
  
} ).then((v) =>  {
  console.log(v,'second after first then 4');
  return 2;
} );

p.then( (v) =>  {
  console.log(v,'first independed then 2');

} );
p.then( (v) =>  {
  console.log(v,'second independed then 3');
} );