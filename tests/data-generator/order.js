const { faker,simpleFaker  } = require("@faker-js/faker");

const amount = randomIntBetween(1, 10);
const price = amount * randomIntBetween(50, 1000);

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
  amount: faker.name.jobTitle(),
  price: faker.company.companyName(),
});
