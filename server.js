const express = require("express");
const connectDb = require("./config/dbConnection");
const responseTime = require('response-time');
const client = require('prom-client');
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const {createLogger, transports} = require('winston');
const LokiTransport = require('winston-loki');
const cors = require("cors");
connectDb();

const options = {
  transports: [
    new LokiTransport({
      host: "http://localhost:3100",
    }),
  ],
};



const app = express();
const port = process.env.PORT || 5000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register});
const reqResTime = new client.Histogram({
  name: 'request_response_time',
  help: 'Response time in millis',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500, 1000, 2000, 2500, 3000, 5000]
  });

const totalRequests = new client.Counter({
  name: 'total_requests',
  help: 'Total number of requests',
});


app.use(express.json());
app.use(cors());

app.use(
  responseTime((req, res, time) => {
    totalRequests.inc();
    if (req.url !== '/metrics') {
        reqResTime
            .labels(req.method, req.url, res.statusCode)
            .observe(time);
    }
  }
));

app.get("/api/url", (req, res) =>
  res.json({ url: "wss://livekit.zoomtod.com" }),
);

app.get("/metrics", async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/livekit", require("./routes/livekitRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});