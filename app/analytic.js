const { kafka } = require("./libs/kafka");

const TOPIC = "order-confirmed_analytic";

const consumer = kafka.consumer({ groupId: TOPIC });

let totalOrderCount = 0;
let totalRevenue = 0;

const run = async () => {
  console.log("analytic waiting kafka...");
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPIC,
    fromBeginning: true,
  });
  console.log("analytic kafka ready...");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const body = JSON.parse(message.value);

        totalOrderCount += body.amount;
        totalRevenue += body.price;
        console.log("total order count: ", totalOrderCount);
        console.log("total Revenue", totalRevenue);
      } catch (error) {}
    },
  });
};

run().catch(console.error());
