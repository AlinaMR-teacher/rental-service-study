import express from 'express';
import sequelize from './db.js';
import fileUpload from 'express-fileupload';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; 
import router from './routes/index.js';
import errorMiddleware from './middleware/ErrorHandlingMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

const app = express();
const swaggerDocument = YAML.load('./docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use('/', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
