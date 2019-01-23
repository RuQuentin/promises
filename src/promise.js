// /*eslint-disable*/
// const RESOLVED = 'RESOLVED';
// const PENDING = 'PENDING';
// const REJECTED = 'REJECTED';
// const CONSTRUCTOR_TIMEOUT = 500;

// class OwnPromise {
//   constructor(executor) {
//     if (typeof executor !== 'function') {
//       throw new TypeError('Promise executor must be a function');
//     }

//     this.state = PENDING;
//     this.cbArray = [];

//     // === helping function ===
//     const putResolveInLine = data => {
//       setTimeout(() =>
//         resolve(data),
//         CONSTRUCTOR_TIMEOUT
//         );
//     }
//     // ========================

//     // === helping function ===
//     const putResolveInLine = data => {
//       setTimeout(() =>
//         resolve(data),
//         CONSTRUCTOR_TIMEOUT
//         );
//     }
//     // ========================

//     // === helping function ===
//     const hasOnResolve = data => {
//       return data.cbArray[0] !== undefined || data.cbArray[0].onResolve !== undefined
//     }
//     // ========================

//     const resolve = data => {
//       if (this.state !== PENDING) {
//         return
//       }

//       if (!(data instanceof OwnPromise)) { // for initial promise if it doesn't return promise 
//         this.state = RESOLVED;
//         this.value = data;
//       }

//       if (data instanceof OwnPromise) { // when resolve(promise) or then
//         if (data.state === PENDING) {
//           putResolveInLine(data);
//         }

//         if (data.state === REJECTED) {
//           reject(data);
//         }

//         if (data.state === RESOLVED) {
//           if (!(data.value instanceof OwnPromise)) { // when resolve(value) or then(return value)
//             if (hasOnResolve(data)) {
//               // when there is no callback (in case resolve(promise) or empty then()) - just pass the previous value further
//             const v =  || data.value;
//               this.state = RESOLVED;

//               this.value = data.cbArray.shift().onResolve(data.value);
//               console.log(this.value);

//             }

//             if (data.cbArray[0] !== undefined && data.cbArray[0].onResolve !== undefined) { // when there is a callback in then
//                 this.state = RESOLVED;
//                 this.value = data.cbArray.shift().onResolve(data.value);
//               console.log(this.value);

//             }
//           }

//           if (data.value instanceof OwnPromise) { //when resolve(promise) or then(return promise)
//             if (data.value.state === PENDING) {
//               putResolveInLine(data);
//             }

//             if (data.value.state === RESOLVED) {
//               if (data.cbArray.length === 0) { // when there is no callback in then (empty then()) just pass the previous value further
//                 this.state = RESOLVED;
//                 this.value = data.value.value;
//               }

//               if (data.cbArray.length !== 0) { // when there is a callback in then
//                 this.state = RESOLVED;
//                 this.value = data.cbArray.shift().onResolve(data.value.value);
//               }
//             }
//           }
//         }
//       }
//     }

//     const reject = error => {
//       if (this.state !== PENDING) {
//         return
//       }

//       if (!(error instanceof OwnPromise)) { // for initial promise
//         this.state = REJECTED;
//         this.value = error;
//       }

//       if (error instanceof OwnPromise) { // when reject(promise) or then
//         if (error.state === PENDING) {
//           putRejectInLine(data);
//         }

//         // if (error.state === REJECTED) {
//         //   reject(error);
//         // }

//         if (error.state === REJECTED) {
//           if (!(error.value instanceof OwnPromise)) { // when resolve(promise) or then(return value)
//             if (error.cbArray[0] === undefined || error.cbArray[0].onResolve === undefined) { // when there is no callback (in case resolve(promise) or empty then())
//               this.state = REJECTED; // if there is no onReject in previous then
//               this.value = error.value;
//             }

//             if (error.cbArray[0] !== undefined && error.cbArray[0].onResolve !== undefined) { // when there is a callback in then
//                 this.state = RESOLVED;
//                 this.value = error.cbArray.shift().onReject(error.value);
//             }
//           }

//           if (error.value instanceof OwnPromise) { //when onReject returns promise
//             if (error.value.state === PENDING) {
//               putRejectInLine(error);
//             }

//             if (error.value.state === RESOLVED) {
//               if (error.cbArray.length === 0) { // when there is no onReject in then (empty then())
//                 this.state = REJECTED;
//                 this.value = error.value.value;                
//               }

//               if (error.cbArray.length !== 0) {// when there is an onReject in then
//                 this.state = RESOLVED;
//                 this.value = error.cbArray.shift().onReject(error.value.value);
//               }
//             }
//           }
//         }
//       }
//     }


//     try {
//       executor(resolve, reject)
//     } catch (err) {
//       reject(err)
//     };
//   }

// // ===================== METHODS ======================

//   // вспомогательная функция для проверки состояния, чтобы ее вызывать

//   then(onResolve, onReject) {

//     if (onResolve !== undefined && typeof onResolve !== 'function') {
//       throw new TypeError('onResolve must be a function');
//     }

//     this.cbArray.push({ onResolve, onReject });

//     if (this.state === RESOLVED || this.state === PENDING) {
//       // console.log('step3 - then creates new Promise');
//       return new OwnPromise((resolve, reject) => {
//         resolve(this);
//       });
//     }

//     if (this.state === REJECTED) {
//       // console.log('step3 - then creates new Promise');
//       return new OwnPromise((resolve, reject) => {
//         reject(this);
//       });
//     }
//   }

//   catch(rej) {

//   }
// }

// // module.exports = OwnPromise;

// // =====================================================
// // ===================== TESTS =========================

// let a = 2;

// const p2 = new OwnPromise(function (resolve, reject) {

//   setTimeout(() => {
//     console.log('basic aside promise');
//     resolve(2);
//   },
//     2000)

// });

// const p = new OwnPromise(function (resolve, reject) {
//   if (true) {
//   setTimeout(() => {
//     console.log('basic promise')
//     console.log(a)
//     // a = a + 2;

//     resolve(p2)
//   }, 1000);
//   } else {
//     // throw new TypeError('artifactial error')
//     reject('Ошибочка');
//   }
// });

// // console.log(p);


// // =======================================

// const pHelper = p
// .then(
//   // 2, 2
//   (v) => {
//   // console.log(v,'first then 1');
//   // return 1;
//   const p1 = new OwnPromise(function (resolve, reject) {

//     setTimeout(() => {
//       console.log(v, 'first then 1');
//       resolve(v + 2);
//     },
//       1000)

//   });

//   // throw new TypeError('my error')

//   return p1.then(a => a * 2).then(a => a * 3) 
// }
// , (err) => err
// )

// // .then()
// // .catch(err => {
// //   console.log(err);
// //   return p2
// // }
//   // )
// // .then(data => data * 2, err => err)


// console.log(pHelper)

// console.log(
//   pHelper.then(
//     // null
//   (v) => {
//   console.log(v, 'second after first then 4');
//   return 2;
// }
// , (err) => console.log(err)
// )
// );

// p.then(
//   (v) => {
//   console.log(v, 'first independed then 2');
// // },
//   // (reason) => {
//   // console.log(reason)
// });

// p.then().then((v) => {
//   console.log(v, 'second independed then 3');
// })



// // Если resolve возвращает другой Promise. Тогда дальнейшее выполнение ожидает его результата (в очередь помещается специальная задача), и функции-обработчики выполняются уже с ним. - добавить в сценарий для resolve?



// p1
// .then(() => p2)
// .then(() => p3)
// .then(() => p4)



function run(args) {
  return args.reduce( (acc = null, item) => acc.then(data => item(data)))
}


const promises = [
  ()=> Promise.resolve(10),
  (id)=> Promise.resolve(id + 10),
  (url)=> Promise.resolve(url + 10)
]

console.log(run(promises))

