const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
const port = 8000;

const TOPIC = "food-services";

const kafka = new Kafka({
  clientId: "food-service",
  brokers: ["analytic:9092", "transaction:9092", "consumer:9092"],
});

const producer = kafka.producer();

app.get("api/hello", async (req, res) => {
  const { id } = req.body;

  producer.send({ topic: TOPIC, massage: `hello: ${id}` });
});

app.listen(port, async () => {
  await producer.connect();
  console.log(`Express @port:${port}`);
});
