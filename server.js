const webPush = require("web-push");
require("dotenv").config();
const fastify = require("fastify")({
  logger: true
});
const cors = require("@fastify/cors");

fastify.register(cors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  }
});

fastify.get("/vapidPublicKey", (_req, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

fastify.post("/register", (_req, res) => {
  // TODO: production server should store credentials to DB
  res.code(201);
  res.send();
});

fastify.post("/send", (req, res) => {
  const subscription = req.body.subscription;
  const payload = req.body.body ?? "Default text";
  const options = {
    TTL: req.body.ttl
  };
  console.log("data to send", payload);
  setTimeout(function () {
    webPush
      .sendNotification(subscription, payload, options)
      .then(function () {
        res.code(201);
        res.send();
      })
      .catch(function (error) {
        res.code(500);
        console.log(error);
      });
  }, req.body.delay * 1000);
});

fastify.listen({ port: 8000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  webPush.setVapidDetails(
    "http://localhost:3000/",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
});
