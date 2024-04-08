import { redis } from "@/lib/redis";
import { getDate } from "@/utils";
import { openStdin } from "process";

//using functional approach to create the analytics track value
// const analytics = () => {
//   const track = () => {};
//   //return an object{track: track}
//   return {
//     track,
//   };
// };
// //destructure the returned object.i.e track value
// const { track } = analytics(); //invoke the analytics function so its value can be returned

//using class approach to to create the analytics track value.

// type AnalyticsArgs = {
//   retention?: number;
// };

// export class Analytics {
//   private retention: number = 60 * 60 * 60 * 7; //one week in seconds..entries n d class expire after this default retention value

//   //we use constructor to assign custom property and value to class properties for new class instances...the constructor takes in an object argument (custom instance property and value)..the argument is passed when the class is invoked, i.e at the point of creating the new instance.
//   constructor(opts?: AnalyticsArgs) {
//we assign the optional custom retention passed in our argument to the class Analytics using the this keyword, we said where the custom property value pair exist, this should become the retention number pair of the class constructor of the new created instance.
//     if (opts?.retention) this.retention = opts.retention; //we set the value for the retention property for new instances to either a custom value or default value, if the custom value exist, it takes that value else it uses the default value.
//   }

//    async track(namespace: string, event: object = {}) {
//we use d track argument to create a variable(string)
//     const key = `analytics::${namespace}`;
// console.log(key);
//Key: analytics::homepage_button_click

//     //database call to persist event..we store d event to redis database,
//     const data = await redis.hincrby(key, JSON.stringify(event), 1);
// console.log(data);
// data:1
//   }
// }

// export  }

// export const analytics = new Analytics({retention: 1234}); //the class creates a useable object
// // analytics.retention......cannot access private class properties/fields

/**
 
Let's break down the line const data = await redis.hincrby(key, JSON.stringify(event), 1);:

redis.hincrby(key, JSON.stringify(event), 1);: This is a call to a Redis command hincrby which stands for "Hash Increment By". It's used to increment the value stored at a specified key (key) in Redis. The first argument key is the identifier under which the data will be stored. The second argument JSON.stringify(event) is the data to be stored. It's converted to a JSON string because Redis can only store strings as values. The third argument 1 is the amount by which the value will be incremented.

await: This keyword is used in asynchronous functions to wait for a promise to resolve. In this case, it's used because the hincrby function likely returns a promise that resolves once the increment operation is complete.

const data = ...: This line declares a variable data and assigns the resolved value of the hincrby operation to it. In Redis, hincrby returns the new value of the incremented key after the operation is  complete.

So, data ends up being 1 because hincrby increments the value stored at the specified key by 1, and it returns the new incremented value. If the initial value stored at the key was 0, after executing hincrby, the new value becomes 1, and this new value is assigned to the variable data.

*/

type AnalyticsArgs = {
  retention?: number; //optional property type
};

type TrackOptions = {
  persist?: boolean; //optional property boolean
};

export class Analytics {
  private retention: number = 60 * 60 * 60 * 7;
  constructor(opts?: AnalyticsArgs) {
    if (opts?.retention) this.retention = opts.retention;
  }

  async track(namespace: string, event: object = {}, opts?: TrackOptions) {
    //we use d track argument to create a variable(string)
    let key = `analytics::${namespace}`;

    if (!opts?.persist) {
      key += `::${getDate()}`;
    }

    //database call to persist event..we store d event to redis database,..hash increment by
    await redis.hincrby(key, JSON.stringify(event), 1);

    //delete db
    if (!opts?.persist) await redis.expire(key, this.retention);
  }
}

export const analytics = new Analytics(); //analytics is an object wit a track metod
console.log(analytics);
// export const analytics = new Analytics({ retention: 1234 });
// analytics.track()..we call track method wit d event type we want to track and store in d database...
