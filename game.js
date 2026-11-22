/* =========================================================
   game.js — Kurt, Kuzu ve Lahana (Nehir Geçişi)
   3 Aşamalı 9. Sınıf Algoritma & Optimizasyon Oyun Motoru
   ========================================================= */
(function () {
  'use strict';

  const SVG_W = 1280;
  const SVG_H = 680;

  // Sandal iskele konumları
  const BOAT_DOCK = {
    left:  { x: 492, y: 514 },
    right: { x: 788, y: 514 }
  };

  // ==================== 3 SEVİYE TANIMLARI ====================
  const LEVELS = {
    1: {
      id: 1,
      shortTitle: '1. Seviye',
      name: '1. Seviye: Temel Koşul Yapısı (EĞER - İSE)',
      topic: 'Temel Koşul Yapısı (EĞER - İSE)',
      badge: '📖',
      capacityMode: 'count',
      maxPassengers: 1,
      maxWeight: null,
      chars: ['farmer', 'wolf', 'sheep', 'cabbage'],
      meta: {
        farmer:  { name: 'Çiftçi', emoji: '🧑‍🌾', type: 'farmer',  weight: 0 },
        wolf:    { name: 'Kurt',   emoji: '🐺',  type: 'wolf',    weight: 0 },
        sheep:   { name: 'Kuzu',   emoji: '🐑',  type: 'sheep',   weight: 0 },
        cabbage: { name: 'Lahana', emoji: '🥬',  type: 'cabbage', weight: 0 }
      },
      slots: {
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
      },
      rulesSummary: 'Sol kıyıdaki <strong>Çiftçi, Kurt, Kuzu ve Lahanayı</strong> temel <code>EĞER - İSE</code> koşullarını ihlal etmeden sağ kıyıya geçir!',
      rulesList: [
        { ico: '🧑‍🌾', title: 'Kaptan Şartı:', text: 'Çiftçi sandalda olmadan sandal hareket edemez.' },
        { ico: '🛶', title: 'Kapasite (En Fazla 1 Yolcu):', text: 'Sandala Çiftçi\'nin yanında en fazla 1 yolcu binebilir.' },
        { ico: '🐺🐑', title: 'VE Koşulu 1:', text: 'Çiftçi aynı kıyıda değilken Kurt ile Kuzu yalnız kalamaz.' },
        { ico: '🐑🥬', title: 'VE Koşulu 2:', text: 'Çiftçi aynı kıyıda değilken Kuzu ile Lahana yalnız kalamaz.' }
      ],
      ruleCards: [
        { id: 'rFarmer', cond: 'EĞER', expr: 'Çiftçi sandalda değilse', res: 'sandal hareket edemez.' },
        { id: 'rCap',    cond: 'EĞER', expr: 'yolcuSayısı <= 1 ise', res: 'sandal dengede kalır.' },
        { id: 'rWolf',   cond: 'EĞER', expr: '(Çiftçi != Kıyı) VE (Kurt == Kuzu)', res: 'Kurt kuzuyu yer!' },
        { id: 'rCab',    cond: 'EĞER', expr: '(Çiftçi != Kıyı) VE (Kuzu == Lahana)', res: 'Kuzu lahanayı yer!' }
      ],
      defaultFormula: 'EĞER (Çiftçi != Kıyı) VE ((Kurt == Kuzu) VEYA (Kuzu == Lahana)) İSE → Hata'
    },

    2: {
      id: 2,
      shortTitle: '2. Seviye',
      name: '2. Seviye: Çoklu Değişken ve Karşılaştırma (>)',
      topic: 'Çoklu Değişken ve Karşılaştırma (BÜYÜKTÜR >)',
      badge: '⚖️',
      capacityMode: 'count',
      maxPassengers: 2,
      maxWeight: null,
      chars: ['farmer', 'wolf1', 'wolf2', 'sheep1', 'sheep2'],
      meta: {
        farmer: { name: 'Çiftçi', emoji: '🧑‍🌾', type: 'farmer', weight: 0 },
        wolf1:  { name: 'Kurt 1', emoji: '🐺',  type: 'wolf',   weight: 0 },
        wolf2:  { name: 'Kurt 2', emoji: '🐺',  type: 'wolf',   weight: 0 },
        sheep1: { name: 'Kuzu 1', emoji: '🐑',  type: 'sheep',  weight: 0 },
        sheep2: { name: 'Kuzu 2', emoji: '🐑',  type: 'sheep',  weight: 0 }
      },
      slots: {
        left: {
          wolf1:  { x: 92,  y: 446 },
          wolf2:  { x: 184, y: 454 },
          sheep1: { x: 108, y: 544 },
          sheep2: { x: 212, y: 546 },
          farmer: { x: 312, y: 472 }
        },
        right: {
          farmer: { x: 968,  y: 472 },
          wolf1:  { x: 1094, y: 454 },
          wolf2:  { x: 1188, y: 446 },
          sheep1: { x: 1068, y: 546 },
          sheep2: { x: 1172, y: 544 }
        }
      },
      rulesSummary: '<strong>Çiftçi, 2 Kurt ve 2 Kuzuyu</strong> değişken sayılarını takip ederek sağ kıyıya geçir. Bu seviyede sandal daha geniş!',
      rulesList: [
        { ico: '🛶', title: 'Geniş Kapasite:', text: 'Sandala Çiftçi + en fazla <strong>2 yolcu</strong> (toplam 3 kişi) binebilir.' },
        { ico: '📊', title: 'Karşılaştırma Operatörü (>):', text: 'Çiftçi o kıyıda değilken herhangi bir kıyıda <strong>Kurt Sayısı > Kuzu Sayısı</strong> olursa (ve kuzu varsa) kurtlar kuzuları yer!' },
        { ico: '⚖️', title: 'Eşitlik Güvenlidir (==):', text: 'Eşit sayıda kurt ve kuzu (örneğin 1 Kurt ve 1 Kuzu) Çiftçi olmadan yan yana kalabilir.' },
        { ico: '🎯', title: 'Algoritma Optimizasyonu:', text: 'En az adım sayısını hedefleyerek 3 yıldız kazan!' }
      ],
      ruleCards: [
        { id: 'rFarmer', cond: 'EĞER', expr: 'Çiftçi sandalda değilse', res: 'sandal hareket edemez.' },
        { id: 'rCap',    cond: 'EĞER', expr: 'yolcuSayısı <= 2 ise', res: 'sandal (maks. 3 kişi) hareket edebilir.' },
        { id: 'rCount',  cond: 'EĞER', expr: '(Çiftçi != Kıyı) VE (Kuzu > 0) VE (Kurt > Kuzu)', res: 'Kurtlar kuzuları yer!' }
      ],
      defaultFormula: 'EĞER (Çiftçi != Kıyı) VE (KuzuSayısı > 0) VE (KurtSayısı > KuzuSayısı) İSE → Hata'
    },

    3: {
      id: 3,
      shortTitle: '3. Seviye',
      name: '3. Seviye: Aritmetik Kısıt ve Optimizasyon (≤)',
      topic: 'Aritmetik Kısıt ve Optimizasyon (TOPLAM ≤ LİMİT)',
      badge: '🧮',
      capacityMode: 'weight',
      maxPassengers: 4,
      maxWeight: 100,
      chars: ['farmer', 'wolf', 'sheep', 'cabbage', 'feed'],
      meta: {
        farmer:  { name: 'Çiftçi',     emoji: '🧑‍🌾', type: 'farmer',  weight: 60 },
        wolf:    { name: 'Kurt',       emoji: '🐺',  type: 'wolf',    weight: 30 },
        sheep:   { name: 'Kuzu',       emoji: '🐑',  type: 'sheep',   weight: 20 },
        cabbage: { name: 'Lahana',     emoji: '🥬',  type: 'cabbage', weight: 10 },
        feed:    { name: 'Yem Çuvalı', emoji: '🌾',  type: 'feed',    weight: 40 }
      },
      slots: {
        left: {
          wolf:    { x: 96,  y: 444 },
          sheep:   { x: 204, y: 468 },
          feed:    { x: 102, y: 546 },
          cabbage: { x: 212, y: 554 },
          farmer:  { x: 314, y: 470 }
        },
        right: {
          farmer:  { x: 966,  y: 470 },
          sheep:   { x: 1076, y: 468 },
          wolf:    { x: 1184, y: 444 },
          cabbage: { x: 1068, y: 554 },
          feed:    { x: 1178, y: 546 }
        }
      },
      rulesSummary: 'Ağırlıkları topla ve <strong>100 kg</strong> limitini aşmadan tüm karakterleri (Yem Çuvalı dahil) en kısa algoritmayla karşıya geçir!',
      rulesList: [
        { ico: '⚖️', title: 'Aritmetik Kısıt (TOPLAM ≤ 100 kg):', text: 'Kişi sayısı sınırı yok! Ancak Çiftçi (60 kg) ile birlikte toplam ağırlık <strong>100 kg</strong>\'ı geçerse sandal hareket etmez.' },
        { ico: '➕', title: 'Kombinasyon Stratejisi:', text: 'Çiftçi\'nin yanına en fazla 40 kg alabilirsin: sadece <strong>Yem Çuvalı (40 kg)</strong> VEYA <strong>Kurt (30) + Lahana (10)</strong>!' },
        { ico: '🐺🐑🥬', title: 'Besin Zinciri Kuralları:', text: '1. Seviye kuralları geçerlidir (Kurt-Kuzu ve Kuzu-Lahana yalnız kalamaz). <strong>Yem Çuvalı</strong> herkesle güvendedir.' },
        { ico: '🏆', title: 'Verimlilik Hedefi:', text: 'Aynı seferde birden fazla yük taşıyarak adım sayını optimize et!' }
      ],
      ruleCards: [
        { id: 'rFarmer', cond: 'EĞER', expr: 'Çiftçi (60 kg) sandalda değilse', res: 'sandal hareket edemez.' },
        { id: 'rWeight', cond: 'EĞER', expr: 'ToplamAğırlık <= 100 kg ise', res: 'sandal güvenle yüzebilir.' },
        { id: 'rWolf',   cond: 'EĞER', expr: '(Çiftçi != Kıyı) VE (Kurt == Kuzu)', res: 'Kurt kuzuyu yer!' },
        { id: 'rCab',    cond: 'EĞER', expr: '(Çiftçi != Kıyı) VE (Kuzu == Lahana)', res: 'Kuzu lahanayı yer!' }
      ],
      defaultFormula: 'EĞER (ToplamAğırlık <= 100) VE (BesinZinciriGüvenli) İSE → Geçiş İzni'
    }
  };

  // ==================== OYUN DURUMU ====================
  const sound = new window.SoundManager();

  let currentLevelId = 1;
  let state = createInitialState(1);
  let historyStack = [];
  let completedLevels = {}; // { [levelId]: { bestMoves, stars } }
  let isBusy = false;
  let gameEnded = false;
  let activeTimeouts = [];
  let lastConditionOverride = null; // { status: 'danger'|'warn', stateLabel, expr }

  // Her seviye için BFS ile matematiksel en kısa adım sayısını ve yolunu hesapla
  const idealStepsByLevel = {};
  const idealPathByLevel = {};
  const STORAGE_KEY = 'kurt_kuzu_progress_v1';

  // Görsel / animasyon konumları
  const boatVisual = {
    x: BOAT_DOCK.left.x,
    y: BOAT_DOCK.left.y,
    bobY: 0,
    sinkY: 0,
    tilt: 0,
    oarAngle: -18,
    crossing: null
  };

  let charVisuals = {};

  // Canvas parçacıkları
  const wakes = [];
  const splashes = [];
  const sparkles = [];
  const confetti = [];
  let confettiActive = false;
  let lastWakeEmit = 0;
  let lastSparkleEmit = 0;

  // DOM referansları
  let svgEl, canvasEl, ctx, charactersLayerEl;
  let boatBackGroup, boatFrontGroup, boatBackShake, boatFrontShake, boatOar;
  let boatSeatHints, seatHintCaptain, seatHintP1, seatHintP2;
  let boatWeightBar, boatWeightText, boatWeightFillRect;
  let charEls = {};
  let bubbleEls = {};

  let elBrandSubtitle, elMoveCount, elIdealHint, elRightCount;
  let elLevelObjectiveText, elLeftBankSummary, elRightBankSummary;
  let elToastBanner, elToastIcon, elToastText;
  let elSeatFarmerVal, elSeatPassengerRole, elSeatPassengerVal, elDockWeightBarWrap, elDockWeightFill;
  let btnCross, crossText, btnUndo, btnHint, btnAlgo, btnRules, btnRestart, btnSound, soundIcon;
  let algoDrawer, btnCloseAlgo, algoLogList, elRuleCheckList;
  let drawerOptimalSection, drawerOptimalCount, drawerOptimalList;
  let elLiveCondBox, elLiveCondState, elLiveCondExpr, elLiveCondVars;
  let failModal, failEmoji, failTitle, failMessage, failLogicText, btnFailUndo, btnFailRestart;
  let winModal, winStars, winTitle, winMessage, winTotalProgress, winMoveCount, winIdealCount, winRank;
  let btnToggleOptimal, optimalToggleLabel, optimalStepsWrap, winOptimalSteps;
  let btnNextLevel, btnWinReplay, btnWinShowAlgo;
  let rulesModal, rulesBadge, rulesTitle, rulesSummary, rulesGrid, rulesTip, btnStartPlay, btnCloseRulesTop;

  function loadProgress() {
    try {
      const raw = window.localStorage && window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          completedLevels = parsed;
        }
      }
    } catch (_) {
      // Depolama erişimi kısıtlıysa sessizce devam et
    }
  }

  function saveProgress() {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLevels));
      }
    } catch (_) {
      // Sessizce geç
    }
  }

  function getLevel() {
    return LEVELS[currentLevelId];
  }

  function createInitialState(levelId) {
    const lvl = LEVELS[levelId];
    const locations = {};
    lvl.chars.forEach((id) => { locations[id] = 'left'; });
    return {
      levelId,
      boatSide: 'left',
      locations,
      moves: 0,
      algoLog: []
    };
  }

  function cloneState(s) {
    return {
      levelId: s.levelId,
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
    loadProgress();

    // 3 seviyenin gerçek en kısa adım sayısını ve çözüm yolunu BFS ile doğrula
    [1, 2, 3].forEach((lvlId) => {
      const startBanks = {};
      LEVELS[lvlId].chars.forEach((c) => { startBanks[c] = 'left'; });
      const res = solveLevelBFS(lvlId, 'left', startBanks);
      idealStepsByLevel[lvlId] = res ? res.steps : 7;
      idealPathByLevel[lvlId] = res ? res.path : [];
    });

    svgEl = document.getElementById('gameSvg');
    canvasEl = document.getElementById('effectsCanvas');
    ctx = canvasEl.getContext('2d');

    svgEl.innerHTML = window.SceneArt.buildSceneSVG();

    // Sabit SVG düğümleri
    charactersLayerEl = document.getElementById('charactersLayer');
    boatBackGroup = document.getElementById('boatBackGroup');
    boatFrontGroup = document.getElementById('boatFrontGroup');
    boatBackShake = document.getElementById('boatBackShake');
    boatFrontShake = document.getElementById('boatFrontShake');
    boatOar = document.getElementById('boatOar');
    boatSeatHints = document.getElementById('boatSeatHints');
    seatHintCaptain = document.getElementById('seatHintCaptain');
    seatHintP1 = document.getElementById('seatHintP1');
    seatHintP2 = document.getElementById('seatHintP2');
    boatWeightBar = document.getElementById('boatWeightBar');
    boatWeightText = document.getElementById('boatWeightText');
    boatWeightFillRect = document.getElementById('boatWeightFillRect');

    // HUD & Panel düğümleri
    elBrandSubtitle = document.getElementById('brandSubtitle');
    elMoveCount = document.getElementById('moveCount');
    elIdealHint = document.getElementById('idealHint');
    elRightCount = document.getElementById('rightCount');
    elLevelObjectiveText = document.getElementById('levelObjectiveText');
    elLeftBankSummary = document.getElementById('leftBankSummary');
    elRightBankSummary = document.getElementById('rightBankSummary');

    elToastBanner = document.getElementById('toastBanner');
    elToastIcon = document.getElementById('toastIcon');
    elToastText = document.getElementById('toastText');
    elSeatFarmerVal = document.getElementById('seatFarmerVal');
    elSeatPassengerRole = document.getElementById('seatPassengerRole');
    elSeatPassengerVal = document.getElementById('seatPassengerVal');
    elDockWeightBarWrap = document.getElementById('dockWeightBarWrap');
    elDockWeightFill = document.getElementById('dockWeightFill');

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
    elRuleCheckList = document.getElementById('ruleCheckList');
    drawerOptimalSection = document.getElementById('drawerOptimalSection');
    drawerOptimalCount = document.getElementById('drawerOptimalCount');
    drawerOptimalList = document.getElementById('drawerOptimalList');
    elLiveCondBox = document.getElementById('liveConditionBox');
    elLiveCondState = document.getElementById('liveCondState');
    elLiveCondExpr = document.getElementById('liveCondExpr');
    elLiveCondVars = document.getElementById('liveCondVars');

    failModal = document.getElementById('failModal');
    failEmoji = document.getElementById('failEmoji');
    failTitle = document.getElementById('failTitle');
    failMessage = document.getElementById('failMessage');
    failLogicText = document.getElementById('failLogicText');
    btnFailUndo = document.getElementById('btnFailUndo');
    btnFailRestart = document.getElementById('btnFailRestart');

    winModal = document.getElementById('winModal');
    winStars = document.getElementById('winStars');
    winTitle = document.getElementById('winTitle');
    winMessage = document.getElementById('winMessage');
    winTotalProgress = document.getElementById('winTotalProgress');
    winMoveCount = document.getElementById('winMoveCount');
    winIdealCount = document.getElementById('winIdealCount');
    winRank = document.getElementById('winRank');
    btnToggleOptimal = document.getElementById('btnToggleOptimal');
    optimalToggleLabel = document.getElementById('optimalToggleLabel');
    optimalStepsWrap = document.getElementById('optimalStepsWrap');
    winOptimalSteps = document.getElementById('winOptimalSteps');
    btnNextLevel = document.getElementById('btnNextLevel');
    btnWinReplay = document.getElementById('btnWinReplay');
    btnWinShowAlgo = document.getElementById('btnWinShowAlgo');

    rulesModal = document.getElementById('rulesModal');
    rulesBadge = document.getElementById('rulesBadge');
    rulesTitle = document.getElementById('rulesTitle');
    rulesSummary = document.getElementById('rulesSummary');
    rulesGrid = document.getElementById('rulesGrid');
    rulesTip = document.getElementById('rulesTip');
    btnStartPlay = document.getElementById('btnStartPlay');
    btnCloseRulesTop = document.getElementById('btnCloseRulesTop');

    // Seviye sekmeleri
    document.querySelectorAll('.level-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetLvl = Number(tab.dataset.level);
        if (targetLvl && targetLvl !== currentLevelId) {
          sound.playClick();
          loadLevel(targetLvl);
        }
      });
    });

    // Temel olaylar
    btnCross.addEventListener('click', onCrossClick);
    btnUndo.addEventListener('click', onUndoClick);
    btnHint.addEventListener('click', onHintClick);
    btnAlgo.addEventListener('click', toggleAlgoDrawer);
    btnCloseAlgo.addEventListener('click', () => setAlgoDrawer(false));
    btnRules.addEventListener('click', () => {
      sound.playClick();
      renderRulesModal();
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
    rulesModal.addEventListener('click', (e) => {
      if (e.target === rulesModal) {
        sound.playClick();
        rulesModal.hidden = true;
      }
    });
    btnToggleOptimal.addEventListener('click', () => {
      sound.playClick();
      const expanded = btnToggleOptimal.getAttribute('aria-expanded') === 'true';
      btnToggleOptimal.setAttribute('aria-expanded', String(!expanded));
      optimalStepsWrap.hidden = expanded;
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

    btnNextLevel.addEventListener('click', () => {
      sound.playClick();
      winModal.hidden = true;
      if (currentLevelId < 3) {
        loadLevel(currentLevelId + 1);
      }
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

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Kaydedilmiş yıldız/seviye rozetlerini yansıt ve 1. Seviyeyi yükle
    updateLevelDoneBadges();
    loadLevel(1);

    // 60 FPS animasyon döngüsünü başlat
    requestAnimationFrame(tick);
  }

  // ==================== SEVİYE YÜKLEME ====================
  function loadLevel(levelId) {
    clearAllTimeouts();
    confettiActive = false;
    confetti.length = 0;
    wakes.length = 0;
    splashes.length = 0;

    currentLevelId = levelId;
    const lvl = getLevel();
    state = createInitialState(levelId);
    historyStack = [];
    gameEnded = false;
    isBusy = false;
    lastConditionOverride = null;
    boatVisual.crossing = null;
    boatVisual.sinkY = 0;

    failModal.hidden = true;
    winModal.hidden = true;
    if (drawerOptimalSection) drawerOptimalSection.hidden = true;

    // SVG karakterlerini seviyeye göre oluştur ve bağla
    charactersLayerEl.innerHTML = window.SceneArt.buildCharactersForLevel(levelId);
    charEls = {};
    bubbleEls = {};
    charVisuals = {};

    lvl.chars.forEach((id) => {
      const node = document.getElementById(`char-${id}`);
      charEls[id] = node;
      bubbleEls[id] = document.getElementById(`bubble-${id}`);
      const slot = lvl.slots.left[id];
      charVisuals[id] = { x: slot.x, y: slot.y, scaleX: 1, scaleY: 1, hop: null };

      node.addEventListener('click', () => onCharacterClick(id));
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCharacterClick(id);
        }
      });
    });

    // Seviye sekmelerini güncelle
    document.querySelectorAll('.level-tab').forEach((tab) => {
      const isAct = Number(tab.dataset.level) === levelId;
      tab.classList.toggle('active', isAct);
      tab.setAttribute('aria-selected', String(isAct));
    });

    // Sandal koltuk ipuçları & ağırlık barı görünürlüğü
    configureBoatVisualForLevel(lvl);

    // Seviye başlıkları ve kurallar panelini çiz
    const ideal = idealStepsByLevel[levelId];
    elBrandSubtitle.textContent = `${lvl.shortTitle} • ${lvl.topic}`;
    elIdealHint.textContent = `/ ${ideal} ideal`;

    if (levelId === 1) {
      elLevelObjectiveText.textContent = `Kapasite: Çiftçi + 1 Yolcu • İdeal Algoritma: ${ideal} Adım`;
    } else if (levelId === 2) {
      elLevelObjectiveText.textContent = `Kapasite: Çiftçi + 2 Yolcu • Kural: Kurt ≤ Kuzu • İdeal: ${ideal} Adım`;
    } else {
      elLevelObjectiveText.textContent = `Kapasite Limiti: 100 kg • Besin Zinciri Aktif • İdeal: ${ideal} Adım`;
    }

    renderRuleCards(lvl);
    renderRulesModal();
    syncVisualPositionsImmediate();
    updateUI();

    const welcomeMsg = levelId === 1
      ? '1. Seviye: Karakterlere tıklayarak sandala bindir, sonra "Karşıya Geç" butonuna bas!'
      : levelId === 2
        ? '2. Seviye: Sandala Çiftçi + en fazla 2 yolcu binebilir. Çiftçi yokken Kurt > Kuzu olmamalı!'
        : '3. Seviye: Toplam ağırlık 100 kg\'ı geçmemeli! En az adımla çözmek için ağırlıkları kombine et.';
    showToast('✨', welcomeMsg, 'default');
  }

  function configureBoatVisualForLevel(lvl) {
    if (lvl.capacityMode === 'weight') {
      boatWeightBar.style.display = '';
      boatSeatHints.style.display = 'none';
    } else {
      boatWeightBar.style.display = 'none';
      boatSeatHints.style.display = '';
      if (lvl.maxPassengers === 2) {
        seatHintCaptain.setAttribute('transform', 'translate(-12, 0)');
        seatHintP1.setAttribute('transform', 'translate(-35, 0)');
        seatHintP2.style.display = '';
      } else {
        seatHintCaptain.setAttribute('transform', 'translate(0, 0)');
        seatHintP1.setAttribute('transform', 'translate(0, 0)');
        seatHintP2.style.display = 'none';
      }
    }
  }

  function renderRuleCards(lvl) {
    elRuleCheckList.innerHTML = lvl.ruleCards
      .map((rc) => `
        <li id="${rc.id}" class="rule-item rule-ok">
          <span class="rule-status">✓</span>
          <div>
            <strong>${rc.cond}</strong> ${rc.expr}<br />
            <span><strong>İSE</strong> ${rc.res}</span>
          </div>
        </li>
      `)
      .join('');
  }

  function renderRulesModal() {
    const lvl = getLevel();
    const ideal = idealStepsByLevel[lvl.id];
    rulesBadge.textContent = lvl.badge;
    rulesTitle.textContent = lvl.name;
    rulesSummary.innerHTML = lvl.rulesSummary;
    rulesGrid.innerHTML = lvl.rulesList
      .map((r) => `
        <li>
          <span class="r-ico">${r.ico}</span>
          <div><strong>${r.title}</strong> ${r.text}</div>
        </li>
      `)
      .join('');
    rulesTip.innerHTML = `💡 <strong>Optimizasyon Hedefi:</strong> Bu seviye matematiksel olarak en az <strong>${ideal} adımda</strong> çözülebilir. Karakterlere tıklayarak sandala bindirip indir, ardından <strong>"Karşıya Geç"</strong> butonuna bas!`;
  }

  // ==================== KOORDİNAT DÖNÜŞÜMÜ ====================
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
    const scale = Math.min(cw / SVG_W, ch / SVG_H);
    const offsetX = (cw - SVG_W * scale) / 2;
    const offsetY = (ch - SVG_H * scale) / 2;
    return {
      x: offsetX + sx * scale,
      y: offsetY + sy * scale,
      scale
    };
  }

  // ==================== DURUM & AĞIRLIK YARDIMCILARI ====================
  function getPassengersInBoat() {
    return getLevel().chars.filter((id) => id !== 'farmer' && state.locations[id] === 'boat');
  }

  function isFarmerInBoat() {
    return state.locations.farmer === 'boat';
  }

  function getBoatTotalWeight() {
    const lvl = getLevel();
    return lvl.chars.reduce((sum, id) => (
      state.locations[id] === 'boat' ? sum + (lvl.meta[id].weight || 0) : sum
    ), 0);
  }

  function getBoatSeatPosition(charId, boatX, boatY) {
    const lvl = getLevel();
    const passengers = getPassengersInBoat();

    if (charId === 'farmer') {
      const dx = lvl.id === 1 ? -36 : (passengers.length >= 2 ? -50 : -40);
      return { x: boatX + dx, y: boatY + 2 };
    }

    const idx = passengers.indexOf(charId);
    const count = Math.max(1, passengers.length);

    if (count === 1) {
      return { x: boatX + 36, y: boatY - 2 };
    }
    if (count === 2) {
      const slots = [4, 52];
      return { x: boatX + slots[Math.max(0, idx)], y: boatY - 2 };
    }
    // 3 veya 4 yolcu (Seviye 3'te aşırı yük denemesi dahil)
    const minX = -8;
    const maxX = 58;
    const step = (maxX - minX) / (count - 1);
    const dx = minX + Math.max(0, idx) * step;
    return { x: boatX + dx, y: boatY - 3 };
  }

  function getTargetPosition(charId) {
    const loc = state.locations[charId];
    if (loc === 'boat') {
      return getBoatSeatPosition(charId, boatVisual.x, boatVisual.y);
    }
    return getLevel().slots[loc][charId];
  }

  function countTypeOnSide(side, type) {
    const lvl = getLevel();
    return lvl.chars.filter((id) => state.locations[id] === side && lvl.meta[id].type === type).length;
  }

  function evaluateBankHazard(levelId, banksMap, side) {
    const lvl = LEVELS[levelId];
    if (banksMap.farmer === side) return null;

    if (levelId === 2) {
      const wolves = lvl.chars.filter((id) => banksMap[id] === side && lvl.meta[id].type === 'wolf');
      const sheep  = lvl.chars.filter((id) => banksMap[id] === side && lvl.meta[id].type === 'sheep');
      if (sheep.length > 0 && wolves.length > sheep.length) {
        return {
          type: 'wolf-outnumber',
          side,
          wolvesCount: wolves.length,
          sheepCount: sheep.length,
          wolfIds: wolves,
          sheepIds: sheep
        };
      }
      return null;
    }

    // Seviye 1 ve Seviye 3 besin zinciri kuralları
    const wolfHere = banksMap.wolf === side;
    const sheepHere = banksMap.sheep === side;
    const cabbageHere = banksMap.cabbage === side;

    if (wolfHere && sheepHere) {
      return { type: 'wolf-sheep', side, wolfIds: ['wolf'], sheepIds: ['sheep'] };
    }
    if (sheepHere && cabbageHere) {
      return { type: 'sheep-cabbage', side, sheepIds: ['sheep'], cabbageIds: ['cabbage'] };
    }
    return null;
  }

  // ==================== KARAKTER TIKLAMA (BİNME / İNME) ====================
  function onCharacterClick(charId) {
    if (isBusy || gameEnded) return;
    clearHighlights();
    lastConditionOverride = null;

    const lvl = getLevel();
    const loc = state.locations[charId];
    const meta = lvl.meta[charId];

    // 1) Karakter sandalda -> bulunduğu kıyıya indir
    if (loc === 'boat') {
      const targetBank = state.boatSide;
      state.locations[charId] = targetBank;
      sound.playHop(false);
      animateCharacterHop(charId, lvl.slots[targetBank][charId], false, () => {
        showToast('✨', `${meta.name} ${targetBank === 'left' ? 'sol' : 'sağ'} kıyıya indi.`, 'default');
        updateUI();
      });
      updateUI();
      return;
    }

    // 2) Karakter karşı kıyıda -> uyarı
    if (loc !== state.boatSide) {
      sound.playWarn();
      pulseCharacter(charId);
      showToast('🛶', `Sandal şu an ${state.boatSide === 'left' ? 'sol' : 'sağ'} kıyıda! Önce sandalı bu kıyıya getir.`, 'warn');
      return;
    }

    // 3) Kapasite kontrolü (Seviye 1 & 2: yolcu sayısı sınırı; Seviye 3: binmesine izin ver, ağırlık barı uyarsın)
    if (lvl.capacityMode === 'count' && charId !== 'farmer') {
      const passengers = getPassengersInBoat();
      if (passengers.length >= lvl.maxPassengers) {
        sound.playWarn();
        triggerBoatShake();
        passengers.forEach((pId) => pulseCharacter(pId));
        const capRuleEl = document.getElementById('rCap');
        if (capRuleEl) setRuleStatus(capRuleEl, 'danger', '✕');
        lastConditionOverride = {
          status: 'warn',
          stateLabel: 'KAPASİTE DOLU',
          expr: `EĞER (yolcuSayısı == ${lvl.maxPassengers}) İSE → Yeni yolcu binemez!`
        };
        showToast(
          '⚠️',
          `Sandalda Çiftçi dışında en fazla ${lvl.maxPassengers} yolcu bulunabilir! Önce bir yolcuyu indir.`,
          'warn'
        );
        updateUI();
        return;
      }
    }

    // Sandala bindir
    state.locations[charId] = 'boat';
    sound.playHop(true);
    const seatPos = getBoatSeatPosition(charId, boatVisual.x, boatVisual.y);
    animateCharacterHop(charId, seatPos, true, () => {
      if (lvl.capacityMode === 'weight') {
        const totalKg = getBoatTotalWeight();
        if (totalKg > lvl.maxWeight) {
          sound.playWarn();
          triggerBoatShake();
          showToast('⚠️', `Ağırlık limiti aşıldı! (${totalKg} / ${lvl.maxWeight} kg) Sandal bu yükle hareket edemez.`, 'danger');
        } else if (!isFarmerInBoat()) {
          showToast('🧑‍🌾', `${meta.name} (${meta.weight} kg) bindi. Toplam: ${totalKg} / ${lvl.maxWeight} kg. Çiftçi'yi de bindir!`, 'default');
        } else {
          showToast('⚖️', `Sandal ağırlığı: ${totalKg} / ${lvl.maxWeight} kg (Kalan: ${lvl.maxWeight - totalKg} kg).`, 'success');
        }
      } else {
        const passengers = getPassengersInBoat();
        if (charId === 'farmer') {
          showToast('🚣', `Çiftçi sandala bindi! İstersen en fazla ${lvl.maxPassengers} yolcu alıp "Karşıya Geç"e bas.`, 'success');
        } else if (!isFarmerInBoat()) {
          showToast('🧑‍🌾', `${meta.name} sandala bindi! Hareket etmek için Çiftçi'yi de bindir.`, 'default');
        } else {
          const names = passengers.map((p) => lvl.meta[p].name).join(' ve ');
          showToast('🚣', `Çiftçi + ${names} hazır! "Karşıya Geç" butonuna basabilirsin.`, 'success');
        }
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
      duration: 400,
      toBoat,
      onComplete: () => {
        emitLandingPuff(targetPos.x, targetPos.y, toBoat ? '#aef2ff' : '#e6ff9e');
        isBusy = false;
        if (onComplete) onComplete();
      }
    };
  }

  // ==================== KARŞIYA GEÇİŞ ====================
  function onCrossClick() {
    if (isBusy || gameEnded) return;
    clearHighlights();
    lastConditionOverride = null;

    const lvl = getLevel();

    // Kural 1: Çiftçi olmadan sandal hareket edemez
    if (!isFarmerInBoat()) {
      sound.playWarn();
      triggerBoatShake();
      pulseCharacter('farmer');
      const fRule = document.getElementById('rFarmer');
      if (fRule) setRuleStatus(fRule, 'danger', '✕');
      lastConditionOverride = {
        status: 'danger',
        stateLabel: 'KAPTAN YOK',
        expr: 'EĞER (SandaldaÇiftçi == YANLIŞ) İSE → Sandal hareket edemez!'
      };
      showToast('🧑‍🌾', 'Sandalı sadece Çiftçi kullanabilir! Önce Çiftçi\'yi sandala bindir.', 'warn');
      updateUI();
      return;
    }

    // Kural 2 (Seviye 3): Toplam ağırlık <= 100 kg kontrolü
    if (lvl.capacityMode === 'weight') {
      const totalKg = getBoatTotalWeight();
      if (totalKg > lvl.maxWeight) {
        sound.playWarn();
        triggerBoatShake();
        const wRule = document.getElementById('rWeight');
        if (wRule) setRuleStatus(wRule, 'danger', '✕');
        lastConditionOverride = {
          status: 'danger',
          stateLabel: 'AŞIRI YÜK!',
          expr: `EĞER (ToplamAğırlık (${totalKg} kg) > Limit (${lvl.maxWeight} kg)) İSE → Hareket İptal!`
        };
        showToast(
          '⚖️',
          `Ağırlık Limiti Aşıldı! Toplam Ağırlık (${totalKg} kg) > ${lvl.maxWeight} kg olduğu için sandal hareket edemez.`,
          'danger'
        );
        updateUI();
        return;
      }
    }

    // Geri Al için geçiş öncesi anlık durumu kaydet
    historyStack.push(cloneState(state));

    const fromSide = state.boatSide;
    const toSide = fromSide === 'left' ? 'right' : 'left';
    const passengers = getPassengersInBoat();
    const totalKg = lvl.capacityMode === 'weight' ? getBoatTotalWeight() : 0;

    state.boatSide = toSide;
    state.moves += 1;

    const crewNames = passengers.length > 0
      ? `Çiftçi + ${passengers.map((p) => lvl.meta[p].name).join(' + ')}`
      : 'Sadece Çiftçi';
    const kgSuffix = lvl.capacityMode === 'weight' ? ` [${totalKg} kg]` : '';
    const dirLabel = toSide === 'right' ? 'Sağ Kıyı' : 'Sol Kıyı';

    isBusy = true;
    sound.playRowSplash();
    scheduleTimeout(() => sound.playRowSplash(), 560);
    scheduleTimeout(() => sound.playRowSplash(), 1100);

    showToast('🌊', `${crewNames}${kgSuffix} karşıya geçiyor...`, 'default');
    updateUI();

    boatVisual.crossing = {
      fromX: BOAT_DOCK[fromSide].x,
      toX: BOAT_DOCK[toSide].x,
      startTime: performance.now(),
      duration: 1500,
      dir: toSide === 'right' ? 1 : -1,
      onComplete: () => {
        boatVisual.x = BOAT_DOCK[toSide].x;
        boatVisual.oarAngle = -18;

        // Ayrılınan kıyıda kural ihlali var mı?
        const hazard = evaluateBankHazard(lvl.id, state.locations, fromSide);
        if (hazard) {
          state.algoLog.push({
            step: state.moves,
            text: `${crewNames}${kgSuffix} → ${dirLabel} (Mantık Hatası!)`,
            failed: true
          });
          triggerRuleViolation(hazard);
          return;
        }

        // Güvenli adım kaydı
        state.algoLog.push({
          step: state.moves,
          text: `${crewNames}${kgSuffix} → ${dirLabel}`,
          failed: false
        });

        // Kazanma kontrolü: Tüm karakterler sağ kıyıya ulaştı mı?
        const allReachedRight =
          state.boatSide === 'right' &&
          lvl.chars.every((id) => state.locations[id] === 'right' || state.locations[id] === 'boat');

        if (allReachedRight) {
          triggerVictorySequence();
        } else {
          isBusy = false;
          showToast('✅', `${crewNames}${kgSuffix} güvenle ${toSide === 'right' ? 'sağ' : 'sol'} kıyıya ulaştı!`, 'success');
          updateUI();
        }
      }
    };
  }

  // ==================== KURAL İHLALİ & MİKRO ANİMASYONLAR ====================
  function triggerRuleViolation(hazard) {
    gameEnded = true;
    isBusy = true;

    const sideTitle = hazard.side === 'left' ? 'Sol' : 'Sağ';
    const sideLower = hazard.side === 'left' ? 'sol' : 'sağ';

    if (hazard.type === 'wolf-outnumber') {
      sound.playFail('wolf-sheep');
      hazard.wolfIds.forEach((id) => {
        charEls[id].classList.add('anim-wolf-hungry');
        showSpeechBubble(id, 'Sayıca üstünüz! 😋');
      });
      hazard.sheepIds.forEach((id) => {
        charEls[id].classList.add('anim-sheep-scared');
        showSpeechBubble(id, 'Meee! Çok fazlalar! 😱');
      });
      charEls.farmer.classList.add('anim-farmer-worried');
      showSpeechBubble('farmer', 'Eyvah! Kurt > Kuzu!');

      const cRule = document.getElementById('rCount');
      if (cRule) setRuleStatus(cRule, 'danger', '✕');

      lastConditionOverride = {
        status: 'danger',
        stateLabel: 'MANTIK HATASI!',
        expr: `EĞER (Çiftçi != ${sideTitle}Kıyı) VE (Kurt (${hazard.wolvesCount}) > Kuzu (${hazard.sheepCount})) İSE → HATA!`
      };

      const errMsg = `Mantık Hatası: ${sideTitle} kıyıda Kurt Sayısı (${hazard.wolvesCount}) > Kuzu Sayısı (${hazard.sheepCount}) koşulu oluştu! Çiftçi orada olmadığı için kuzular tehlikede.`;
      showToast('🚨', errMsg, 'danger');

      failEmoji.textContent = '🐺🐺🐑';
      failTitle.textContent = 'Mantık Hatası: Kurt Sayısı > Kuzu Sayısı!';
      failMessage.textContent = errMsg;
      failLogicText.textContent = `EĞER (Çiftçi != ${sideTitle}Kıyı) VE (KuzuSayısı > 0) VE (KurtSayısı (${hazard.wolvesCount}) > KuzuSayısı (${hazard.sheepCount})) İSE → Kurtlar kuzuları yer!`;
    } else if (hazard.type === 'wolf-sheep') {
      sound.playFail('wolf-sheep');
      charEls.wolf.classList.add('anim-wolf-hungry');
      charEls.sheep.classList.add('anim-sheep-scared');
      charEls.farmer.classList.add('anim-farmer-worried');

      showSpeechBubble('wolf', 'Mmmm, taze kuzu! 😋');
      showSpeechBubble('sheep', 'Meee! İmdat! 😱');
      showSpeechBubble('farmer', 'Eyvah! Kuzum!');

      const wRule = document.getElementById('rWolf');
      if (wRule) setRuleStatus(wRule, 'danger', '✕');

      lastConditionOverride = {
        status: 'danger',
        stateLabel: 'MANTIK HATASI!',
        expr: `EĞER (Çiftçi != ${sideTitle}Kıyı) VE (Kurt == Kuzu) İSE → HATA!`
      };

      showToast('🚨', `Eyvah! Kurt ile Kuzu ${sideLower} kıyıda yalnız kaldı!`, 'danger');

      failEmoji.textContent = '🐺🐑';
      failTitle.textContent = 'Eyvah! Kurt Kuzuyu Yedi!';
      failMessage.textContent = `Çiftçi karşıya geçince Kurt ve Kuzu ${sideLower} kıyıda yalnız kaldı. Aç kurt bu fırsatı kaçırmadı!`;
      failLogicText.textContent = `EĞER (Çiftçi != ${sideTitle}Kıyı) VE (Kurt == Kuzu) İSE → Kurt kuzuyu yer!`;
    } else {
      sound.playFail('sheep-cabbage');
      charEls.sheep.classList.add('anim-sheep-munch');
      charEls.cabbage.classList.add('anim-cabbage-scared');
      charEls.farmer.classList.add('anim-farmer-worried');

      showSpeechBubble('sheep', 'Kıtır kıtır! Nefis! 😋');
      showSpeechBubble('cabbage', 'Yapraklarım! İmdat! 🥬');
      showSpeechBubble('farmer', 'Eyvah! Lahanam!');

      const cabRule = document.getElementById('rCab');
      if (cabRule) setRuleStatus(cabRule, 'danger', '✕');

      lastConditionOverride = {
        status: 'danger',
        stateLabel: 'MANTIK HATASI!',
        expr: `EĞER (Çiftçi != ${sideTitle}Kıyı) VE (Kuzu == Lahana) İSE → HATA!`
      };

      showToast('🚨', `Eyvah! Kuzu ile Lahana ${sideLower} kıyıda yalnız kaldı!`, 'danger');

      failEmoji.textContent = '🐑🥬';
      failTitle.textContent = 'Eyvah! Kuzu Lahanayı Yedi!';
      failMessage.textContent = `Çiftçi karşıya geçince Kuzu ve Lahana ${sideLower} kıyıda yalnız kaldı. Kuzu taze lahanayı kıtır kıtır mideye indirdi!`;
      failLogicText.textContent = `EĞER (Çiftçi != ${sideTitle}Kıyı) VE (Kuzu == Lahana) İSE → Kuzu lahanayı yer!`;
    }

    updateUI();

    scheduleTimeout(() => {
      isBusy = false;
      failModal.hidden = false;
    }, 1850);
  }

  // ==================== KAZANMA, OPTİMİZASYON PUANI VE KUTLAMA ====================
  function triggerVictorySequence() {
    gameEnded = true;
    isBusy = true;

    const lvl = getLevel();
    const inBoat = lvl.chars.filter((id) => state.locations[id] === 'boat');
    let delay = 80;

    inBoat.forEach((id, idx) => {
      scheduleTimeout(() => {
        state.locations[id] = 'right';
        sound.playHop(false);
        const vis = charVisuals[id];
        const dest = lvl.slots.right[id];
        vis.hop = {
          fromX: vis.x,
          fromY: vis.y,
          toX: dest.x,
          toY: dest.y,
          startTime: performance.now(),
          duration: 360,
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
      delay += 180;
    });

    if (inBoat.length === 0) {
      startCelebration();
    }
  }

  function startCelebration() {
    const lvl = getLevel();
    const m = state.moves;
    const ideal = idealStepsByLevel[lvl.id];

    sound.playWin();
    confettiActive = true;
    launchConfettiWave();
    scheduleTimeout(launchConfettiWave, 450);
    scheduleTimeout(launchConfettiWave, 950);

    lvl.chars.forEach((id) => {
      charEls[id].classList.add('anim-celebrate');
      const cheer = id === 'farmer'
        ? 'Başardık! 🎉'
        : lvl.meta[id].type === 'wolf'
          ? 'Yaşasın! 🐺'
          : lvl.meta[id].type === 'sheep'
            ? 'Meee! Harika! 🐑'
            : lvl.meta[id].type === 'feed'
              ? 'Tam dengede! 🌾'
              : 'Güvendeyim! 🥬';
      showSpeechBubble(id, cheer);
    });

    // Optimizasyon Yıldız & Verimlilik Hesabı
    let stars = '⭐⭐⭐';
    let starCount = 3;
    let rank = 'Optimal! 🏆';
    let extra = 'Mükemmel optimizasyon! En kısa algoritmayı buldun.';

    if (m > ideal && m <= ideal + 2) {
      stars = '⭐⭐';
      starCount = 2;
      rank = 'Çok İyi!';
      extra = `Algoritmanı biraz daha sadeleştirerek ${ideal} adıma düşürebilirsin!`;
    } else if (m > ideal + 2) {
      stars = '⭐';
      starCount = 1;
      rank = 'Geliştirilebilir';
      extra = `Hedefe ulaştın! Şimdi gereksiz adımları azaltıp ${ideal} adımlık ideal çözümü hedefle.`;
    }

    // Tamamlanan seviye kaydı (en iyi skor localStorage'a da kaydedilir)
    const prev = completedLevels[lvl.id];
    if (!prev || m < prev.bestMoves) {
      completedLevels[lvl.id] = { bestMoves: m, stars, starCount };
      saveProgress();
    }
    updateLevelDoneBadges();

    // Genel 3 seviye ilerleme özeti
    const doneCount = [1, 2, 3].filter((id) => completedLevels[id]).length;
    const totalStars = [1, 2, 3].reduce((acc, id) => acc + (completedLevels[id] ? completedLevels[id].starCount : 0), 0);
    winTotalProgress.hidden = false;
    winTotalProgress.textContent = doneCount === 3
      ? `🏆 Tüm Seviyeler Tamamlandı (3/3) • Toplam Yıldız: ⭐ ${totalStars} / 9`
      : `🏅 Genel İlerleme: ${doneCount} / 3 Seviye • Toplam Yıldız: ⭐ ${totalStars} / 9`;

    winStars.textContent = stars;
    winTitle.textContent = doneCount === 3 && lvl.id === 3
      ? '🏆 Tüm Seviyeleri Tamamladın!'
      : `Tebrikler! ${lvl.shortTitle} Tamamlandı!`;
    winMessage.textContent = `Tebrikler! ${m} adımda tamamladın. En kısa algoritma: ${ideal} adım. ${stars} ${extra}`;
    winMoveCount.textContent = `${m} Adım`;
    winIdealCount.textContent = `${ideal} Adım`;
    winRank.textContent = rank;

    // En kısa çözüm adımlarını (İdeal Algoritma) hem kazanma penceresinde hem algoritma günlüğünde göster
    renderOptimalSolution(lvl.id);
    optimalToggleLabel.textContent = `✨ En Kısa Çözüm Adımları (${ideal} Adım — İdeal Algoritma)`;
    btnToggleOptimal.setAttribute('aria-expanded', 'true');
    optimalStepsWrap.hidden = false;

    // Sonraki Seviye butonu kontrolü
    if (lvl.id < 3) {
      btnNextLevel.hidden = false;
      btnNextLevel.textContent = `🚀 ${lvl.id + 1}. Seviyeye Geç ➜`;
    } else {
      btnNextLevel.hidden = true;
    }

    showToast('🎉', `${lvl.shortTitle} ${m} adımda tamamlandı! (En kısa algoritma: ${ideal} adım)`, 'success');
    updateUI();

    scheduleTimeout(() => {
      isBusy = false;
      winModal.hidden = false;
    }, 1020);
  }

  function renderOptimalSolution(levelId) {
    const lvl = LEVELS[levelId];
    const path = idealPathByLevel[levelId] || [];

    const itemsHtml = path.map((step, idx) => {
      const crewText = step.passengers.length > 0
        ? `🧑‍🌾 Çiftçi + ${step.passengers.map((pId) => `${lvl.meta[pId].emoji} ${lvl.meta[pId].name}`).join(' + ')}`
        : '🧑‍🌾 Sadece Çiftçi';
      const kgTag = lvl.capacityMode === 'weight'
        ? ` <strong>(${lvl.meta.farmer.weight + step.passengers.reduce((s, pId) => s + lvl.meta[pId].weight, 0)} kg)</strong>`
        : '';
      const dirClass = step.to === 'right' ? 'to-right' : 'to-left';
      const dirText = step.to === 'right' ? 'Sağ Kıyıya ➜' : '⬅ Sol Kıyıya';

      return `
        <li>
          <span class="opt-step-idx">${idx + 1}</span>
          <span class="opt-step-main">${crewText}${kgTag}</span>
          <span class="opt-step-dir ${dirClass}">${dirText}</span>
        </li>
      `;
    }).join('');

    winOptimalSteps.innerHTML = itemsHtml;
    drawerOptimalList.innerHTML = itemsHtml;
    drawerOptimalCount.textContent = String(path.length);
    drawerOptimalSection.hidden = path.length === 0;
  }

  function updateLevelDoneBadges() {
    [1, 2, 3].forEach((lvlId) => {
      const el = document.getElementById(`lvlDone${lvlId}`);
      if (!el) return;
      const rec = completedLevels[lvlId];
      if (rec) {
        el.hidden = false;
        el.textContent = `✓ ${rec.stars}`;
      } else {
        el.hidden = true;
      }
    });
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
    lastConditionOverride = null;
    if (drawerOptimalSection) drawerOptimalSection.hidden = true;

    state = historyStack.pop();
    gameEnded = false;
    isBusy = false;
    boatVisual.crossing = null;
    getLevel().chars.forEach((id) => { charVisuals[id].hop = null; });

    syncVisualPositionsImmediate();
    updateUI();
    showToast('↩️', 'Son hamle geri alındı. Şimdi farklı bir strateji deneyebilirsin!', 'default');
  }

  function resetGame() {
    loadLevel(currentLevelId);
  }

  function syncVisualPositionsImmediate() {
    const lvl = getLevel();
    boatVisual.x = BOAT_DOCK[state.boatSide].x;
    boatVisual.y = BOAT_DOCK[state.boatSide].y;
    boatVisual.oarAngle = -18;

    lvl.chars.forEach((id) => {
      const pos = getTargetPosition(id);
      charVisuals[id].x = pos.x;
      charVisuals[id].y = pos.y;
      charVisuals[id].scaleX = 1;
      charVisuals[id].scaleY = 1;
    });
  }

  // ==================== GENELLEŞTİRİLMİŞ BFS İPUCU & OPTİMAL ADIM ÇÖZÜCÜ ====================
  function onHintClick() {
    if (isBusy || gameEnded) return;
    sound.playClick();
    clearHighlights();

    const lvl = getLevel();
    const banksMap = {};
    lvl.chars.forEach((id) => {
      banksMap[id] = state.locations[id] === 'boat' ? state.boatSide : state.locations[id];
    });

    const solution = solveLevelBFS(lvl.id, state.boatSide, banksMap);
    if (!solution || !solution.firstMove) {
      showToast('💡', 'İpucu: Geri Al ile bir önceki güvenli adıma dönebilirsin.', 'hint');
      return;
    }

    const move = solution.firstMove;
    const destText = move.to === 'right' ? 'sağ kıyıya' : 'sol kıyıya';

    // Sandalda gereksiz / yanlış yolcu varsa önce onu indir uyarısı ekle
    const extraInBoat = getPassengersInBoat().filter((pId) => !move.passengers.includes(pId));
    const disembarkNote = extraInBoat.length > 0
      ? ` (Önce sandaldaki ${extraInBoat.map((id) => lvl.meta[id].name).join(' ve ')} karakterini indir!)`
      : '';

    pulseCharacter('farmer');
    move.passengers.forEach((pId) => pulseCharacter(pId));
    extraInBoat.forEach((pId) => pulseCharacter(pId));

    if (move.passengers.length === 0) {
      showToast('💡', `İpucu (${solution.steps} adım kaldı): Çiftçi tek başına ${destText} dönebilir!${disembarkNote}`, 'hint');
    } else {
      const pNames = move.passengers.map((pId) => lvl.meta[pId].name).join(' ve ');
      const kgInfo = lvl.capacityMode === 'weight'
        ? ` (${lvl.meta.farmer.weight + move.passengers.reduce((s, p) => s + lvl.meta[p].weight, 0)} kg)`
        : '';
      showToast('💡', `İpucu (${solution.steps} adım kaldı): Çiftçi, ${pNames}${kgInfo} ile ${destText} geçmeyi dene!${disembarkNote}`, 'hint');
    }
  }

  function solveLevelBFS(levelId, startSide, startBanks) {
    const lvl = LEVELS[levelId];
    const chars = lvl.chars;

    const encode = (side, map) => `${side}|${chars.map((c) => (map[c] === 'right' ? '1' : '0')).join('')}`;
    const isGoal = (map) => chars.every((c) => map[c] === 'right');

    if (isGoal(startBanks)) return { steps: 0, firstMove: null, path: [] };

    const queue = [{ side: startSide, map: { ...startBanks }, path: [] }];
    const visited = new Set([encode(startSide, startBanks)]);

    while (queue.length > 0) {
      const cur = queue.shift();
      const targetSide = cur.side === 'left' ? 'right' : 'left';
      const avail = chars.filter((c) => c !== 'farmer' && cur.map[c] === cur.side);

      // Geçerli yolcu alt kümelerini üret
      const subsets = [[]];
      const totalMasks = 1 << avail.length;
      for (let mask = 1; mask < totalMasks; mask++) {
        const chosen = [];
        for (let i = 0; i < avail.length; i++) {
          if (mask & (1 << i)) chosen.push(avail[i]);
        }
        if (lvl.capacityMode === 'count') {
          if (chosen.length <= lvl.maxPassengers) subsets.push(chosen);
        } else {
          const w = lvl.meta.farmer.weight + chosen.reduce((s, id) => s + lvl.meta[id].weight, 0);
          if (w <= lvl.maxWeight) subsets.push(chosen);
        }
      }

      for (const chosen of subsets) {
        const nextMap = { ...cur.map, farmer: targetSide };
        chosen.forEach((id) => { nextMap[id] = targetSide; });

        // Ayrılınan kıyıda tehlike oluşuyor mu?
        if (evaluateBankHazard(levelId, nextMap, cur.side)) continue;

        const key = encode(targetSide, nextMap);
        if (visited.has(key)) continue;
        visited.add(key);

        const nextPath = cur.path.concat([{ passengers: chosen, to: targetSide }]);
        if (isGoal(nextMap)) {
          return { steps: nextPath.length, firstMove: nextPath[0], path: nextPath };
        }
        queue.push({ side: targetSide, map: nextMap, path: nextPath });
      }
    }
    return null;
  }

  // ==================== ARAYÜZ & AKTİF KOŞUL KONTROLÜ GÜNCELLEME ====================
  function updateUI() {
    const lvl = getLevel();
    elMoveCount.textContent = String(state.moves);

    const onRight = lvl.chars.filter((id) => state.locations[id] === 'right').length;
    elRightCount.textContent = `${onRight} / ${lvl.chars.length}`;

    // Seviye 2'de kıyılardaki değişken sayılarını anlık göster
    if (lvl.id === 2) {
      const lw = countTypeOnSide('left', 'wolf');
      const ls = countTypeOnSide('left', 'sheep');
      const rw = countTypeOnSide('right', 'wolf');
      const rs = countTypeOnSide('right', 'sheep');
      elLeftBankSummary.textContent = `(🐺${lw} 🐑${ls})`;
      elRightBankSummary.textContent = `(🐺${rw} 🐑${rs})`;
    } else {
      elLeftBankSummary.textContent = '(Başlangıç)';
      elRightBankSummary.textContent = '(Hedef)';
    }

    btnUndo.disabled = isBusy || historyStack.length === 0;

    // Alt rıhtım & sandal kapasitesi
    const farmerAboard = isFarmerInBoat();
    const passengers = getPassengersInBoat();
    const totalKg = lvl.capacityMode === 'weight' ? getBoatTotalWeight() : 0;
    const isOverWeight = lvl.capacityMode === 'weight' && totalKg > lvl.maxWeight;

    if (farmerAboard) {
      elSeatFarmerVal.textContent = lvl.capacityMode === 'weight'
        ? '🧑‍🌾 Çiftçi (60 kg)'
        : '🧑‍🌾 Çiftçi (Hazır)';
      elSeatFarmerVal.classList.remove('empty');
    } else {
      elSeatFarmerVal.textContent = 'Boş (Çiftçi gerekli)';
      elSeatFarmerVal.classList.add('empty');
    }

    if (lvl.capacityMode === 'weight') {
      elSeatPassengerRole.textContent = 'Sandal Ağırlığı (≤ 100 kg):';
      elSeatPassengerVal.textContent = isOverWeight
        ? `⚠️ ${totalKg} / ${lvl.maxWeight} kg (Aşırı Yük!)`
        : `${totalKg} / ${lvl.maxWeight} kg`;
      elSeatPassengerVal.classList.toggle('empty', totalKg === 0);
      elSeatPassengerVal.classList.toggle('over-limit', isOverWeight);

      elDockWeightBarWrap.hidden = false;
      const pct = Math.min(100, Math.round((totalKg / lvl.maxWeight) * 100));
      elDockWeightFill.style.width = `${pct}%`;
      elDockWeightFill.classList.toggle('near-limit', !isOverWeight && totalKg >= 80);
      elDockWeightFill.classList.toggle('over-limit', isOverWeight);

      // SVG sandal üstü canlı kapasite barı
      updateBoatWeightBarSVG(totalKg, lvl.maxWeight);
      boatVisual.sinkY = isOverWeight ? 7 : (totalKg >= 80 ? 3 : 0);
    } else {
      elDockWeightBarWrap.hidden = true;
      elSeatPassengerVal.classList.remove('over-limit');
      elSeatPassengerRole.textContent = `Yolcu (En fazla ${lvl.maxPassengers}):`;

      if (passengers.length > 0) {
        elSeatPassengerVal.textContent = passengers
          .map((id) => `${lvl.meta[id].emoji} ${lvl.meta[id].name}`)
          .join(', ');
        elSeatPassengerVal.classList.remove('empty');
      } else {
        elSeatPassengerVal.textContent = 'Boş (İsteğe bağlı)';
        elSeatPassengerVal.classList.add('empty');
      }

      if (boatSeatHints) {
        const full = farmerAboard && passengers.length >= lvl.maxPassengers;
        boatSeatHints.style.opacity = full ? '0' : '0.78';
        if (seatHintCaptain) seatHintCaptain.style.opacity = farmerAboard ? '0' : '1';
        if (seatHintP1) seatHintP1.style.opacity = passengers.length >= 1 ? '0' : '1';
        if (seatHintP2 && lvl.maxPassengers >= 2) {
          seatHintP2.style.opacity = passengers.length >= 2 ? '0' : '1';
        }
      }
      boatVisual.sinkY = 0;
    }

    // "Karşıya Geç" butonu
    btnCross.disabled = isBusy || gameEnded;
    btnCross.classList.toggle('dir-left', state.boatSide === 'right');
    btnCross.classList.toggle('needs-farmer', (!farmerAboard || isOverWeight) && !gameEnded);
    btnCross.classList.toggle('ready-pulse', farmerAboard && !isOverWeight && !isBusy && !gameEnded);
    crossText.textContent = 'Karşıya Geç';
    btnCross.title = state.boatSide === 'left' ? 'Sandalı sağ kıyıya geçir' : 'Sandalı sol kıyıya geçir';

    // Karakter tıklanabilirlik, zemin gölgesi ve ağırlık etiketi görünürlüğü
    lvl.chars.forEach((id) => {
      const node = charEls[id];
      if (!node) return;
      const loc = state.locations[id];
      const clickable = !isBusy && !gameEnded && (loc === 'boat' || loc === state.boatSide);
      node.classList.toggle('disabled-char', !clickable);

      const shadow = node.querySelector('.char-ground-shadow');
      if (shadow) shadow.style.opacity = loc === 'boat' ? '0' : '0.32';

      const wBadge = node.querySelector('.char-weight-badge');
      if (wBadge) wBadge.style.opacity = loc === 'boat' ? '0' : '1';
    });

    // Kural kartları & Aktif Koşul Kontrolü kutusu
    updateRulesAndLiveCondition(farmerAboard, passengers, totalKg, isOverWeight);

    // Algoritma adımları günlüğü
    renderAlgoLog();
  }

  function updateBoatWeightBarSVG(totalKg, maxKg) {
    const over = totalKg > maxKg;
    const ratio = Math.min(1, totalKg / maxKg);
    const barWidth = Math.round(ratio * 120);

    boatWeightText.textContent = over
      ? `⚠️ ${totalKg} / ${maxKg} kg!`
      : `⚖️ ${totalKg} / ${maxKg} kg`;
    boatWeightText.setAttribute('fill', over ? '#b91c1c' : '#4a2b10');
    boatWeightFillRect.setAttribute('width', String(barWidth));
    boatWeightFillRect.setAttribute('fill', over ? '#e14d57' : (totalKg >= 80 ? '#f59e0b' : '#22a06b'));
    boatWeightBar.classList.toggle('weight-bar-overload', over);
  }

  function updateRulesAndLiveCondition(farmerAboard, passengers, totalKg, isOverWeight) {
    const lvl = getLevel();

    if (!gameEnded) {
      const rFarmer = document.getElementById('rFarmer');
      if (rFarmer) setRuleStatus(rFarmer, farmerAboard ? 'ok' : 'neutral', farmerAboard ? '✓' : '!');

      const rCap = document.getElementById('rCap');
      if (rCap) setRuleStatus(rCap, 'ok', '✓');

      const rWeight = document.getElementById('rWeight');
      if (rWeight) setRuleStatus(rWeight, isOverWeight ? 'danger' : 'ok', isOverWeight ? '✕' : '✓');

      const rCount = document.getElementById('rCount');
      if (rCount) setRuleStatus(rCount, 'ok', '✓');

      const rWolf = document.getElementById('rWolf');
      if (rWolf) setRuleStatus(rWolf, 'ok', '✓');

      const rCab = document.getElementById('rCab');
      if (rCab) setRuleStatus(rCab, 'ok', '✓');
    }

    // Aktif Koşul Kontrolü Kutusu
    elLiveCondBox.classList.remove('cond-ok', 'cond-warn', 'cond-danger');

    if (lastConditionOverride) {
      elLiveCondBox.classList.add(`cond-${lastConditionOverride.status}`);
      elLiveCondState.textContent = lastConditionOverride.stateLabel;
      elLiveCondExpr.textContent = lastConditionOverride.expr;
    } else if (isOverWeight) {
      elLiveCondBox.classList.add('cond-danger');
      elLiveCondState.textContent = 'LİMİT AŞILDI ✕';
      elLiveCondExpr.textContent = `EĞER (ToplamAğırlık (${totalKg} kg) <= ${lvl.maxWeight} kg) → YANLIŞ! Sandal hareket edemez.`;
    } else if (!farmerAboard && !gameEnded) {
      elLiveCondBox.classList.add('cond-warn');
      elLiveCondState.textContent = 'ÇİFTÇİ BEKLENİYOR';
      elLiveCondExpr.textContent = lvl.defaultFormula;
    } else {
      elLiveCondBox.classList.add('cond-ok');
      elLiveCondState.textContent = gameEnded ? 'TAMAMLANDI ✓' : 'KOŞULLAR GÜVENLİ ✓';
      elLiveCondExpr.textContent = lvl.defaultFormula;
    }

    // Canlı Değişken Takip Çipleri
    const chips = [];
    const sideStr = state.boatSide === 'left' ? 'Sol' : 'Sağ';
    chips.push({ text: `Sandal=${sideStr}`, danger: false });
    chips.push({ text: `ÇiftçiSandalda=${farmerAboard ? 'DOĞRU' : 'YANLIŞ'}`, danger: false });

    if (lvl.id === 2) {
      const lw = countTypeOnSide('left', 'wolf');
      const ls = countTypeOnSide('left', 'sheep');
      const rw = countTypeOnSide('right', 'wolf');
      const rs = countTypeOnSide('right', 'sheep');
      chips.push({ text: `Sol(🐺${lw}, 🐑${ls})`, danger: state.locations.farmer !== 'left' && ls > 0 && lw > ls });
      chips.push({ text: `Sağ(🐺${rw}, 🐑${rs})`, danger: state.locations.farmer !== 'right' && rs > 0 && rw > rs });
      chips.push({ text: `Yolcu=${passengers.length}/${lvl.maxPassengers}`, danger: false });
    } else if (lvl.id === 3) {
      chips.push({ text: `Ağırlık=${totalKg}/${lvl.maxWeight} kg`, danger: isOverWeight });
      chips.push({ text: `Kalan=${Math.max(0, lvl.maxWeight - totalKg)} kg`, danger: isOverWeight });
    } else {
      chips.push({ text: `Yolcu=${passengers.length}/${lvl.maxPassengers}`, danger: false });
    }

    elLiveCondVars.innerHTML = chips
      .map((c) => `<span class="var-chip ${c.danger ? 'var-danger' : ''}">${c.text}</span>`)
      .join('');
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
    getLevel().chars.forEach((id) => {
      if (!charEls[id]) return;
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
    scheduleTimeout(() => {
      if (charEls[charId]) charEls[charId].classList.remove('highlight-pulse');
    }, 2400);
  }

  function clearHighlights() {
    getLevel().chars.forEach((id) => {
      if (charEls[id]) charEls[id].classList.remove('highlight-pulse');
    });
  }

  function triggerBoatShake() {
    [boatBackShake, boatFrontShake].forEach((el) => {
      el.classList.remove('boat-shake');
      void el.offsetWidth;
      el.classList.add('boat-shake');
    });
  }

  // ==================== CANVAS EFEKTLERİ ====================
  function emitBoatWake(svgX, svgY, dir) {
    const sternX = svgX - dir * 74;
    const waterY = svgY + 30;

    wakes.push({
      sx: sternX,
      sy: waterY + (Math.random() - 0.5) * 8,
      dir,
      age: 0,
      maxAge: 950
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
    const t = Math.random();
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
    const lvl = getLevel();

    // 1. Sandal hareketi & su üzerinde sallanma fiziği
    if (boatVisual.crossing) {
      const c = boatVisual.crossing;
      const p = Math.min((now - c.startTime) / c.duration, 1);
      const eased = easeInOutCubic(p);

      boatVisual.x = c.fromX + (c.toX - c.fromX) * eased;
      boatVisual.bobY = Math.sin(p * Math.PI * 5) * 4.5;
      boatVisual.tilt = Math.sin(p * Math.PI * 3.5) * 3.8 + c.dir * Math.sin(p * Math.PI) * 2.2;
      boatVisual.oarAngle = -18 + Math.sin(p * Math.PI * 6) * 32 * c.dir;

      if (now - lastWakeEmit > 34 && p > 0.04 && p < 0.96) {
        lastWakeEmit = now;
        emitBoatWake(boatVisual.x, boatVisual.y + boatVisual.bobY + boatVisual.sinkY, c.dir);
      }

      if (p >= 1) {
        const done = c.onComplete;
        boatVisual.crossing = null;
        if (done) done();
      }
    } else {
      boatVisual.bobY = Math.sin(tSec * 2.3) * 3.2;
      boatVisual.tilt = Math.sin(tSec * 1.65) * 1.15;
      boatVisual.oarAngle = -18 + Math.sin(tSec * 2.3) * 2.5;
    }

    const liveBoatY = boatVisual.y + boatVisual.bobY + boatVisual.sinkY;
    const boatTransform = `translate(${boatVisual.x.toFixed(2)}, ${liveBoatY.toFixed(2)}) rotate(${boatVisual.tilt.toFixed(2)})`;
    boatBackGroup.setAttribute('transform', boatTransform);
    boatFrontGroup.setAttribute('transform', boatTransform);
    boatOar.setAttribute('transform', `translate(-14, 7) rotate(${boatVisual.oarAngle.toFixed(2)})`);

    // 2. Karakter konumları (Zıplama Easing & Sandal takibi)
    const aboardCount = lvl.chars.filter((id) => state.locations[id] === 'boat').length;
    const crowdScale = aboardCount >= 4 ? 0.84 : (aboardCount === 3 ? 0.91 : 1);

    lvl.chars.forEach((id) => {
      const vis = charVisuals[id];
      const el = charEls[id];
      if (!vis || !el) return;

      if (vis.hop) {
        const h = vis.hop;
        const p = Math.min((now - h.startTime) / h.duration, 1);
        const eased = easeOutCubic(p);

        const dest = h.toBoat
          ? getBoatSeatPosition(id, boatVisual.x, liveBoatY)
          : { x: h.toX, y: h.toY };

        const arcHeight = Math.sin(p * Math.PI) * 82;
        vis.x = h.fromX + (dest.x - h.fromX) * eased;
        vis.y = h.fromY + (dest.y - h.fromY) * eased - arcHeight;

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
          vis.x = dest.x;
          vis.y = dest.y;
          vis.scaleX = 1;
          vis.scaleY = 1;
          const done = h.onComplete;
          vis.hop = null;
          if (done) done();
        }
      } else if (state.locations[id] === 'boat') {
        const seat = getBoatSeatPosition(id, boatVisual.x, liveBoatY);
        // Yumuşak koltuk kayması (birden fazla yolcu inip binerken)
        vis.x += (seat.x - vis.x) * Math.min(1, dt * 14);
        vis.y += (seat.y - vis.y) * Math.min(1, dt * 14);
        vis.scaleX = crowdScale;
        vis.scaleY = crowdScale;
      }

      const tilt = state.locations[id] === 'boat' && !vis.hop ? boatVisual.tilt * 0.7 : 0;
      el.setAttribute(
        'transform',
        `translate(${vis.x.toFixed(2)}, ${vis.y.toFixed(2)}) rotate(${tilt.toFixed(2)}) scale(${vis.scaleX.toFixed(3)}, ${vis.scaleY.toFixed(3)})`
      );
    });

    // 3. Nehir su parıltıları
    if (now - lastSparkleEmit > 160) {
      lastSparkleEmit = now;
      emitRiverSparkle();
    }

    // 4. Canvas efektleri
    renderCanvasEffects(dt);

    requestAnimationFrame(tick);
  }

  function renderCanvasEffects(dt) {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // A) Nehir parıltıları
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sp = sparkles[i];
      sp.age += dt * 1000;
      sp.sy += dt * 18;
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

    // B) Sandal su dalgası izi
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

    // C) Sıçrama ve parıltılar
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.age += dt * 1000;
      if (s.age >= s.maxAge) {
        splashes.splice(i, 1);
        continue;
      }
      s.sx += s.vx * dt;
      s.sy += s.vy * dt;
      s.vy += 170 * dt;

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

    // D) Konfetiler
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.age += dt * 1000;
      if (c.age >= c.maxAge) {
        confetti.splice(i, 1);
        continue;
      }
      c.sx += c.vx * dt;
      c.sy += c.vy * dt;
      c.vy += 380 * dt;
      c.vx *= 0.992;
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
