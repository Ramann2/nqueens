const express = require('express');
const router = express.Router();  // Use express.Router() to create a new router

// Define your POST /solve route
router.post('/solve', (req, res) => {
  const n = parseInt(req.body.n, 10);
  const solutions = solveNQueens(n);
  res.json({ count: solutions.length, solutions: solutions });
});

// Export the router
module.exports = router;


function solveNQueens(n) {
    const solutions = [];
    const board = Array.from({ length: n }, () => Array(n).fill('.'));
    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();
  
    function backtrack(row) {
      if (row === n) {
        const solution = [];
        for (let i = 0; i < n; i++) {
          const col = board[i].indexOf('Q');
          solution.push([i, col]);
        }
        solutions.push(solution);
        return;
      }
      for (let col = 0; col < n; col++) {
        if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
  
        board[row][col] = 'Q';
        cols.add(col);
        diag1.add(row - col);
        diag2.add(row + col);
  
        backtrack(row + 1);
  
        board[row][col] = '.';
        cols.delete(col);
        diag1.delete(row - col);
        diag2.delete(row + col);
      }
    }
  
    backtrack(0);
    return solutions;
  }
  
  
  router.post('/solve', (req, res) => {
    const n = parseInt(req.body.n, 10);
    const solutions = solveNQueens(n);
    res.json({ count: solutions.length, solutions: solutions });
  });
  