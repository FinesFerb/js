'use strict';

const userInfo = {
  balance: 0,
  operations: 0,
  increse(sum) {
    this.balance +=sum;
    this.operations++
    console.log(`Баланс: ${this.balance}\nОперации: ${this.operations}`)
  }
}

const res1 = userInfo
const res2 = userInfo
res1.increse(100)
res2.increse(20)

function user() {
 const userObj = {
  balance: 0,
  operations: 0,
  increse(sum) {
    this.balance +=sum;
    this.operations++
    console.log(`Баланс: ${this.balance}\nОперации: ${this.operations}`)
    }
  }
  // Замыкание, которое выводит наш объект
  return function() {
   return userObj
  }
  // return userObj
}

const user1 = user()
const user2 = user()
user2().increse(100)
user1().increse(10)
user2().increse(100)