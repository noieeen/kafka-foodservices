const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
app.use(express.json());
const port = 8000;

const TOPIC = "food-order";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9101","localhost:9092", "localhost:9093"],
});

const producer = kafka.producer();

app.post("/api/order", async (req, res) => {
  try {
    const order = req.body;

    const transformOrder = {
      orderId: order.id,
      userId: order.user,
      orderName: order.name,
      orderAmount: order.amount,
      orderPrice: order.price,
    };
    // console.log(transformOrder);
    producer.connect();
    producer.send({
      topic: TOPIC,
      messages: [
        {
          value: JSON.stringify({
            orderId: order.id,
            userId: order.user,
            orderName: order.name,
            orderAmount: order.amount,
            orderPrice: order.price,
          }),
        },
      ],
    });

    console.log(`producer send:`, transformOrder);
    console.log(`response status:`, res.statusCode);

    return res.json({ message: "order successful", order: transformOrder });
  } catch (error) {
    producer.disconnect();
    return res.status(500).json({ error });
  }
});

app.listen(port, async () => {
  await producer.connect();
  console.log(`Express @port:${port}`);
});
