import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import PlayerCard from './PlayerCard';

const MasterDashboard: React.FC = () => {
  const { gameState, currentPlayerId, performMasterAction } = useGame();
  const [actionType, setActionType] = useState('');
  const [actionTarget, setActionTarget] = useState('');
  const [actionValue, setActionValue] = useState('');
  
  const navigate = useNavigate();

  // Verificar si el usuario actual es el master
  React.useEffect(() => {
    if (gameState.master !== currentPlayerId) {
      navigate('/');
    }
  }, [gameState.master, currentPlayerId, navigate]);

  // Ejecutar una acción del master
  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear objeto con la acción a realizar
    const action = {
      type: actionType,
      target: actionTarget,
      value: actionValue
    };
    
    // Enviar la acción
    performMasterAction(action);
    
    // Limpiar el formulario
    setActionType('');
    setActionValue('');
  };

  // Generar evento narrativo
  const generateNarrative = () => {
    performMasterAction({
      type: 'narrative',
      description: 'Un nuevo evento ha ocurrido en el mundo.'
    });
  };

  // Calcular daño a un jugador
  const damagePlayer = (playerId: string, amount: number) => {
    performMasterAction({
      type: 'damage',
      target: playerId,
      value: amount
    });
  };

  return (
    <div className="master-dashboard">
      <h2>Panel del Master</h2>
      
      <div className="players-section">
        <h3>Jugadores en partida</h3>
        {Object.keys(gameState.players).length === 0 ? (
          <p>No hay jugadores conectados</p>
        ) : (
          <div className="players-grid">
            {Object.values(gameState.players).map((player) => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                isMaster={true}
                onDamage={(amount) => damagePlayer(player.id, amount)}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="actions-section">
        <h3>Acciones del Master</h3>
        
        <div className="quick-actions">
          <button onClick={generateNarrative}>
            Generar Evento Narrativo
          </button>
          <button onClick={() => performMasterAction({type: 'environment', effect: 'rain'})}>
            Cambiar Ambiente (Lluvia)
          </button>
          <button onClick={() => performMasterAction({type: 'spawn', entity: 'monster'})}>
            Invocar Enemigo
          </button>
        </div>
        
        <form onSubmit={handleAction} className="custom-action-form">
          <h4>Acción Personalizada</h4>
          
          <div className="form-group">
            <label htmlFor="actionType">Tipo:</label>
            <select 
              id="actionType"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="damage">Daño</option>
              <option value="heal">Curación</option>
              <option value="effect">Efecto</option>
              <option value="narrative">Narrativa</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="actionTarget">Objetivo:</label>
            <select 
              id="actionTarget"
              value={actionTarget}
              onChange={(e) => setActionTarget(e.target.value)}
            >
              <option value="">Todos</option>
              {Object.values(gameState.players).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="actionValue">Valor/Descripción:</label>
            <input
              id="actionValue"
              type="text"
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
              required
            />
          </div>
          
          <button type="submit">Ejecutar Acción</button>
        </form>
      </div>
    </div>
  );
};

export default MasterDashboard;
