const express = require('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();
const cors = require('cors');
connectDb();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/livekit', require("./routes/livekitRoutes"));
app.use('/api/admin', require("./routes/adminRoutes"));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
