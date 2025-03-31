const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const winston = require('winston');
require('dotenv').config();

const port = process.env.PORT || 5001;
const serviceAccount = {
  "type": "service_account",
  "project_id": "bd-seguridad2",
  "private_key_id": "af26d5440773ff9c04b642cf41e5605d8730eba5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCPslWHeJV1688S\nGowD1nSIt/h9Ei16EJPTWg+iK/zlDMepBqiFtd/FIp3fTjeV2AyDq1VRo/J1XYdT\n373AMGrfxUSdLNnO89/5nCZkZawvt0N6wBRLqM2TmetP6ppEWAKa8H1yrtImDxaH\niT7p0eYZaYhVgyjbQZgR/2qyi10i7/sPJ7SrrCns8Fcuft+BF08rrCBLfdILoQlr\nSDrr+6Go4C+CJFFWz5+EEhCH429TKPquUzBtZXhLqsUI+1lRmZ8UTV6G9pLI5GfS\nr1j3nXZXHOvQVuoCk+A+v3fHoczG2yGwD0kNQn+IwU0AxkVn+ejCr0WR9JriMAri\n1oJyxnOJAgMBAAECggEAB+LI+VPc20QV5iqGoRD0Q8Au4Z7tV9EllQLQr/0bK5nJ\nh5qPMIlUOV4b4lzz8CP+FH1trlA2698hCwa7boWUXpPq9EzkEMyxmmH0pGwE/fhg\nJRIkpaii9t+f+jqH0p+ELcBsGK6vPI9K6foWSwrYcRq+yeHrtylQy7oOlF5RaJZE\nXXCRU87j+jbkh0TsKMCh9DP1HfOnjwf9JBuqrQfKh8AAjtrKhdFJeFaSdk10fn3h\nHNRdoWsavjG6RbfhWPl6ogWCc4gwSXfU8+bZwVysini5CD9R/qFq6givaNEzxA71\nUonNFO3av4gk8s38WayyOue+tL8NSYuKlgL2jYcuZQKBgQDI0PLVu7BJMTdJNh5v\n3+NFBhEWakzU8FGcORqoNEE9Nwo7pR75KtXg615YtAmm+rqOGxNC6b6HGzuCumPm\nkld5Qi+wcbqNZc4S2umLG3bVcPSTdlZ7zkwjC37LDLGVD3VWCQyXfbKrwTGvreg8\nhF38Sr9CekGAa/0E93fWngtjdQKBgQC3LyCbgSYt3yM30thmowoBfJYZOyXWLTDF\nmVRf+6EDSe6O+MwXBIzZsFkfMZ3gYkZd6M1VPi1Hx89bx+wtAh6Ogz7qnIwIZqfP\nFoARSV+nzIhFHJpQOsmW6NcSxssjtuUyLfflQvpmFWD4XutDTzdOvcD0fuJntpxD\naHgAE9ZxRQKBgQC9zO+Xn3uw0fmFEseVybBOrrs7ymCv6ivYUgil7i2zI/BiC2DI\n8/mOSie0AwYUcmocoe6EkdRocg6/Mlf1t19B1pKoW/WMaypom8uclOquNcKUFYcM\nISHJBbZjR64YSrIGDSt/i2hx+XlyqBYWDK2gJS28MTzzmh1csmDr0hjFeQKBgHqa\n+GAcWMlrB89dN6m6hf/ouy24AOMQ7AvVTDvR1zq0SQ84RqFBUmSBO6U9OEXugNpp\n7sSXEQdyHL95WAHn4TvRbFLq5G7bBoX8sUrgqT1OEAbx1fbM4hA3V3whweTtjQnA\n6qJv6dhZhsW2AhDS/Fmfd34tTqvL9VrImUiz/lthAoGBAKVYSze6axLCiQ3Npwoy\nWIia7fpx6/L0I5/0fRIj1CkMc90wYFy+kUxvfpVjCnmJNA6EiBH8w4bV1P9+ACbf\nDddIoGpOaD6WRNv+zPnwm/fJQRbNNcoWa9t3pC48NWWPUexmd3O9vNOex9jt0l63\n8zdzfPTLSTqt1TBAD/Pd4IBG\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@bd-seguridad2.iam.gserviceaccount.com",
  "client_id": "118256191590963189445",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40bd-seguridad2.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app();
}

// Importar rutas después de la conexión a Firebase para evitar fallos
const routes = require("./routes");

// Inicializar Express
const server = express();

server.use(cors({
  origin: "*",
  credentials: true
}));

server.use(bodyParser.json());

// Configuración de Winston para logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/all.log', level: 'info'  }),
      new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const db = admin.firestore();

// Middleware de logging
server.use((req, res, next) => {
  const startTime = Date.now();
  let statusCode;
  
  const originalSend = res.send;
  res.send = function (body) {
    statusCode = res.statusCode;
    originalSend.call(this, body);
  };

  res.on("finish", async () => {
    const responseTime = Date.now() - startTime;
    const logData = {
      logLevel: statusCode >= 400 ? "error" : "info",
      timestamp: new Date(),
      method: req.method,
      url: req.url,
      path: req.path,
      query: req.query,
      params: req.params,
      status: statusCode || res.statusCode,
      responseTime,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      protocol: req.protocol,
      host: req.hostname,
      system: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || "development",
        pid: process.pid,
      },
    };

    logger.log({ level: logData.logLevel, message: "Request completed", ...logData });
    try {
      await db.collection("logs").add(logData);
    } catch (error) {
      logger.error("Error al guardar log en Firestore:", error);
    }
  });
  next();
});

// Rutas protegidas
server.use("/api", routes);

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});