import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameState, PlayerData, Role } from '../types';
import SocketService from '../services/SocketService';

interface GameContextType {
  gameState: GameState;
  currentPlayerId: string | null;
  currentRole: Role | null;
  joinGame: (role: Role, playerData?: PlayerData) => void;
  performMasterAction: (action: any) => void;
  performPlayerAction: (action: any) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    master: null,
    players: {}
  });
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  
  const navigate = useNavigate();

  // Inicializar la conexión al montar el componente
  useEffect(() => {
    const socket = SocketService.connect();
    
    // Escuchar actualizaciones del estado del juego
    socket.on('updateGameState', (state: GameState) => {
      console.log('📊 Estado del juego actualizado:', state);
      setGameState(state);
    });
    
    // Escuchar acciones del master
    socket.on('masterAction', (action: any) => {
      console.log('⚡ Acción del master recibida:', action);
    });
    
    // Escuchar errores
    socket.on('error', (error: {message: string}) => {
      console.error('❌ Error:', error.message);
      alert(error.message);
    });

    // Guardar el ID del jugador
    if (socket.id) {
      setCurrentPlayerId(socket.id);
    }
    
    return () => {
      SocketService.disconnect();
    };
  }, []);

  // Función para unirse al juego
  const joinGame = (role: Role, playerData?: PlayerData) => {
    setCurrentRole(role);
    
    // Si es jugador, crear datos del personaje si no se proporcionan
    if (role === 'player' && !playerData) {
      playerData = {
        id: currentPlayerId || '',
        name: 'Jugador',
        health: 100,
        stats: {
          strength: 10,
          agility: 10,
          intelligence: 10,
        },
        attacks: ['Ataque básico']
      };
    }
    
    // Enviar solicitud para unirse
    SocketService.joinGame(role, playerData);
    
    // Navegar a la vista correspondiente
    navigate(role === 'master' ? '/master' : '/player');
  };

  // Enviar acción del master
  const performMasterAction = (action: any) => {
    SocketService.sendMasterAction(action);
  };

  // Enviar acción del jugador
  const performPlayerAction = (action: any) => {
    SocketService.sendPlayerAction(action);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentPlayerId,
        currentRole,
        joinGame,
        performMasterAction,
        performPlayerAction
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook para usar el contexto del juego
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
