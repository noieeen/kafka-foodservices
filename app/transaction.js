const { kafka } = require("./libs/kafka");

const KAFKA_TOPIC = "food-order";
const CONFIRMED_ORDER_TOPIC_EMAIL = "order-confirmed_email";
const CONFIRMED_ORDER_TOPIC_ANALYTIC = "order-confirmed_analytic";

const producer1 = kafka.producer();

const producer2 = kafka.producer();

const consumer = kafka.consumer({ groupId: KAFKA_TOPIC });

const run = async () => {
  console.log("transaction waiting kafka...");
  await consumer.connect();
  await producer1.connect();
  await producer2.connect();

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

        // start pipeline
        producer1
          .send({
            topic: CONFIRMED_ORDER_TOPIC_EMAIL,
            messages: [
              {
                value: JSON.stringify({
                  orderId: order.orderId,
                  userId: order.userId,
                  amount: order.orderAmount,
                  price: order.orderPrice,
                }),
              },
            ],
          })
          .catch((error) => {
            throw new Error(error);
          });

        producer2
          .send({
            topic: CONFIRMED_ORDER_TOPIC_ANALYTIC,
            messages: [
              {
                value: JSON.stringify({
                  orderId: order.orderId,
                  userId: order.userId,
                  amount: order.orderAmount,
                  price: order.orderPrice,
                }),
              },
            ],
          })
          .catch((error) => {
            throw new Error(error);
          });

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
