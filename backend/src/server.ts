import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameState, PlayerData, Role } from './types';
import { handleGameEvents } from './events';

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 3001;

// Estado del juego
const gameState: GameState = {
  master: null,
  players: {},
};

// Configurar CORS y rutas básicas
app.use(cors());
app.get('/', (req: Request, res: Response) => {
    res.send('Servidor activo 🚀');
});
// Manejo de eventos de WebSockets
io.on('connection', (socket: Socket) => {
  console.log(`🔌 Nueva conexión: ${socket.id}`);
  handleGameEvents(io, socket, gameState);
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
