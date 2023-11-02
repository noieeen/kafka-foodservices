// const { faker, simpleFaker } = require("@faker-js/faker");
import * as faker from "faker/locale/en_US";
const amount = 10;
const price = 20;

export const generateSubscriber = () => ({
  name: `${faker.person.firstName()} ${faker.person.lastName()}`,
  title: faker.name.jobTitle(),
  company: faker.company.companyName(),
  email: faker.internet.email(),
  country: faker.address.country(),
});

export const generateOrder = () => ({
  id: simpleFaker.string.uuid(),
  name: faker.commerce.productName,
  amount: amount,
  price: price,
});
