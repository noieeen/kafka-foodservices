// import { Httpx, Get } from "https://jslib.k6.io/httpx/0.1.0/index.js";
// import { describe } from "https://jslib.k6.io/expect/0.0.4/index.js";
import http from "k6/http";
import { generateSubscriber, generateOrder } from "./data-generator/order";

// import {
//   randomIntBetween,
//   randomString,
//   randomItem,
//   uuidv4,
//   findBetween,
// } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

const baseUrl = "http://host.docker.internal:8000";
const numRequests = 100;

// export const options = {
//   vus: 300,
//   duration: '10s',
//   thresholds: {
//     'failed form submits': ['rate<0.1'],
//     'failed form fetches': ['rate<0.1'],
//     'http_req_duration': ['p(95)<400']
//   }
// };

export default function () {
  for (let orderId = 1; orderId <= numRequests; orderId++) {
    const person = generateSubscriber();
    const order = generateOrder();

    const res = http.post(
      `${baseUrl}/api/order`,
      JSON.stringify({
        id: order.id,
        user: person.name,
        name: order.name,
        amount: order.amount,
        price: order.price,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // find a string between two strings to grab the username:
    // const username = findBetween(res.body, '"username":"', '"');
    // console.log("username from response: " + username);

    // sleep(randomIntBetween(1, 5)); // sleep between 1 and 5 seconds.
  }
}
