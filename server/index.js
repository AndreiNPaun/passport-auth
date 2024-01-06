const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Read the certificate and key
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
const certificate = fs.readFileSync(process.env.CERTIFICATE_PATH, 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Routes
const authRoute = require('./routes/authentication');
const accountManagementRoute = require('./routes/accountManagement');
const adminRoute = require('./routes/admin');
const passport = require('./middleware/passport');
const proxyServerRoute = require('./routes/proxyServer');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('DB Error:', error);
});

db.once('open', () => {
  console.log('Database Connected');
});

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, `${process.env.CLIENT_URL}/`],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin'],
  })
);
app.use(cookieParser());
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

app.use('/', authRoute);
app.use('/account-management/', accountManagementRoute);
app.use('/admin/', adminRoute);
app.use('/proxy-server', proxyServerRoute);

// Create the HTTPS server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
