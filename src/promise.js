const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class OwnPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Promise executor must be a function');
    }

    this.state = PENDING;
    this.value = undefined;
    this.chained = [];

    const resolve = value => {
      if (this.state !== PENDING) {
        return;
      }
      this.state = FULFILLED;
      this.value = value;

      // for (const { onFulfilled } of this.chained) {
      //   onFulfilled(value);
      // }
    };

    const reject = error => {
      if (this.state !== PENDING) {
        return;
      }
      this.state = REJECTED;
      this.value = error;

      // for (const { onRejected } of this.chained) {
      //   onRejected(error);
      // }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  static resolve(arg) {
    const newOwnPromise = this.constructor();
    newOwnPromise.resolve(arg);
    return newOwnPromise;
  }

  static reject(arg) {
    // return new OwnPromise();

  }

  static race(arrOfPromises) {
    const isIterable = arrOfPromises !== null && typeof arrOfPromises[Symbol.iterator] === 'function';

    if (!isIterable) this.reject();
  }

  static all(arrOfPromises) {
  }

  then(onFulfilled, onRejected) {
    if (this.state === FULFILLED) {
      return new OwnPromise(onFulfilled(this.value));
    } else if (this.state === REJECTED) {
      onRejected(this.error);
    } else {
      this.chained.push({ onFulfilled, onRejected });
    }
  }
}

module.exports = OwnPromise;


console.log('hi')