import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import JoinGame from './components/JoinGame'
import MasterDashboard from './components/MasterDashboard'
import PlayerDashboard from './components/PlayerDashboard'
import { GameProvider } from './contexts/GameContext'

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="app-container">
          <h1 className="game-title">MasterRol</h1>
          <Routes>
            <Route path="/" element={<JoinGame />} />
            <Route path="/master" element={<MasterDashboard />} />
            <Route path="/player" element={<PlayerDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </GameProvider>
    </Router>
  )
}

export default App
