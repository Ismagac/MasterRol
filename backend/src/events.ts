import { Server, Socket } from 'socket.io';
import { GameState, PlayerData, Role } from './types';

export function handleGameEvents(io: Server, socket: Socket, gameState: GameState) {
  socket.on('joinGame', ({ role, playerData }: { role: Role; playerData?: PlayerData }) => {
    if (role === 'master') {
      if (gameState.master) {
        socket.emit('error', { message: 'Ya hay un master en la partida' });
        return;
      }
      gameState.master = socket.id;
      console.log(`🎩 Master conectado: ${socket.id}`);
    } else if (role === 'player' && playerData) {
        gameState.players[socket.id] = { ...playerData, id: socket.id };
        console.log(`🛡️ Player conectado: ${playerData.name} (${socket.id})`);
    }

    io.emit('updateGameState', gameState);
  });

  socket.on('masterAction', (data: any) => {
    if (gameState.master === socket.id) {
      console.log(`⚡ Acción del master:`, data);
      io.emit('masterAction', data);
    }
  });

  socket.on('playerAction', (data: any) => {
    if (gameState.players[socket.id]) {
      console.log(`🗡️ Acción de ${gameState.players[socket.id].name}:`, data);
      io.emit('updateGameState', gameState);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Desconectado: ${socket.id}`);
    if (gameState.master === socket.id) {
      gameState.master = null;
    }
    delete gameState.players[socket.id];

    io.emit('updateGameState', gameState);
  });
}
