document.addEventListener('DOMContentLoaded', () => {
    // State management
    let solutions = [];
    let currentSolutionIndex = 0;
    let n = 8; // Default value
    
    // DOM elements
    const nInput = document.getElementById('nInput');
    const solveBtn = document.getElementById('solveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const prevSolutionBtn = document.getElementById('prevSolution');
    const nextSolutionBtn = document.getElementById('nextSolution');
    const solutionCounter = document.getElementById('solutionCounter');
    const solutionCountEl = document.getElementById('solutionCount');
    const timeEl = document.getElementById('time');
    const solutionNav = document.querySelector('.solution-nav');
    
    // Event listeners
    solveBtn.addEventListener('click', solveNQueens);
    resetBtn.addEventListener('click', resetBoard);
    prevSolutionBtn.addEventListener('click', showPreviousSolution);
    nextSolutionBtn.addEventListener('click', showNextSolution);
    document.getElementById('decrementN').addEventListener('click', () => adjustN(-1));
    document.getElementById('incrementN').addEventListener('click', () => adjustN(1));
    
    // Initialize
    createBoard(n);
    
    function adjustN(change) {
      let newN = parseInt(nInput.value) + change;
      if (newN >= parseInt(nInput.min) && newN <= parseInt(nInput.max)) {
        nInput.value = newN;
      }
    }
    
    async function solveNQueens() {
      n = parseInt(nInput.value);
      if (isNaN(n) || n < 1) {
        alert('Please enter a valid number');
        return;
      }
      
      // Visual loading state
      solveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Solving...';
      solveBtn.disabled = true;
      
      try {
        const startTime = performance.now();
        
        // Clear previous board and create new one
        resetBoard();
        createBoard(n);
        
        // Fetch solutions from server
        const response = await fetch('/solve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ n })
        });
        
        if (!response.ok) throw new Error('Server error');
        
        const result = await response.json();
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Update UI with results
        solutions = result.solutions;
        currentSolutionIndex = 0;
        
        timeEl.textContent = executionTime.toFixed(2);
        solutionCountEl.textContent = solutions.length;
        
        if (solutions.length > 0) {
          placeQueens(solutions[currentSolutionIndex], n);
          solutionCounter.textContent = `Solution ${currentSolutionIndex + 1}/${solutions.length}`;
          solutionNav.classList.remove('hidden');
          solutionNav.classList.add('visible');
        } else {
          solutionNav.classList.add('hidden');
        }
        
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to solve. Please try again.');
      } finally {
        solveBtn.innerHTML = '<i class="fas fa-play"></i> Solve';
        solveBtn.disabled = false;
      }
    }
    
    function createBoard(n) {
      const boardDiv = document.getElementById('board');
      boardDiv.innerHTML = '';
      boardDiv.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
      
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          const cell = document.createElement('div');
          cell.classList.add('cell', (row + col) % 2 === 0 ? 'light' : 'dark');
          boardDiv.appendChild(cell);
        }
      }
    }
    
    function placeQueens(queens, n) {
      const cells = document.querySelectorAll('.cell');
      cells.forEach(cell => cell.innerHTML = ''); // Clear existing queens
      
      queens.forEach((queen) => {
        const [row, col] = queen;
        const cellIndex = row * n + col;
        if (cellIndex >= 0 && cellIndex < cells.length) {
          const queenIcon = document.createElement('div');
          queenIcon.classList.add('queen');
          queenIcon.innerHTML = '<i class="fas fa-chess-queen"></i>';
          cells[cellIndex].appendChild(queenIcon);
        }
      });
    }
    
    function resetBoard() {
      solutions = [];
      currentSolutionIndex = 0;
      solutionNav.classList.add('hidden');
      solutionCountEl.textContent = '0';
      timeEl.textContent = '0.00';
      createBoard(n);
    }
    
    function showPreviousSolution() {
      if (solutions.length === 0) return;
      currentSolutionIndex = (currentSolutionIndex - 1 + solutions.length) % solutions.length;
      placeQueens(solutions[currentSolutionIndex], n);
      solutionCounter.textContent = `Solution ${currentSolutionIndex + 1}/${solutions.length}`;
    }
    
    function showNextSolution() {
      if (solutions.length === 0) return;
      currentSolutionIndex = (currentSolutionIndex + 1) % solutions.length;
      placeQueens(solutions[currentSolutionIndex], n);
      solutionCounter.textContent = `Solution ${currentSolutionIndex + 1}/${solutions.length}`;
    }
  });