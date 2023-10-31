const { Kafka } = require("kafkajs");

const TOPIC = "order-confirmed-email";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9101","localhost:9092", "localhost:9093"],
});

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
    partitionsConsumedConcurrently:2,
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
