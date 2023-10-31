const { Kafka } = require("kafkajs");

const KAFKA_TOPIC = "food-order";
const CONFIRMED_ORDER_TOPIC = "order-confirmed";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092", "localhost:9093"],
});

const producer = kafka.producer({
  groupId: CONFIRMED_ORDER_TOPIC,
});

const consumer = kafka.consumer({ groupId: KAFKA_TOPIC });

const run = async () => {
  console.log("transaction waiting kafka...");
  await consumer.connect();
  await producer.connect();

  // consumer.on("ready", () => {
  //   console.log("transaction kafka ready...");
  // });
  await consumer.subscribe({
    topic: KAFKA_TOPIC,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const order = JSON.parse(message.value);

        console.log("transaction successful");

        // start pipeline

        producer.sendBatch({

          topic: CONFIRMED_ORDER_TOPIC.concat('-email'),
          messages: [
            {
              value: JSON.stringify({
                orderId: order.orderId,
                userId: order.userId,
                transaction: `transaction-${order.orderId}`,
                amount: order.orderAmount,
                price: order.orderPrice,
              }),
            },
          ],
        });

        
        producer.sendBatch({

          topic: CONFIRMED_ORDER_TOPIC.concat('-analytic'),
          messages: [
            {
              value: JSON.stringify({
                orderId: order.orderId,
                userId: order.userId,
                transaction: `transaction-${order.orderId}`,
                amount: order.orderAmount,
                price: order.orderPrice,
              }),
            },
          ],
        });

        // producer.producer(
        //   CONFIRMED_ORDER_TOPIC,
        //   -1, // Automatically choose a partition
        //   Buffer.from(
        //     JSON.stringify({
        //       orderId: order.orderId,
        //       userId: order.userId,
        //       transaction: `transaction-${order.orderId}`,
        //       amount: order.orderAmount,
        //       price: order.orderPrice,
        //     })
        //   ),
        //   null, // Key, set to null for automatic partitioning
        //   Date.now(), // Timestamp (can be set to null or omitted)
        //   (err, offset) => {
        //     if (err) {
        //       reject(err);
        //     } else {
        //       resolve(offset);
        //     }
        //   }
        // );

        console.log({
          orderId: order.orderId,
          status: "successful",
        });
      } catch (error) {
        console.error(error);
      }
    },
  });
};

run().catch(console.error());
