/* =========================================================
   game.js — Kurt, Kuzu ve Lahana (Nehir Geçişi) Oyun Motoru
   Animasyonlar, Canvas Su Dalgası & Konfeti, Koşul-Sonuç (if-else)
   Mantığı, BFS İpucu Çözücü ve Etkileşim Yönetimi
   ========================================================= */
(function () {
  'use strict';

  const SVG_W = 1280;
  const SVG_H = 680;

  const CHAR_IDS = ['farmer', 'wolf', 'sheep', 'cabbage'];

  const CHAR_META = {
    farmer:  { name: 'Çiftçi', emoji: '🧑‍🌾', role: 'captain' },
    wolf:    { name: 'Kurt',   emoji: '🐺',  role: 'passenger' },
    sheep:   { name: 'Kuzu',   emoji: '🐑',  role: 'passenger' },
    cabbage: { name: 'Lahana', emoji: '🥬',  role: 'passenger' }
  };

  // Kıyı koordinatları (SVG viewBox 1280x680)
  const BANK_SLOTS = {
    left: {
      farmer:  { x: 315, y: 468 },
      wolf:    { x: 108, y: 458 },
      sheep:   { x: 215, y: 496 },
      cabbage: { x: 148, y: 556 }
    },
    right: {
      farmer:  { x: 965, y: 468 },
      sheep:   { x: 1065, y: 496 },
      wolf:    { x: 1172, y: 458 },
      cabbage: { x: 1132, y: 556 }
    }
  };

  // Sandal iskele konumları ve iç koltuk ofsetleri
  const BOAT_DOCK = {
    left:  { x: 492, y: 514 },
    right: { x: 788, y: 514 }
  };

  const BOAT_SEAT_OFFSET = {
    captain:   { dx: -36, dy: 2 },
    passenger: { dx: 36,  dy: -2 }
  };

  // ==================== OYUN DURUMU ====================
  const sound = new window.SoundManager();

  let state = createInitialState();
  let historyStack = []; // Her başarılı veya başarısız geçiş öncesi anlık görüntü
  let isBusy = false;    // Animasyon veya modal kilidi
  let gameEnded = false; // Kazanma veya kural ihlali aktif mi
  let activeTimeouts = [];

  // Görsel / animasyon konumları
  const boatVisual = {
    x: BOAT_DOCK.left.x,
    y: BOAT_DOCK.left.y,
    bobY: 0,
    tilt: 0,
    oarAngle: -18,
    crossing: null // { fromX, toX, startTime, duration, dir, onComplete }
  };

  const charVisuals = {};
  CHAR_IDS.forEach((id) => {
    const slot = BANK_SLOTS.left[id];
    charVisuals[id] = {
      x: slot.x,
      y: slot.y,
      scaleX: 1,
      scaleY: 1,
      hop: null // { fromX, fromY, toX, toY, startTime, duration, toBoat, onComplete }
    };
  });

  // Canvas parçacıkları: su dalgası izi, sıçrama, toz/yıldız ve konfeti
  const wakes = [];
  const splashes = [];
  const sparkles = [];
  const confetti = [];
  let confettiActive = false;
  let lastWakeEmit = 0;
  let lastSparkleEmit = 0;

  // DOM referansları
  let svgEl, canvasEl, ctx;
  let boatBackGroup, boatFrontGroup, boatBackShake, boatFrontShake, boatOar, boatSeatHints;
  const charEls = {};
  const bubbleEls = {};

  let elMoveCount, elRightCount, elToastBanner, elToastIcon, elToastText;
  let elSeatFarmerVal, elSeatPassengerVal;
  let btnCross, crossText, btnUndo, btnHint, btnAlgo, btnRules, btnRestart, btnSound, soundIcon;
  let algoDrawer, btnCloseAlgo, algoLogList;
  let ruleFarmer, ruleCapacity, ruleWolfSheep, ruleSheepCabbage;
  let failModal, failEmoji, failTitle, failMessage, failLogicText, btnFailUndo, btnFailRestart;
  let winModal, winStars, winMessage, winMoveCount, winRank, btnWinReplay, btnWinShowAlgo;
  let rulesModal, btnStartPlay, btnCloseRulesTop;

  function createInitialState() {
    return {
      boatSide: 'left',
      locations: {
        farmer: 'left',
        wolf: 'left',
        sheep: 'left',
        cabbage: 'left'
      },
      moves: 0,
      algoLog: [] // { step, text, failed }
    };
  }

  function cloneState(s) {
    return {
      boatSide: s.boatSide,
      locations: { ...s.locations },
      moves: s.moves,
      algoLog: s.algoLog.map((item) => ({ ...item }))
    };
  }

  function scheduleTimeout(fn, ms) {
    const id = setTimeout(() => {
      activeTimeouts = activeTimeouts.filter((t) => t !== id);
      fn();
    }, ms);
    activeTimeouts.push(id);
    return id;
  }

  function clearAllTimeouts() {
    activeTimeouts.forEach((id) => clearTimeout(id));
    activeTimeouts = [];
  }

  // ==================== BAŞLATMA ====================
  function init() {
    svgEl = document.getElementById('gameSvg');
    canvasEl = document.getElementById('effectsCanvas');
    ctx = canvasEl.getContext('2d');

    // Masalsı 2D SVG sahnesini oluştur
    svgEl.innerHTML = window.SceneArt.buildSceneSVG();

    // SVG düğüm referansları
    boatBackGroup = document.getElementById('boatBackGroup');
    boatFrontGroup = document.getElementById('boatFrontGroup');
    boatBackShake = document.getElementById('boatBackShake');
    boatFrontShake = document.getElementById('boatFrontShake');
    boatOar = document.getElementById('boatOar');
    boatSeatHints = document.getElementById('boatSeatHints');

    CHAR_IDS.forEach((id) => {
      const node = document.getElementById(`char-${id}`);
      charEls[id] = node;
      bubbleEls[id] = document.getElementById(`bubble-${id}`);
      node.addEventListener('click', () => onCharacterClick(id));
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCharacterClick(id);
        }
      });
    });

    // HUD & Modal referansları
    elMoveCount = document.getElementById('moveCount');
    elRightCount = document.getElementById('rightCount');
    elToastBanner = document.getElementById('toastBanner');
    elToastIcon = document.getElementById('toastIcon');
    elToastText = document.getElementById('toastText');
    elSeatFarmerVal = document.getElementById('seatFarmerVal');
    elSeatPassengerVal = document.getElementById('seatPassengerVal');

    btnCross = document.getElementById('btnCross');
    crossText = document.getElementById('crossText');
    btnUndo = document.getElementById('btnUndo');
    btnHint = document.getElementById('btnHint');
    btnAlgo = document.getElementById('btnAlgo');
    btnRules = document.getElementById('btnRules');
    btnRestart = document.getElementById('btnRestart');
    btnSound = document.getElementById('btnSound');
    soundIcon = document.getElementById('soundIcon');

    algoDrawer = document.getElementById('algoDrawer');
    btnCloseAlgo = document.getElementById('btnCloseAlgo');
    algoLogList = document.getElementById('algoLogList');

    ruleFarmer = document.getElementById('ruleFarmer');
    ruleCapacity = document.getElementById('ruleCapacity');
    ruleWolfSheep = document.getElementById('ruleWolfSheep');
    ruleSheepCabbage = document.getElementById('ruleSheepCabbage');

    failModal = document.getElementById('failModal');
    failEmoji = document.getElementById('failEmoji');
    failTitle = document.getElementById('failTitle');
    failMessage = document.getElementById('failMessage');
    failLogicText = document.getElementById('failLogicText');
    btnFailUndo = document.getElementById('btnFailUndo');
    btnFailRestart = document.getElementById('btnFailRestart');

    winModal = document.getElementById('winModal');
    winStars = document.getElementById('winStars');
    winMessage = document.getElementById('winMessage');
    winMoveCount = document.getElementById('winMoveCount');
    winRank = document.getElementById('winRank');
    btnWinReplay = document.getElementById('btnWinReplay');
    btnWinShowAlgo = document.getElementById('btnWinShowAlgo');

    rulesModal = document.getElementById('rulesModal');
    btnStartPlay = document.getElementById('btnStartPlay');
    btnCloseRulesTop = document.getElementById('btnCloseRulesTop');

    // Olay dinleyicileri
    btnCross.addEventListener('click', onCrossClick);
    btnUndo.addEventListener('click', onUndoClick);
    btnHint.addEventListener('click', onHintClick);
    btnAlgo.addEventListener('click', toggleAlgoDrawer);
    btnCloseAlgo.addEventListener('click', () => setAlgoDrawer(false));
    btnRules.addEventListener('click', () => {
      sound.playClick();
      rulesModal.hidden = false;
    });
    btnStartPlay.addEventListener('click', () => {
      sound.playClick();
      rulesModal.hidden = true;
    });
    btnCloseRulesTop.addEventListener('click', () => {
      sound.playClick();
      rulesModal.hidden = true;
    });
    btnRestart.addEventListener('click', () => {
      sound.playClick();
      resetGame();
    });
    btnSound.addEventListener('click', () => {
      const on = sound.toggle();
      soundIcon.textContent = on ? '🔊' : '🔇';
    });

    btnFailUndo.addEventListener('click', () => {
      sound.playClick();
      failModal.hidden = true;
      undoLastMove();
    });
    btnFailRestart.addEventListener('click', () => {
      sound.playClick();
      failModal.hidden = true;
      resetGame();
    });

    btnWinReplay.addEventListener('click', () => {
      sound.playClick();
      winModal.hidden = true;
      resetGame();
    });
    btnWinShowAlgo.addEventListener('click', () => {
      sound.playClick();
      winModal.hidden = true;
      setAlgoDrawer(true);
    });

    // Klavye kısayolları
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (!isBusy && historyStack.length > 0 && failModal.hidden && winModal.hidden) {
          undoLastMove();
        }
      } else if (e.key === 'Escape') {
        rulesModal.hidden = true;
        setAlgoDrawer(false);
      }
    });

    // Canvas yeniden boyutlandırma
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Başlangıç arayüzünü güncelle
    syncVisualPositionsImmediate();
    updateUI();

    // Ana animasyon döngüsünü başlat
    requestAnimationFrame(tick);
  }

  // ==================== KOORDİNAT DÖNÜŞÜMÜ (SVG <-> CANVAS) ====================
  function resizeCanvas() {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = Math.max(1, Math.floor(rect.width * dpr));
    canvasEl.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function svgToCanvas(sx, sy) {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;
    // preserveAspectRatio="xMidYMid meet" dönüşümü
    const scale = Math.min(cw / SVG_W, ch / SVG_H);
    const offsetX = (cw - SVG_W * scale) / 2;
    const offsetY = (ch - SVG_H * scale) / 2;
    return {
      x: offsetX + sx * scale,
      y: offsetY + sy * scale,
      scale
    };
  }

  // ==================== DURUM YARDIMCILARI ====================
  function getPassengerInBoat() {
    return CHAR_IDS.find((id) => id !== 'farmer' && state.locations[id] === 'boat') || null;
  }

  function isFarmerInBoat() {
    return state.locations.farmer === 'boat';
  }

  function getBoatSeatPosition(charId, boatX, boatY) {
    const offset = charId === 'farmer' ? BOAT_SEAT_OFFSET.captain : BOAT_SEAT_OFFSET.passenger;
    return {
      x: boatX + offset.dx,
      y: boatY + offset.dy
    };
  }

  function getTargetPosition(charId) {
    const loc = state.locations[charId];
    if (loc === 'boat') {
      return getBoatSeatPosition(charId, boatVisual.x, boatVisual.y);
    }
    return BANK_SLOTS[loc][charId];
  }

  function checkBankHazard(side) {
    // Çiftçi bu kıyıda (veya bu kıyıda demirli sandalda) ise tehlike yok
    const farmerSafeHere = state.locations.farmer === side;
    if (farmerSafeHere) return null;

    const wolfHere = state.locations.wolf === side;
    const sheepHere = state.locations.sheep === side;
    const cabbageHere = state.locations.cabbage === side;

    if (wolfHere && sheepHere) return 'wolf-sheep';
    if (sheepHere && cabbageHere) return 'sheep-cabbage';
    return null;
  }

  // ==================== KARAKTER TIKLAMA (BİNME / İNME) ====================
  function onCharacterClick(charId) {
    if (isBusy || gameEnded) return;
    clearHighlights();

    const loc = state.locations[charId];

    // 1) Karakter zaten sandalda -> bulunduğu kıyıya indir
    if (loc === 'boat') {
      const targetBank = state.boatSide;
      state.locations[charId] = targetBank;
      sound.playHop(false);
      animateCharacterHop(charId, BANK_SLOTS[targetBank][charId], false, () => {
        showToast('✨', `${CHAR_META[charId].name} ${targetBank === 'left' ? 'sol' : 'sağ'} kıyıya indi.`, 'default');
        updateUI();
      });
      updateUI();
      return;
    }

    // 2) Karakter sandalın olmadığı karşı kıyıda -> uyarı ver
    if (loc !== state.boatSide) {
      sound.playWarn();
      pulseCharacter(charId);
      showToast('🛶', `Sandal şu an ${state.boatSide === 'left' ? 'sol' : 'sağ'} kıyıda! Önce sandalı bu kıyıya getir.`, 'warn');
      return;
    }

    // 3) Karakter sandalın olduğu kıyıda -> sandala bindir
    if (charId !== 'farmer') {
      const currentPassenger = getPassengerInBoat();
      if (currentPassenger) {
        sound.playWarn();
        triggerBoatShake();
        pulseCharacter(currentPassenger);
        showToast(
          '⚠️',
          `Sandalda Çiftçi dışında en fazla 1 yolcu olabilir! Önce ${CHAR_META[currentPassenger].name} karakterini indir.`,
          'warn'
        );
        return;
      }
    }

    state.locations[charId] = 'boat';
    sound.playHop(true);
    const seatPos = getBoatSeatPosition(charId, boatVisual.x, boatVisual.y);
    animateCharacterHop(charId, seatPos, true, () => {
      if (charId === 'farmer') {
        showToast('🚣', 'Çiftçi sandala bindi! İstersen 1 yolcu daha alıp "Karşıya Geç"e bas.', 'success');
      } else if (!isFarmerInBoat()) {
        showToast('🧑‍🌾', `${CHAR_META[charId].name} sandala bindi! Hareket etmek için Çiftçi'yi de bindir.`, 'default');
      } else {
        showToast('🚣', `Çiftçi ve ${CHAR_META[charId].name} hazır! "Karşıya Geç" butonuna basabilirsin.`, 'success');
      }
      updateUI();
    });
    updateUI();
  }

  function animateCharacterHop(charId, targetPos, toBoat, onComplete) {
    const vis = charVisuals[charId];
    isBusy = true;
    vis.hop = {
      fromX: vis.x,
      fromY: vis.y,
      toX: targetPos.x,
      toY: targetPos.y,
      startTime: performance.now(),
      duration: 420,
      toBoat,
      onComplete: () => {
        // İniş/biniş parıltı efekti
        emitLandingPuff(targetPos.x, targetPos.y, toBoat ? '#aef2ff' : '#e6ff9e');
        isBusy = false;
        if (onComplete) onComplete();
      }
    };
  }

  // ==================== KARŞIYA GEÇİŞ (SANDAL HAREKETİ) ====================
  function onCrossClick() {
    if (isBusy || gameEnded) return;
    clearHighlights();

    // Kural 1: Çiftçi olmadan sandal hareket edemez
    if (!isFarmerInBoat()) {
      sound.playWarn();
      triggerBoatShake();
      pulseCharacter('farmer');
      setRuleStatus(ruleFarmer, 'danger', '✕');
      showToast('🧑‍🌾', 'Sandalı sadece Çiftçi kullanabilir! Önce Çiftçi\'yi sandala bindir.', 'warn');
      return;
    }

    // Geri Al için geçiş öncesi anlık durumu kaydet
    historyStack.push(cloneState(state));

    const fromSide = state.boatSide;
    const toSide = fromSide === 'left' ? 'right' : 'left';
    const passenger = getPassengerInBoat();

    // Durumu güncelle
    state.boatSide = toSide;
    state.moves += 1;

    const crewText = passenger
      ? `Çiftçi + ${CHAR_META[passenger].name}`
      : 'Sadece Çiftçi';
    const dirLabel = toSide === 'right' ? 'Sağ Kıyıya ➜' : '⬅ Sol Kıyıya';

    // Geçiş animasyonunu başlat
    isBusy = true;
    sound.playRowSplash();
    scheduleTimeout(() => sound.playRowSplash(), 580);
    scheduleTimeout(() => sound.playRowSplash(), 1120);

    showToast('🌊', `${crewText} karşıya geçiyor...`, 'default');
    updateUI();

    boatVisual.crossing = {
      fromX: BOAT_DOCK[fromSide].x,
      toX: BOAT_DOCK[toSide].x,
      startTime: performance.now(),
      duration: 1520,
      dir: toSide === 'right' ? 1 : -1,
      onComplete: () => {
        boatVisual.x = BOAT_DOCK[toSide].x;
        boatVisual.oarAngle = -18;

        // Ayrılınan kıyıda kural ihlali oluştu mu?
        const hazard = checkBankHazard(fromSide);
        if (hazard) {
          state.algoLog.push({
            step: state.moves,
            text: `${crewText} (${dirLabel}) — Kural İhlali!`,
            failed: true
          });
          triggerRuleViolation(hazard, fromSide);
          return;
        }

        // Güvenli geçiş kaydı
        state.algoLog.push({
          step: state.moves,
          text: `${crewText} → ${toSide === 'right' ? 'Sağ Kıyı' : 'Sol Kıyı'}`,
          failed: false
        });

        // Kazanma kontrolü: Tüm 4 karakter sağ kıyıya ulaştı mı?
        const allOnRightOrInRightBoat =
          state.boatSide === 'right' &&
          CHAR_IDS.every((id) => state.locations[id] === 'right' || state.locations[id] === 'boat');

        if (allOnRightOrInRightBoat) {
          triggerVictorySequence();
        } else {
          isBusy = false;
          showToast('✅', `${crewText} güvenle ${toSide === 'right' ? 'sağ' : 'sol'} kıyıya ulaştı!`, 'success');
          updateUI();
        }
      }
    };
  }

  // ==================== YANLIŞ HAMLE MİKRO ANİMASYONU ====================
  function triggerRuleViolation(hazardType, unsafeSide) {
    gameEnded = true;
    isBusy = true;
    sound.playFail(hazardType);

    const sideName = unsafeSide === 'left' ? 'sol' : 'sağ';

    if (hazardType === 'wolf-sheep') {
      // Kurtun ağzı sulanır, kuzu korkuyla zıplar!
      charEls.wolf.classList.add('anim-wolf-hungry');
      charEls.sheep.classList.add('anim-sheep-scared');
      charEls.farmer.classList.add('anim-farmer-worried');

      showSpeechBubble('wolf', 'Mmmm, taze kuzu! 😋');
      showSpeechBubble('sheep', 'Meee! İmdat! 😱');
      showSpeechBubble('farmer', 'Eyvah! Kuzum!');

      setRuleStatus(ruleWolfSheep, 'danger', '✕');
      showToast('🚨', `Eyvah! Kurt ile Kuzu ${sideName} kıyıda yalnız kaldı!`, 'danger');

      failEmoji.textContent = '🐺🐑';
      failTitle.textContent = 'Eyvah! Kurt Kuzuyu Yedi!';
      failMessage.textContent = `Çiftçi karşıya geçince Kurt ve Kuzu ${sideName} kıyıda yalnız kaldı. Aç kurt bu fırsatı kaçırmadı!`;
      failLogicText.textContent = 'EĞER (Çiftçi aynı kıyıda DEĞİL) VE (Kurt ile Kuzu aynı kıyıdaysa) İSE → Kurt kuzuyu yer!';
    } else {
      // Kuzu lahanayı kıtır kıtır yer, lahana korkuyla titrer!
      charEls.sheep.classList.add('anim-sheep-munch');
      charEls.cabbage.classList.add('anim-cabbage-scared');
      charEls.farmer.classList.add('anim-farmer-worried');

      showSpeechBubble('sheep', 'Kıtır kıtır! Nefis! 😋');
      showSpeechBubble('cabbage', 'Yapraklarım! İmdat! 🥬');
      showSpeechBubble('farmer', 'Eyvah! Lahanam!');

      setRuleStatus(ruleSheepCabbage, 'danger', '✕');
      showToast('🚨', `Eyvah! Kuzu ile Lahana ${sideName} kıyıda yalnız kaldı!`, 'danger');

      failEmoji.textContent = '🐑🥬';
      failTitle.textContent = 'Eyvah! Kuzu Lahanayı Yedi!';
      failMessage.textContent = `Çiftçi karşıya geçince Kuzu ve Lahana ${sideName} kıyıda yalnız kaldı. Kuzu taze lahanayı kıtır kıtır mideye indirdi!`;
      failLogicText.textContent = 'EĞER (Çiftçi aynı kıyıda DEĞİL) VE (Kuzu ile Lahana aynı kıyıdaysa) İSE → Kuzu lahanayı yer!';
    }

    updateUI();

    // Mikro animasyonun keyifle izlenmesi için 1.9 sn bekle, sonra eğitim modalını aç
    scheduleTimeout(() => {
      isBusy = false;
      failModal.hidden = false;
    }, 1900);
  }

  // ==================== KAZANMA VE KONFETİ KUTLAMASI ====================
  function triggerVictorySequence() {
    gameEnded = true;
    isBusy = true;

    // Sandalda kalanları sırayla sağ kıyıya zıplat
    const inBoat = CHAR_IDS.filter((id) => state.locations[id] === 'boat');
    let delay = 80;

    inBoat.forEach((id, idx) => {
      scheduleTimeout(() => {
        state.locations[id] = 'right';
        sound.playHop(false);
        const vis = charVisuals[id];
        const dest = BANK_SLOTS.right[id];
        vis.hop = {
          fromX: vis.x,
          fromY: vis.y,
          toX: dest.x,
          toY: dest.y,
          startTime: performance.now(),
          duration: 380,
          toBoat: false,
          onComplete: () => {
            emitLandingPuff(dest.x, dest.y, '#ffe169');
            if (idx === inBoat.length - 1) {
              startCelebration();
            }
          }
        };
        updateUI();
      }, delay);
      delay += 200;
    });

    if (inBoat.length === 0) {
      startCelebration();
    }
  }

  function startCelebration() {
    sound.playWin();
    confettiActive = true;
    launchConfettiWave();
    scheduleTimeout(launchConfettiWave, 450);
    scheduleTimeout(launchConfettiWave, 950);

    CHAR_IDS.forEach((id) => charEls[id].classList.add('anim-celebrate'));
    showSpeechBubble('farmer', 'Başardık! 🎉');
    showSpeechBubble('wolf', 'Yaşasın! 🐺');
    showSpeechBubble('sheep', 'Meee! Harika! 🐑');
    showSpeechBubble('cabbage', 'Güvendeyim! 🥬');

    showToast('🎉', 'Tebrikler! Tüm karakterleri kurallara uyarak sağ kıyıya geçirdin!', 'success');

    // Yıldız ve seviye hesabı
    const m = state.moves;
    let stars = '⭐⭐⭐';
    let rank = 'Algoritma Ustası!';
    let msg = `Harika bir mantık yürüttün! Bulmacayı mümkün olan en kısa yol olan ${m} hamlede çözdün.`;

    if (m >= 8 && m <= 9) {
      stars = '⭐⭐';
      rank = 'Zeki Kaşif!';
      msg = `Çok iyi iş çıkardın! Bulmacayı ${m} hamlede çözdün. 7 hamlede çözmeyi de deneyebilir misin?`;
    } else if (m >= 10) {
      stars = '⭐';
      rank = 'Azimli Çözücü!';
      msg = `Tebrikler, pes etmeden ${m} hamlede başarıya ulaştın! Bir dahaki sefere 7 hamleyi hedefle.`;
    }

    winStars.textContent = stars;
    winMoveCount.textContent = String(m);
    winRank.textContent = rank;
    winMessage.textContent = msg;

    updateUI();

    scheduleTimeout(() => {
      isBusy = false;
      winModal.hidden = false;
    }, 1050);
  }

  // ==================== GERİ AL & YENİDEN BAŞLA ====================
  function onUndoClick() {
    if (isBusy || historyStack.length === 0) return;
    sound.playClick();
    undoLastMove();
  }

  function undoLastMove() {
    if (historyStack.length === 0) return;
    clearAllTimeouts();
    clearCharacterAnimStates();
    confettiActive = false;

    state = historyStack.pop();
    gameEnded = false;
    isBusy = false;
    boatVisual.crossing = null;
    CHAR_IDS.forEach((id) => { charVisuals[id].hop = null; });

    syncVisualPositionsImmediate();
    updateUI();
    showToast('↩️', 'Son hamle geri alındı. Şimdi farklı bir strateji deneyebilirsin!', 'default');
  }

  function resetGame() {
    clearAllTimeouts();
    clearCharacterAnimStates();
    confettiActive = false;
    confetti.length = 0;
    wakes.length = 0;
    splashes.length = 0;

    state = createInitialState();
    historyStack = [];
    gameEnded = false;
    isBusy = false;
    boatVisual.crossing = null;
    CHAR_IDS.forEach((id) => { charVisuals[id].hop = null; });

    failModal.hidden = true;
    winModal.hidden = true;

    syncVisualPositionsImmediate();
    updateUI();
    showToast('✨', 'Oyun yenilendi! Karakterlere tıklayarak sandala bindir ve karşıya geç.', 'default');
  }

  function syncVisualPositionsImmediate() {
    boatVisual.x = BOAT_DOCK[state.boatSide].x;
    boatVisual.y = BOAT_DOCK[state.boatSide].y;
    boatVisual.oarAngle = -18;

    CHAR_IDS.forEach((id) => {
      const pos = getTargetPosition(id);
      charVisuals[id].x = pos.x;
      charVisuals[id].y = pos.y;
      charVisuals[id].scaleX = 1;
      charVisuals[id].scaleY = 1;
    });
  }

  // ==================== AKILLI BFS İPUCU ÇÖZÜCÜ ====================
  function onHintClick() {
    if (isBusy || gameEnded) return;
    sound.playClick();
    clearHighlights();

    // Mevcut durumu kıyı bazlı mantıksal duruma çevir (sandaldakiler boatSide kıyısında sayılır)
    const bankOf = (id) => (state.locations[id] === 'boat' ? state.boatSide : state.locations[id]);
    const startNode = {
      f: state.boatSide, // Çiftçi her zaman geçiş anında boatSide tarafındadır
      w: bankOf('wolf'),
      s: bankOf('sheep'),
      c: bankOf('cabbage')
    };

    // Eğer Çiftçi karşı kıyıdaysa (teorik olarak oluşmaz ama güvenli kontrol)
    if (bankOf('farmer') !== state.boatSide) {
      showToast('💡', 'İpucu: Önce Çiftçi\'yi sandala bindirmelisin.', 'hint');
      pulseCharacter('farmer');
      return;
    }

    const nextStep = findShortestSafeMove(startNode);
    if (!nextStep) {
      showToast('💡', 'İpucu: Geri Al ile bir önceki güvenli adıma dönebilirsin.', 'hint');
      return;
    }

    const destText = nextStep.to === 'right' ? 'sağ kıyıya' : 'sol kıyıya';
    if (nextStep.passenger) {
      const pName = CHAR_META[nextStep.passenger].name;
      pulseCharacter('farmer');
      pulseCharacter(nextStep.passenger);
      showToast('💡', `İpucu: Çiftçi ve ${pName} ile birlikte ${destText} geçmeyi dene!`, 'hint');
    } else {
      pulseCharacter('farmer');
      showToast('💡', `İpucu: Çiftçi tek başına (yolcusuz) ${destText} dönebilir!`, 'hint');
    }
  }

  function findShortestSafeMove(start) {
    const key = (n) => `${n.f}|${n.w}|${n.s}|${n.c}`;
    const isSafe = (n) => {
      if (n.w === n.s && n.f !== n.w) return false;
      if (n.s === n.c && n.f !== n.s) return false;
      return true;
    };
    const isGoal = (n) => n.f === 'right' && n.w === 'right' && n.s === 'right' && n.c === 'right';

    if (isGoal(start)) return null;

    const queue = [{ node: start, firstMove: null }];
    const visited = new Set([key(start)]);

    while (queue.length > 0) {
      const { node, firstMove } = queue.shift();
      const targetSide = node.f === 'left' ? 'right' : 'left';

      // Olası yolcular: null (sadece çiftçi), veya çiftçiyle aynı kıyıdaki wolf/sheep/cabbage
      const candidates = [null];
      if (node.w === node.f) candidates.push('wolf');
      if (node.s === node.f) candidates.push('sheep');
      if (node.c === node.f) candidates.push('cabbage');

      for (const passenger of candidates) {
        const next = {
          f: targetSide,
          w: passenger === 'wolf' ? targetSide : node.w,
          s: passenger === 'sheep' ? targetSide : node.s,
          c: passenger === 'cabbage' ? targetSide : node.c
        };
        if (!isSafe(next)) continue;

        const k = key(next);
        if (visited.has(k)) continue;
        visited.add(k);

        const moveInfo = firstMove || { passenger, to: targetSide };
        if (isGoal(next)) return moveInfo;
        queue.push({ node: next, firstMove: moveInfo });
      }
    }
    return null;
  }

  // ==================== ARAYÜZ GÜNCELLEME ====================
  function updateUI() {
    elMoveCount.textContent = String(state.moves);

    const onRight = CHAR_IDS.filter((id) => state.locations[id] === 'right').length;
    elRightCount.textContent = `${onRight} / 4`;

    btnUndo.disabled = isBusy || historyStack.length === 0;

    // Sandal koltuk göstergeleri
    const farmerAboard = isFarmerInBoat();
    const passenger = getPassengerInBoat();

    if (farmerAboard) {
      elSeatFarmerVal.textContent = '🧑‍🌾 Çiftçi (Hazır)';
      elSeatFarmerVal.classList.remove('empty');
    } else {
      elSeatFarmerVal.textContent = 'Boş (Çiftçi gerekli)';
      elSeatFarmerVal.classList.add('empty');
    }

    if (passenger) {
      elSeatPassengerVal.textContent = `${CHAR_META[passenger].emoji} ${CHAR_META[passenger].name}`;
      elSeatPassengerVal.classList.remove('empty');
    } else {
      elSeatPassengerVal.textContent = 'Boş (İsteğe bağlı)';
      elSeatPassengerVal.classList.add('empty');
    }

    // Sandal üzerindeki koltuk ipucu noktaları
    if (boatSeatHints) {
      boatSeatHints.style.opacity = farmerAboard && passenger ? '0' : '0.72';
    }

    // "Karşıya Geç" butonu görünümü ve yönü
    btnCross.disabled = isBusy || gameEnded;
    btnCross.classList.toggle('dir-left', state.boatSide === 'right');
    btnCross.classList.toggle('needs-farmer', !farmerAboard && !gameEnded);
    btnCross.classList.toggle('ready-pulse', farmerAboard && !isBusy && !gameEnded);
    crossText.textContent = 'Karşıya Geç';
    btnCross.title = state.boatSide === 'left' ? 'Sandalı sağ kıyıya geçir' : 'Sandalı sol kıyıya geçir';

    // Karakter tıklanabilirlik ve gölge görünürlüğü
    CHAR_IDS.forEach((id) => {
      const node = charEls[id];
      const loc = state.locations[id];
      const clickable = !isBusy && !gameEnded && (loc === 'boat' || loc === state.boatSide);
      node.classList.toggle('disabled-char', !clickable);

      // Sandalda oturan karakterin zemin gölgesini gizle
      const shadow = node.querySelector('.char-ground-shadow');
      if (shadow) {
        shadow.style.opacity = loc === 'boat' ? '0' : '0.32';
      }
    });

    // Canlı Koşul-Sonuç (EĞER - İSE) göstergeleri
    if (!gameEnded) {
      setRuleStatus(ruleFarmer, farmerAboard ? 'ok' : 'neutral', farmerAboard ? '✓' : '!');
      setRuleStatus(ruleCapacity, 'ok', '✓');
      setRuleStatus(ruleWolfSheep, 'ok', '✓');
      setRuleStatus(ruleSheepCabbage, 'ok', '✓');
    }

    // Algoritma hamle günlüğü
    renderAlgoLog();
  }

  function setRuleStatus(el, status, symbol) {
    el.classList.remove('rule-ok', 'rule-neutral', 'rule-danger');
    el.classList.add(`rule-${status}`);
    const badge = el.querySelector('.rule-status');
    if (badge) badge.textContent = symbol;
  }

  function renderAlgoLog() {
    if (state.algoLog.length === 0) {
      algoLogList.innerHTML = '<li class="log-empty">Henüz karşıya geçiş yapılmadı. İlk hamleni planla!</li>';
      return;
    }
    algoLogList.innerHTML = state.algoLog
      .map((entry) => `
        <li class="${entry.failed ? 'log-fail' : ''}">
          <span class="log-step-num">${entry.step}</span>
          <span>${entry.text}</span>
        </li>
      `)
      .join('');
    algoLogList.scrollTop = algoLogList.scrollHeight;
  }

  function toggleAlgoDrawer() {
    sound.playClick();
    const isOpen = algoDrawer.classList.contains('open');
    setAlgoDrawer(!isOpen);
  }

  function setAlgoDrawer(open) {
    algoDrawer.classList.toggle('open', open);
    algoDrawer.setAttribute('aria-hidden', String(!open));
  }

  function showToast(icon, text, variant) {
    elToastIcon.textContent = icon;
    elToastText.textContent = text;
    elToastBanner.classList.remove('toast-warn', 'toast-danger', 'toast-success', 'toast-hint', 'toast-pop');
    if (variant && variant !== 'default') {
      elToastBanner.classList.add(`toast-${variant}`);
    }
    void elToastBanner.offsetWidth;
    elToastBanner.classList.add('toast-pop');
  }

  function showSpeechBubble(charId, text) {
    const b = bubbleEls[charId];
    if (!b) return;
    const t = b.querySelector('.bubble-text');
    if (t) t.textContent = text;
    b.classList.add('visible');
  }

  function clearCharacterAnimStates() {
    CHAR_IDS.forEach((id) => {
      charEls[id].classList.remove(
        'anim-wolf-hungry',
        'anim-sheep-scared',
        'anim-sheep-munch',
        'anim-cabbage-scared',
        'anim-farmer-worried',
        'anim-celebrate',
        'highlight-pulse'
      );
      if (bubbleEls[id]) bubbleEls[id].classList.remove('visible');
    });
  }

  function pulseCharacter(charId) {
    const node = charEls[charId];
    if (!node) return;
    node.classList.add('highlight-pulse');
    scheduleTimeout(() => node.classList.remove('highlight-pulse'), 2400);
  }

  function clearHighlights() {
    CHAR_IDS.forEach((id) => charEls[id].classList.remove('highlight-pulse'));
  }

  function triggerBoatShake() {
    [boatBackShake, boatFrontShake].forEach((el) => {
      el.classList.remove('boat-shake');
      void el.offsetWidth;
      el.classList.add('boat-shake');
    });
  }

  // ==================== CANVAS EFEKTLERİ (DALGA İZİ, SIÇRAMA, KONFETİ) ====================
  function emitBoatWake(svgX, svgY, dir) {
    // Sandalın arkasında (kıç tarafında) su dalgası izi ve köpük damlaları
    const sternX = svgX - dir * 74;
    const waterY = svgY + 30;

    wakes.push({
      sx: sternX,
      sy: waterY + (Math.random() - 0.5) * 8,
      dir,
      age: 0,
      maxAge: 950,
      radius: 10
    });

    for (let i = 0; i < 2; i++) {
      splashes.push({
        sx: sternX + (Math.random() - 0.5) * 18,
        sy: waterY + (Math.random() - 0.5) * 6,
        vx: -dir * (25 + Math.random() * 40),
        vy: -(20 + Math.random() * 42),
        size: 2.5 + Math.random() * 3.5,
        color: Math.random() > 0.4 ? '#e6fbff' : '#8cecff',
        age: 0,
        maxAge: 520 + Math.random() * 240
      });
    }
  }

  function emitLandingPuff(svgX, svgY, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const speed = 35 + Math.random() * 55;
      splashes.push({
        sx: svgX,
        sy: svgY + 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.65 - 24,
        size: 3 + Math.random() * 3.5,
        color,
        age: 0,
        maxAge: 460 + Math.random() * 220
      });
    }
  }

  function emitRiverSparkle() {
    // Nehir üzerinde rastgele parıldayan güneş ışığı noktaları
    const t = Math.random(); // 0: uzak, 1: yakın
    const sy = 310 + t * 330;
    const halfWidth = 62 + t * 205;
    const sx = 640 + (Math.random() * 2 - 1) * halfWidth * 0.78;
    sparkles.push({
      sx,
      sy,
      size: 2 + t * 3.5,
      age: 0,
      maxAge: 900 + Math.random() * 700
    });
  }

  function launchConfettiWave() {
    const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#a855f7', '#ff924c', '#2ec4b6'];
    const origins = [
      { sx: 260, sy: 620, vxBase: 140 },
      { sx: 640, sy: 640, vxBase: 0 },
      { sx: 1020, sy: 620, vxBase: -140 }
    ];

    origins.forEach((o) => {
      for (let i = 0; i < 36; i++) {
        confetti.push({
          sx: o.sx + (Math.random() - 0.5) * 50,
          sy: o.sy,
          vx: o.vxBase + (Math.random() - 0.5) * 380,
          vy: -(420 + Math.random() * 340),
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 10,
          w: 7 + Math.random() * 7,
          h: 5 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: Math.random() > 0.3 ? 'rect' : 'circle',
          age: 0,
          maxAge: 3400 + Math.random() * 1400
        });
      }
    });
  }

  // ==================== EASING FONKSİYONLARI ====================
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ==================== ANA ANİMASYON DÖNGÜSÜ (60 FPS) ====================
  let lastFrameTime = performance.now();

  function tick(now) {
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;
    const tSec = now / 1000;

    // 1. Sandal hareketi & su üzerinde sallanma fiziği
    if (boatVisual.crossing) {
      const c = boatVisual.crossing;
      const p = Math.min((now - c.startTime) / c.duration, 1);
      const eased = easeInOutCubic(p);

      boatVisual.x = c.fromX + (c.toX - c.fromX) * eased;
      boatVisual.bobY = Math.sin(p * Math.PI * 5) * 4.5;
      // Geçiş sırasında hafifçe öne-arkaya yalpalama
      boatVisual.tilt = Math.sin(p * Math.PI * 3.5) * 3.8 + c.dir * Math.sin(p * Math.PI) * 2.2;
      // Kürek çekme hareketi
      boatVisual.oarAngle = -18 + Math.sin(p * Math.PI * 6) * 32 * c.dir;

      // Su dalgası izi oluştur
      if (now - lastWakeEmit > 34 && p > 0.04 && p < 0.96) {
        lastWakeEmit = now;
        emitBoatWake(boatVisual.x, boatVisual.y + boatVisual.bobY, c.dir);
      }

      if (p >= 1) {
        const done = c.onComplete;
        boatVisual.crossing = null;
        if (done) done();
      }
    } else {
      // İskeledeyken hafif dalga salınımı
      boatVisual.bobY = Math.sin(tSec * 2.3) * 3.2;
      boatVisual.tilt = Math.sin(tSec * 1.65) * 1.15;
      boatVisual.oarAngle = -18 + Math.sin(tSec * 2.3) * 2.5;
    }

    const boatTransform = `translate(${boatVisual.x.toFixed(2)}, ${(boatVisual.y + boatVisual.bobY).toFixed(2)}) rotate(${boatVisual.tilt.toFixed(2)})`;
    boatBackGroup.setAttribute('transform', boatTransform);
    boatFrontGroup.setAttribute('transform', boatTransform);
    boatOar.setAttribute('transform', `translate(-14, 7) rotate(${boatVisual.oarAngle.toFixed(2)})`);

    // 2. Karakter konumları (Zıplama / Süzülme Easing & Sandal takibi)
    CHAR_IDS.forEach((id) => {
      const vis = charVisuals[id];
      if (vis.hop) {
        const h = vis.hop;
        const p = Math.min((now - h.startTime) / h.duration, 1);
        const eased = easeOutCubic(p);

        // Eğer sandala zıplıyorsa canlı sandal pozisyonunu hedefle
        const destX = h.toBoat ? getBoatSeatPosition(id, boatVisual.x, boatVisual.y + boatVisual.bobY).x : h.toX;
        const destY = h.toBoat ? getBoatSeatPosition(id, boatVisual.x, boatVisual.y + boatVisual.bobY).y : h.toY;

        const arcHeight = Math.sin(p * Math.PI) * 82;
        vis.x = h.fromX + (destX - h.fromX) * eased;
        vis.y = h.fromY + (destY - h.fromY) * eased - arcHeight;

        // Zıplama sırasında sevimli esneme (squash & stretch)
        if (p < 0.18) {
          const s = p / 0.18;
          vis.scaleX = 1 - 0.1 * s;
          vis.scaleY = 1 + 0.14 * s;
        } else if (p > 0.84) {
          const s = (p - 0.84) / 0.16;
          const squash = Math.sin(s * Math.PI);
          vis.scaleX = 1 + 0.14 * squash;
          vis.scaleY = 1 - 0.12 * squash;
        } else {
          vis.scaleX = 1;
          vis.scaleY = 1;
        }

        if (p >= 1) {
          vis.x = destX;
          vis.y = destY;
          vis.scaleX = 1;
          vis.scaleY = 1;
          const done = h.onComplete;
          vis.hop = null;
          if (done) done();
        }
      } else if (state.locations[id] === 'boat') {
        // Sandalda oturan karakter sandalın hareketini ve hafif sallanmasını takip eder
        const seat = getBoatSeatPosition(id, boatVisual.x, boatVisual.y + boatVisual.bobY);
        vis.x = seat.x;
        vis.y = seat.y;
        vis.scaleX = 1;
        vis.scaleY = 1;
      }

      const tilt = state.locations[id] === 'boat' && !vis.hop ? boatVisual.tilt * 0.7 : 0;
      charEls[id].setAttribute(
        'transform',
        `translate(${vis.x.toFixed(2)}, ${vis.y.toFixed(2)}) rotate(${tilt.toFixed(2)}) scale(${vis.scaleX.toFixed(3)}, ${vis.scaleY.toFixed(3)})`
      );
    });

    // 3. Nehir su parıltıları
    if (now - lastSparkleEmit > 160) {
      lastSparkleEmit = now;
      emitRiverSparkle();
    }

    // 4. Canvas efektlerini çiz
    renderCanvasEffects(dt);

    requestAnimationFrame(tick);
  }

  function renderCanvasEffects(dt) {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // A) Nehir yüzey parıltıları
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sp = sparkles[i];
      sp.age += dt * 1000;
      sp.sy += dt * 18; // Akıntıyla aşağı süzülür
      if (sp.age >= sp.maxAge) {
        sparkles.splice(i, 1);
        continue;
      }
      const p = sp.age / sp.maxAge;
      const alpha = Math.sin(p * Math.PI) * 0.75;
      const pt = svgToCanvas(sp.sx, sp.sy);
      const r = sp.size * pt.scale;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y - r * 1.6);
      ctx.quadraticCurveTo(pt.x, pt.y, pt.x + r * 1.6, pt.y);
      ctx.quadraticCurveTo(pt.x, pt.y, pt.x, pt.y + r * 1.6);
      ctx.quadraticCurveTo(pt.x, pt.y, pt.x - r * 1.6, pt.y);
      ctx.quadraticCurveTo(pt.x, pt.y, pt.x, pt.y - r * 1.6);
      ctx.fill();
      ctx.restore();
    }

    // B) Sandal su dalgası izleri (V-şeklinde genişleyen halkalar)
    for (let i = wakes.length - 1; i >= 0; i--) {
      const w = wakes[i];
      w.age += dt * 1000;
      if (w.age >= w.maxAge) {
        wakes.splice(i, 1);
        continue;
      }
      const p = w.age / w.maxAge;
      const alpha = (1 - p) * 0.72;
      const pt = svgToCanvas(w.sx - w.dir * p * 24, w.sy + p * 8);
      const rx = (16 + p * 46) * pt.scale;
      const ry = (5 + p * 16) * pt.scale;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = p < 0.4 ? '#ffffff' : '#b2f4ff';
      ctx.lineWidth = Math.max(1.2, (3.2 - p * 2) * pt.scale);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y, rx, ry, 0, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(pt.x, pt.y - 2 * pt.scale, rx * 0.72, ry * 0.65, 0, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.restore();
    }

    // C) Su sıçramaları ve iniş/biniş parıltıları
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.age += dt * 1000;
      if (s.age >= s.maxAge) {
        splashes.splice(i, 1);
        continue;
      }
      s.sx += s.vx * dt;
      s.sy += s.vy * dt;
      s.vy += 170 * dt; // Yerçekimi

      const p = s.age / s.maxAge;
      const pt = svgToCanvas(s.sx, s.sy);
      ctx.save();
      ctx.globalAlpha = (1 - p) * 0.9;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(1, s.size * (1 - p * 0.4) * pt.scale), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // D) Kazanma konfetileri
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.age += dt * 1000;
      if (c.age >= c.maxAge) {
        confetti.splice(i, 1);
        continue;
      }
      c.sx += c.vx * dt;
      c.sy += c.vy * dt;
      c.vy += 380 * dt; // Yerçekimi
      c.vx *= 0.992;    // Hava sürtünmesi
      c.rot += c.vrot * dt;

      const p = c.age / c.maxAge;
      const alpha = p > 0.78 ? (1 - p) / 0.22 : 1;
      const pt = svgToCanvas(c.sx, c.sy);

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(pt.x, pt.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      const w = c.w * pt.scale;
      const h = c.h * pt.scale;
      if (c.shape === 'rect') {
        ctx.fillRect(-w / 2, -h / 2, w, h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, w * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
