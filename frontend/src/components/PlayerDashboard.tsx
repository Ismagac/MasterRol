import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { PlayerData } from '../types';

const PlayerDashboard: React.FC = () => {
  const { gameState, currentPlayerId, performPlayerAction, currentRole, isJoining } = useGame();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionTarget, setActionTarget] = useState('');
  const [validationAttempts, setValidationAttempts] = useState(0);
  
  const navigate = useNavigate();

  // Obtener los datos del jugador actual con validación mejorada
  useEffect(() => {
    const validationTimer = setTimeout(() => {
      console.log('🔍 Validando si es jugador:', {
        currentRole,
        isPlayer: gameState.players[currentPlayerId || ''] !== undefined,
        currentId: currentPlayerId,
        isJoining
      });

      // Solo redirigir después de varios intentos y si no está en proceso de unirse
      if (!isJoining && currentRole === 'player' && 
          (!currentPlayerId || !gameState.players[currentPlayerId]) && 
          validationAttempts > 3) {
        console.log('❌ No autorizado como jugador, redirigiendo');
        navigate('/');
        return;
      }
      
      if (currentPlayerId && gameState.players[currentPlayerId]) {
        setPlayerData(gameState.players[currentPlayerId]);
      }
      
      setValidationAttempts(prev => prev + 1);
    }, 1000);
    
    return () => clearTimeout(validationTimer);
  }, [gameState, currentPlayerId, navigate, validationAttempts, currentRole, isJoining]);

  // Ejecutar una acción del jugador
  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAction) return;
    
    performPlayerAction({
      type: selectedAction,
      target: actionTarget || null
    });
    
    setSelectedAction('');
    setActionTarget('');
  };

  // Si está cargando, mostrar un mensaje
  if (isJoining || !playerData) {
    return <div className="loading">Cargando datos del jugador...</div>;
  }

  return (
    <div className="player-dashboard">
      <h2>Panel de {playerData.name}</h2>
      
      <div className="character-sheet">
        <div className="character-info">
          <h3>Información del personaje</h3>
          
          <div className="health-bar">
            <label>Salud: {playerData.health}/100</label>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${playerData.health}%`, 
                backgroundColor: playerData.health > 50 ? 'green' : 'red' }}
              ></div>
            </div>
          </div>
          
          <div className="stats">
            <h4>Estadísticas</h4>
            <p>Fuerza: {playerData.stats.strength}</p>
            <p>Agilidad: {playerData.stats.agility}</p>
            <p>Inteligencia: {playerData.stats.intelligence}</p>
          </div>
        </div>
        
        <div className="actions">
          <h3>Acciones disponibles</h3>
          
          <form onSubmit={handleAction}>
            <div className="form-group">
              <label htmlFor="action">Acción:</label>
              <select 
                id="action"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                required
              >
                <option value="">Seleccionar acción...</option>
                {playerData.attacks.map((attack, index) => (
                  <option key={index} value={attack}>
                    {attack}
                  </option>
                ))}
                <option value="dodge">Esquivar</option>
                <option value="defend">Defender</option>
                <option value="item">Usar objeto</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="target">Objetivo (opcional):</label>
              <select 
                id="target"
                value={actionTarget}
                onChange={(e) => setActionTarget(e.target.value)}
              >
                <option value="">Sin objetivo específico</option>
                {Object.values(gameState.players)
                  .filter(p => p.id !== currentPlayerId)
                  .map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                ))}
              </select>
            </div>
            
            <button type="submit" disabled={!selectedAction}>
              Ejecutar Acción
            </button>
          </form>
        </div>
      </div>
      
      <div className="game-log">
        <h3>Registro de partida</h3>
        <div className="log-entries">
          <p>Bienvenido a la partida</p>
          {/* Aquí se mostrarían los eventos del juego */}
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
