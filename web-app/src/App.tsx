import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import GuessNumber from './games/GuessNumber';
import RollTheDice from './games/RollTheDice';
import Hangman from './games/Hangman';
import Mastermind from './games/Mastermind';
import Minesweeper from './games/Minesweeper';
import RockPaperScissors from './games/RockPaperScissors';
import Battleship from './games/Battleship';
import { routerBasename } from './lib/routerBase';

function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guess-number" element={<GuessNumber />} />
          <Route path="/roll-dice" element={<RollTheDice />} />
          <Route path="/hangman" element={<Hangman />} />
          <Route path="/mastermind" element={<Mastermind />} />
          <Route path="/minesweeper" element={<Minesweeper />} />
          <Route path="/rps" element={<RockPaperScissors />} />
          <Route path="/battleship" element={<Battleship />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
