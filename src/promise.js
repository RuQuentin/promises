class OwnPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Promise resolver must be a function');
    }

    this._state = 'pending';
    this._value = undefined;
    // this._chained = [];

    const resolve = value => {
      if (this.state !== 'pending') {
        return;
      }
      this._state = 'fulfilled';
      this._value = value;

      // for (const { onFulfilled } of this.$chained) {
      //   onFulfilled(res);
      // }
    };

    const reject = error => {
      if (this.state !== 'pending') {
        return;
      }
      this._state = 'rejected';
      this._vaule = error;

      // for (const { onRejected } of this.$chained) {
      //   onRejected(err);
      // }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  static resolve(arg) {
  }

  static reject(arg) {
  }

  static race(arrOfPromises) {
  }

  static all(arrOfPromises) {

  }

  then(onResolve, onReject) {
  }
}

module.exports = OwnPromise;
