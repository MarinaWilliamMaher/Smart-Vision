import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
//securty packges
import helmet from 'helmet';
import dbConnection from './db/index.js';
import router from './routes/index.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import {
  addNewOnline,
  getOperator,
  removeUser,
  getEngineer,
  getFactory,
  getIventoryManager,
} from './utils/index.js';

dotenv.config();
const __dirname = path.resolve(path.dirname(''));
const app = express();
app.use(express.static(path.join(__dirname, 'views')));
const PORT = process.env.PORT || 3000;
dbConnection();

const corsOptions = {
  origin: '*',
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.use(router);
// Errors Middlewares
app.use(errorMiddleware);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  //add new user in array to get his socket id
  socket.on('newUser', (user) => {
    addNewOnline(user, socket.id, onlineUsers);
    console.log('add', onlineUsers);
  });

  //when client set order
  socket.on('setOrder', ({ user, products, type, order }) => {
    const operator = getOperator(onlineUsers)[0];
    console.log('--------------------------');
    console.log(operator);
    console.log('--------------------------');
    if (operator) {
      io.to(operator?.socketId).emit('notifications', {
        user,
        products,
        type,
        order,
      });
    }
  });

  socket.on('setService', ({ user, type, serviceOrder }) => {
    const operator = getOperator(onlineUsers)[0];
    console.log('--------------------------');
    console.log(operator);
    console.log('--------------------------');
    if (operator) {
      io.to(operator?.socketId).emit('notifications', {
        user,
        type,
        serviceOrder,
      });
    }
  });
  //assign engineer
  socket.on('assignEngineer', ({ user, to, type, serviceOrder }) => {
    console.log('to: ', to);
    const engineer = getEngineer(onlineUsers, to)[0];
    console.log('--------------------------');
    console.log(engineer);
    console.log('--------------------------');
    if (engineer) {
      io.to(engineer?.socketId).emit('notifications', {
        user,
        type,
        serviceOrder,
      });
    }
  });
  //Sent customization order to factory and Inventory manager to get needed matarials.
  socket.on('sendDetails', ({ user, type, materialOrder, service }) => {
    const factoryManager = getFactory(onlineUsers)[0];
    const inventoryManager = getIventoryManager(onlineUsers)[0];
    console.log('--------------------------');
    console.log(factoryManager);
    console.log(type[0]);
    console.log(inventoryManager);
    console.log('--------------------------');
    if (inventoryManager) {
      io.to(inventoryManager?.socketId).emit('notifications', {
        user,
        type: type[0],
        materialOrder,
        service,
      });
    }
    if (factoryManager) {
      io.to(factoryManager?.socketId).emit('notifications', {
        user,
        type: type[1],
        materialOrder,
        service,
      });
    }
  });

  //when the user logout
  socket.on('close', () => {
    onlineUsers = removeUser(socket.id, onlineUsers);
    console.log('delete', onlineUsers);
  });
  //when the user left
  socket.on('disconnect', () => {
    onlineUsers = removeUser(socket.id, onlineUsers);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Dev Server Running On Port: ${PORT}`);
});
/* app.listen(PORT, () => {
  console.log(`Dev Server Running On Port: ${PORT}`);
}); */
