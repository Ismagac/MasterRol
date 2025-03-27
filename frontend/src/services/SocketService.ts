import { io, Socket } from 'socket.io-client';
import { GameState, PlayerData, Role } from '../types';

// URL del servidor backend
const SERVER_URL = 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  
  // Inicializa la conexión con el servidor
  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SERVER_URL);
      console.log('🔌 Conectando al servidor...');
    }
    return this.socket;
  }

  // Desconecta del servidor
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Desconectado del servidor');
    }
  }

  // Unirse al juego como master o jugador
  joinGame(role: Role, playerData?: PlayerData): void {
    if (!this.socket) return;
    this.socket.emit('joinGame', { role, playerData });
    console.log(`🎮 Uniendo al juego como ${role}`);
  }

  // Enviar acción del master
  sendMasterAction(action: any): void {
    if (!this.socket) return;
    this.socket.emit('masterAction', action);
  }

  // Enviar acción del jugador
  sendPlayerAction(action: any): void {
    if (!this.socket) return;
    this.socket.emit('playerAction', action);
  }

  // Retornar el socket para escuchar eventos directamente
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Exportar una única instancia del servicio
export default new SocketService();
