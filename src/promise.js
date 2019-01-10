/*eslint-disable*/
const RESOLVED = 'RESOLVED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

const cb = null;

class OwnPromise {
  constructor(executor) {
    //проверка, что экзекютор и функция
    this.state = PENDING;
    this.callbacks = []

    // resolve можно вынести в класс, т.к. она вспомогательная
    const resolve = data => { // НО! Сюда может прилететь промис, нужны проверки
      if (this.state !== PENDING) {
        return
      }
      
      this.state = RESOLVED;
      this.value = data;
      // cb(this.value)
      this.callbacks.forEach(({res, rej}) => {
        // нужна проверка резолв или реджект
        this.value = res(this.value);
      })
    }

      const reject = error => {
        if (this.state !== PENDING) {
          return res(this.value);
        }
        
        this.state = REJECTED;
        this.value = data;
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      // reject(err)
    };

  }

  // вспомогательная функция для проверки состояния, чтобы ее вызывать

  then(res, rej) {
    // res(this.value);
    // cb = res;
    if (this.state === RESOLVED) {
      r
    }
    this.callbacks.push({res, rej});
    return this; //но здесь нужно возвращать каждый раз новый инстанс своего промиса
  }

  catch(rej) {

  }
}

module.exports = OwnPromise;


const p = new Promise(function(resolve, reject) {
  // const F = null;
  // const X = () => {};
  // const Y = 10;
  // for (let i = 10; i < 20; i +=3) {
  //   console.log(F()) //будет ошибка при исполнении
  // }

  setTimeout( () => {
    resolve(0);
    reject()
  }, 1000);
});


// p.then(console.log('abc')) //будет ошибка, если если console.log(F()) внутри сет таймаут

p
.then((data) => {console.log(data); return 1})
.then((data) => {console.log(data); return 2})
.then((data) => {console.log(data); return 3})

