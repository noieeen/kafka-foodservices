const { kafka } = require("./libs/kafka");

const TOPIC = "order-confirmed_email";


const consumer = kafka.consumer({ groupId: TOPIC });

const run = async () => {
  console.log("email waiting kafka...");
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPIC,
    fromBeginning: true,
  });
  console.log("email kafka ready...");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const body = JSON.parse(message.value);
        console.log("sent email to: ", body.userId);
        console.log("sent email successful");
      } catch (error) {}
    },
  });
};

run().catch(console.error());
