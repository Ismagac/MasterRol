import React from 'react';
import { PlayerData } from '../types';

interface PlayerCardProps {
  player: PlayerData;
  isMaster: boolean;
  onDamage?: (amount: number) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isMaster, onDamage }) => {
  // Función para aplicar daño (solo para el master)
  const handleDamage = (amount: number) => {
    if (onDamage) {
      onDamage(amount);
    }
  };

  return (
    <div className="player-card">
      <h4>{player.name}</h4>
      
      <div className="health-bar">
        <label>HP: {player.health}/100</label>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ 
              width: `${player.health}%`, 
              backgroundColor: player.health > 50 ? 'green' : 'red' 
            }}
          ></div>
        </div>
      </div>
      
      <div className="stats-summary">
        <p>STR: {player.stats.strength}</p>
        <p>AGI: {player.stats.agility}</p>
        <p>INT: {player.stats.intelligence}</p>
      </div>
      
      {isMaster && onDamage && (
        <div className="master-controls">
          <button onClick={() => handleDamage(5)}>Daño 5</button>
          <button onClick={() => handleDamage(10)}>Daño 10</button>
          <button onClick={() => handleDamage(20)}>Daño 20</button>
          <button onClick={() => handleDamage(-10)}>Curar 10</button>
        </div>
      )}
      
      <div className="attacks">
        <h5>Ataques:</h5>
        <ul>
          {player.attacks.map((attack, index) => (
            <li key={index}>{attack}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerCard;
