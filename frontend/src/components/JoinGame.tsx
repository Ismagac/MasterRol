import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { PlayerData } from '../types';

const JoinGame: React.FC = () => {
  const { joinGame } = useGame();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'master' | 'player' | null>(null);
  const [stats, setStats] = useState({
    strength: 10,
    agility: 10,
    intelligence: 10,
  });

  // Función para manejar cambios en las estadísticas
  const handleStatChange = (stat: keyof typeof stats, value: number) => {
    setStats(prev => ({
      ...prev,
      [stat]: value
    }));
  };

  // Función para unirse como master
  const handleJoinAsMaster = () => {
    joinGame('master');
  };

  // Función para unirse como jugador
  const handleJoinAsPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear datos del jugador
    const playerData: PlayerData = {
      id: '',  // El backend asignará el ID real
      name: name,
      health: 100,
      stats: { ...stats },
      attacks: ['Golpe', 'Esquivar', 'Hechizo básico']
    };
    
    joinGame('player', playerData);
  };

  return (
    <div className="join-game-container">
      <h2>Unirse a la partida</h2>
      
      {!selectedRole ? (
        <div className="role-selection">
          <h3>Selecciona tu rol</h3>
          <div className="buttons">
            <button 
              className="role-button master" 
              onClick={() => setSelectedRole('master')}
            >
              Master
            </button>
            <button 
              className="role-button player" 
              onClick={() => setSelectedRole('player')}
            >
              Jugador
            </button>
          </div>
        </div>
      ) : selectedRole === 'master' ? (
        <div className="master-join">
          <h3>Unirse como Master</h3>
          <p>Como master, controlarás el mundo y los eventos del juego.</p>
          <button className="join-button" onClick={handleJoinAsMaster}>
            Entrar como Master
          </button>
          <button className="back-button" onClick={() => setSelectedRole(null)}>
            Volver
          </button>
        </div>
      ) : (
        <div className="player-join">
          <h3>Crea tu personaje</h3>
          <form onSubmit={handleJoinAsPlayer}>
            <div className="form-group">
              <label htmlFor="name">Nombre de tu personaje:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="stats-container">
              <h4>Estadísticas (Total: {stats.strength + stats.agility + stats.intelligence}/30)</h4>
              
              <div className="stat-group">
                <label>Fuerza: {stats.strength}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={stats.strength}
                  onChange={(e) => handleStatChange('strength', parseInt(e.target.value))}
                />
              </div>
              
              <div className="stat-group">
                <label>Agilidad: {stats.agility}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={stats.agility}
                  onChange={(e) => handleStatChange('agility', parseInt(e.target.value))}
                />
              </div>
              
              <div className="stat-group">
                <label>Inteligencia: {stats.intelligence}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={stats.intelligence}
                  onChange={(e) => handleStatChange('intelligence', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="button-group">
              <button type="submit" className="join-button">
                Crear y Unirse
              </button>
              <button 
                type="button" 
                className="back-button" 
                onClick={() => setSelectedRole(null)}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JoinGame;
