import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateBoard, BOARD_SIZE } from '../utils/match3/board';
import { findMatches, resolveSpecialPieces, hasPossibleMoves } from '../utils/match3/matching';
import { cascadeBoard } from '../utils/match3/cascading';
import { executePowerLogic } from '../utils/match3/powers';
import { 
  addScore, 
  incrementCombo, 
  consumePowerCharge, 
  setDomainExpansion,
  tickTimer
} from '../store/slices/shadowGardenSlice';
import { useSound } from './useSound';
import gsap from 'gsap';

export const useMatch3 = () => {
  const dispatch = useDispatch();
  const { playSFX } = useSound();
  const { powerUsages, currentLevel, loveMeter, timeLeft } = useSelector(state => state.shadowGarden);
  
  const [board, setBoard] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [isFreeSwapActive, setIsFreeSwapActive] = useState(false);
  
  useEffect(() => {
    setBoard(generateBoard(BOARD_SIZE));
  }, []);

  useEffect(() => {
    if (isProcessing) return;
    const interval = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, isProcessing]);

  useEffect(() => {
    if (!isProcessing && board.length > 0 && !hasPossibleMoves(board)) {
      playSFX('sparkle', '/sounds/sparkle.mp3');
      setBoard(generateBoard(BOARD_SIZE));
    }
  }, [board, isProcessing, playSFX]);

  const triggerSpecialTileEffect = useCallback(async (tile, boardState) => {
    const { row, col, specialType, type } = tile;
    let affected = [];
    const size = boardState.length;

    if (specialType === 'striker') {
      const isHorizontal = tile.direction === 'horizontal';
      if (isHorizontal) {
        for (let c = 0; c < size; c++) affected.push({ r: row, c });
      } else {
        for (let r = 0; r < size; r++) affected.push({ r, c: col });
      }
    } else if (specialType === 'domain') {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < size && c >= 0 && c < size) affected.push({ r, c });
        }
      }
    } else if (specialType === 'monarch') {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          // Safety check: ensure row exists before accessing
          if (boardState[r] && boardState[r][c]?.type === type) {
            affected.push({ r, c });
          }
        }
      }
    }

    const newBoard = JSON.parse(JSON.stringify(boardState));
    affected.forEach(({ r, c }) => {
      // Safety check: ensure row and column exist before accessing
      if (newBoard[r] && typeof newBoard[r][c] !== 'undefined') {
        newBoard[r][c] = null;
      }
    });
    return newBoard;
  }, []);

  const processChain = useCallback(async (currentBoard, currentCombo = 0) => {
    const matches = findMatches(currentBoard);
    
    if (matches.length === 0) {
      setIsProcessing(false);
      setComboCount(0);
      if (currentLevel === 5 && loveMeter >= 100) dispatch(setDomainExpansion(true));
      return;
    }

    let boardAfterRemoval = JSON.parse(JSON.stringify(currentBoard));
    let points = 0;
    
    for (const match of matches) {
      points += match.tiles.length * 100;
      for (const t of match.tiles) {
        const tile = currentBoard[t.row][t.col];
        if (tile?.isSpecial) {
          boardAfterRemoval = await triggerSpecialTileEffect(tile, boardAfterRemoval);
          playSFX('firework', '/sounds/firework.mp3');
        } else {
          boardAfterRemoval[t.row][t.col] = null;
        }
      }
    }

    const specials = resolveSpecialPieces(currentBoard, matches);
    specials.forEach(s => {
      boardAfterRemoval[s.row][s.col] = {
        type: currentBoard[s.row][s.col].type,
        id: `special-${Date.now()}-${Math.random()}`,
        isSpecial: true,
        specialType: s.specialType,
        direction: s.direction
      };
    });

    const multiplier = 1 + (currentCombo * 0.5);
    const finalPoints = Math.floor(points * multiplier);
    dispatch(addScore(finalPoints));
    if (currentCombo > 0) dispatch(incrementCombo());
    
    setBoard(boardAfterRemoval);
    await new Promise(r => setTimeout(r, 400));

    const boardAfterCascade = cascadeBoard(boardAfterRemoval);
    setBoard(boardAfterCascade);
    await new Promise(r => setTimeout(r, 500));

    await processChain(boardAfterCascade, currentCombo + 1);
  }, [dispatch, currentLevel, loveMeter, triggerSpecialTileEffect, playSFX]);

  const activatePower = useCallback(async (powerId) => {
    if (powerUsages[powerId] <= 0 || isProcessing) return;

    dispatch(consumePowerCharge(powerId));
    setIsProcessing(true);

    const overlay = document.getElementById('power-overlay');
    if (overlay) {
      gsap.fromTo(overlay, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, yoyo: true, repeat: 1 });
    }

    const { newBoard: boardAfterPower } = executePowerLogic(powerId, board);
    const boardAfterCascade = cascadeBoard(boardAfterPower);
    setBoard(boardAfterCascade);
    
    await new Promise(r => setTimeout(r, 800));
    await processChain(boardAfterCascade, 0);
  }, [board, powerUsages, isProcessing, dispatch, processChain]);

  const swapTiles = useCallback(async (tile1, tile2, ignoreAdjacency = false) => {
    setIsProcessing(true);
    const newBoard = JSON.parse(JSON.stringify(board));
    const temp = newBoard[tile1.row][tile1.col];
    newBoard[tile1.row][tile1.col] = newBoard[tile2.row][tile2.col];
    newBoard[tile2.row][tile2.col] = temp;
    
    setBoard(newBoard);
    await new Promise(r => setTimeout(r, 300));
    
    const matches = findMatches(newBoard);
    if (matches.length > 0 || ignoreAdjacency) {
      await processChain(newBoard, 0);
    } else {
      setBoard(board);
      setIsProcessing(false);
    }
  }, [board, processChain]);

  const handleTileClick = (row, col) => {
    if (isProcessing || (currentLevel < 5 && timeLeft <= 0)) return;
    if (!selectedTile) {
      setSelectedTile({ row, col });
    } else {
      const isAdjacent = Math.abs(selectedTile.row - row) + Math.abs(selectedTile.col - col) === 1;
      if (isAdjacent || isFreeSwapActive) {
        swapTiles(selectedTile, { row, col }, isFreeSwapActive);
        if (isFreeSwapActive) setIsFreeSwapActive(false);
      }
      setSelectedTile(null);
    }
  };

  const clearTileType = useCallback(async (type) => {
    setIsProcessing(true);
    const newBoard = board.map(row => row.map(tile => (tile && tile.type === type ? null : tile)));
    setBoard(newBoard);
    await new Promise(r => setTimeout(r, 400));
    const boardAfterCascade = cascadeBoard(newBoard);
    setBoard(boardAfterCascade);
    await new Promise(r => setTimeout(r, 500));
    await processChain(boardAfterCascade, 0);
  }, [board, processChain]);

  return { board, selectedTile, isProcessing, comboCount, isFreeSwapActive, handleTileClick, activatePower, clearTileType };
};
