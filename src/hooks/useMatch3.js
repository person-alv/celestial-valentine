import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateBoard, BOARD_SIZE } from '../utils/match3/board';
import { findMatches, resolveSpecialPieces, hasPossibleMoves } from '../utils/match3/matching';
import { cascadeBoard } from '../utils/match3/cascading';
import { executePowerLogic } from '../utils/match3/powers';
import {
  addScore,
  incrementCombo,
  consumePowerCharge,
  setScoreMultiplier,
  tickTimer,
} from '../store/slices/shadowGardenSlice';
import { useSound } from './useSound';

export const useMatch3 = () => {
  const dispatch = useDispatch();
  const { playSFX } = useSound();
  const { powerUsages, currentLevel, timeLeft } = useSelector(s => s.shadowGarden);

  // Always-current level ref — lets async chains detect mid-chain level transitions
  const currentLevelRef = useRef(currentLevel);
  currentLevelRef.current = currentLevel;

  const [board, setBoard] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [isFreeSwapActive, setIsFreeSwapActive] = useState(false);

  // Power targeting modes
  const [isSelectingRow, setIsSelectingRow] = useState(false);   // Power 0
  const [isSelectingType, setIsSelectingType] = useState(false); // Power 3
  const pendingPowerRef = useRef(null); // which power is pending a target

  // Full Counter tracking (Power 6)
  const lastMatchScoreRef = useRef(0);
  const lastMatchTimeRef = useRef(0);

  // Special tile detonation effects for the board overlay
  const [specialEffects, setSpecialEffects] = useState([]);

  // Generate a fresh board whenever the level changes (including initial mount at level 1)
  useEffect(() => {
    setBoard(generateBoard(BOARD_SIZE));
    setSelectedTile(null);
    setComboCount(0);
    setIsProcessing(false);
  }, [currentLevel]);

  // Timer tick
  useEffect(() => {
    if (isProcessing) return;
    const interval = setInterval(() => dispatch(tickTimer()), 1000);
    return () => clearInterval(interval);
  }, [dispatch, isProcessing]);

  // Shuffle board if no moves remain
  useEffect(() => {
    if (!isProcessing && board.length > 0 && !hasPossibleMoves(board)) {
      setBoard(generateBoard(BOARD_SIZE));
    }
  }, [board, isProcessing]);

  // ── SPECIAL EFFECTS HELPERS ──
  const addEffect = useCallback((effect) => {
    const id = `${effect.type}-${Date.now()}-${Math.random()}`;
    setSpecialEffects(prev => [...prev, { ...effect, id }]);
    // Auto-remove after animation
    setTimeout(() => {
      setSpecialEffects(prev => prev.filter(e => e.id !== id));
    }, 700);
  }, []);

  // ── SPECIAL TILE DETONATION ──
  const triggerSpecialTileEffect = useCallback(async (tile, boardState) => {
    const { row, col, specialType, type } = tile;
    let affected = [];
    const size = boardState.length;

    if (specialType === 'striker') {
      const isHorizontal = tile.direction !== 'vertical';
      if (isHorizontal) {
        for (let c = 0; c < size; c++) affected.push({ r: row, c });
        addEffect({ type: 'striker-h', row });
      } else {
        for (let r = 0; r < size; r++) affected.push({ r, c: col });
        addEffect({ type: 'striker-v', col });
      }
    } else if (specialType === 'domain') {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < size && c >= 0 && c < size) affected.push({ r, c });
        }
      }
      addEffect({ type: 'domain', row, col });
    } else if (specialType === 'monarch') {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (boardState[r]?.[c]?.type === type) affected.push({ r, c });
        }
      }
      addEffect({ type: 'monarch', row, col });
    }

    const newBoard = JSON.parse(JSON.stringify(boardState));
    affected.forEach(({ r, c }) => {
      if (newBoard[r]?.[c] !== undefined) newBoard[r][c] = null;
    });
    return newBoard;
  }, [addEffect]);

  // ── MATCH CHAIN PROCESSOR ──
  const processChain = useCallback(async (currentBoard, currentCombo = 0) => {
    // Snapshot the level at chain-start; abort if it changes mid-chain (level transition)
    const chainLevel = currentLevelRef.current;

    const matches = findMatches(currentBoard);
    if (matches.length === 0) {
      setIsProcessing(false);
      setComboCount(0);
      return;
    }

    // Notify tutorial that a match was made (no-op when TutorialOverlay is not mounted)
    window.dispatchEvent(new CustomEvent('tutorial-action', { detail: { type: 'match' } }));

    let boardAfterRemoval = JSON.parse(JSON.stringify(currentBoard));
    let points = 0;
    const specialFiredPositions = new Set();

    for (const match of matches) {
      points += match.tiles.length * 100;
      for (const t of match.tiles) {
        const tile = currentBoard[t.row][t.col];
        if (tile?.isSpecial) {
          specialFiredPositions.add(`${t.row},${t.col}`);
          // Spread in the match position — tile objects in the board don't store row/col
          boardAfterRemoval = await triggerSpecialTileEffect(
            { ...tile, row: t.row, col: t.col },
            boardAfterRemoval
          );
        } else {
          boardAfterRemoval[t.row][t.col] = null;
        }
      }
    }

    const specials = resolveSpecialPieces(currentBoard, matches);
    specials.forEach(s => {
      // Don't overwrite a position where a special tile just detonated
      if (specialFiredPositions.has(`${s.row},${s.col}`)) return;
      boardAfterRemoval[s.row][s.col] = {
        type: currentBoard[s.row][s.col].type,
        id: `special-${Date.now()}-${Math.random()}`,
        isSpecial: true,
        specialType: s.specialType,
        direction: s.direction,
      };
    });

    const comboMultiplier = 1 + (currentCombo * 0.5);
    const finalPoints = Math.floor(points * comboMultiplier);
    dispatch(addScore(finalPoints));
    if (currentCombo > 0) dispatch(incrementCombo());

    // Track last match for Full Counter
    lastMatchScoreRef.current = finalPoints;
    lastMatchTimeRef.current = Date.now();

    // 10+ combo → dispatch temporary x2 multiplier (10 seconds)
    if (currentCombo >= 9) {
      dispatch(setScoreMultiplier({ multiplier: 2, durationMs: 10000 }));
    }

    setComboCount(currentCombo + 1);
    setBoard(boardAfterRemoval);
    await new Promise(r => setTimeout(r, 400));

    // Level changed while we were waiting — discard this chain's remaining work
    if (currentLevelRef.current !== chainLevel) {
      setIsProcessing(false);
      setComboCount(0);
      return;
    }

    const boardAfterCascade = cascadeBoard(boardAfterRemoval);
    setBoard(boardAfterCascade);
    await new Promise(r => setTimeout(r, 500));

    if (currentLevelRef.current !== chainLevel) {
      setIsProcessing(false);
      setComboCount(0);
      return;
    }

    await processChain(boardAfterCascade, currentCombo + 1);
  }, [dispatch, triggerSpecialTileEffect]);

  // ── SWAP ──
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

  // ── TILE CLICK ──
  const handleTileClick = useCallback((row, col) => {
    if (isProcessing || (currentLevel < 5 && timeLeft <= 0)) return;

    // Power 0: row selection mode
    if (isSelectingRow) {
      setIsSelectingRow(false);
      pendingPowerRef.current = null;
      _firePower(0, { row });
      return;
    }

    // Power 3: tile-type selection mode
    if (isSelectingType) {
      const targetType = board[row]?.[col]?.type;
      if (targetType === undefined) return;
      setIsSelectingType(false);
      pendingPowerRef.current = null;
      _firePower(3, { type: targetType });
      return;
    }

    // Normal click
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
  }, [isProcessing, currentLevel, timeLeft, isSelectingRow, isSelectingType, selectedTile, isFreeSwapActive, swapTiles, board]);

  // ── INTERNAL POWER FIRE (after targeting or immediate) ──
  const _firePower = useCallback(async (powerId, options = {}) => {
    setIsProcessing(true);
    const { newBoard: boardAfterPower } = executePowerLogic(powerId, board, options);
    const boardAfterCascade = cascadeBoard(boardAfterPower);
    setBoard(boardAfterCascade);
    await new Promise(r => setTimeout(r, 500));
    await processChain(boardAfterCascade, 0);
  }, [board, processChain]);

  // ── PUBLIC POWER ACTIVATOR (called from cinema onComplete) ──
  const activatePower = useCallback(async (powerId) => {
    if ((powerUsages[powerId] ?? 0) <= 0 || isProcessing) return;
    dispatch(consumePowerCharge(powerId));

    // Power 0: enter row-select mode (cinema handles the wait)
    if (powerId === 0) {
      setIsSelectingRow(true);
      pendingPowerRef.current = 0;
      return; // don't lock processing — user still needs to pick row
    }

    // Power 2: enable free swap
    if (powerId === 2) {
      setIsFreeSwapActive(true);
      return;
    }

    // Power 3: enter type-select mode
    if (powerId === 3) {
      setIsSelectingType(true);
      pendingPowerRef.current = 3;
      return;
    }

    // Power 4: Ten Shadows — 2× multiplier for 15 seconds (no board change)
    if (powerId === 4) {
      dispatch(setScoreMultiplier({ multiplier: 2, durationMs: 15000 }));
      return;
    }

    // Power 6: Full Counter ��� triple last match score (must be within 3s)
    if (powerId === 6) {
      const now = Date.now();
      if (lastMatchScoreRef.current > 0 && now - lastMatchTimeRef.current < 3000) {
        dispatch(addScore(lastMatchScoreRef.current * 3));
      } else {
        // Outside window — still fire but with current board score estimate
        dispatch(addScore(500)); // fallback minimum
      }
      return;
    }

    // Powers 1, 5: immediate board effect
    await _firePower(powerId);
  }, [powerUsages, isProcessing, dispatch, _firePower]);

  // ── ALVIN BLESSING: clear least-common tile type ──
  const clearTileType = useCallback(async (type) => {
    setIsProcessing(true);
    const newBoard = board.map(row => row.map(tile => (tile?.type === type ? null : tile)));
    setBoard(newBoard);
    await new Promise(r => setTimeout(r, 400));
    const boardAfterCascade = cascadeBoard(newBoard);
    setBoard(boardAfterCascade);
    await new Promise(r => setTimeout(r, 500));
    await processChain(boardAfterCascade, 0);
  }, [board, processChain]);

  return {
    board,
    selectedTile,
    isProcessing,
    comboCount,
    isFreeSwapActive,
    isSelectingRow,
    isSelectingType,
    specialEffects,
    handleTileClick,
    activatePower,
    clearTileType,
  };
};
