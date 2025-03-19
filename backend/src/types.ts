export type Role = 'master' | 'player';

export interface PlayerData {
  id: string;
  name: string;
  health: number;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
  };
  attacks: string[];
}

export interface GameState {
  master: string | null;
  players: Record<string, PlayerData>;
}
