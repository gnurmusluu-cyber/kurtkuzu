/* =========================================================
   svg-art.js — Masalsı 2D Vektörel İllüstrasyon Sahnesi
   Gölgelendirmeli arka plan, ahşap iskeleler, akan nehir,
   sandal ve ifadeli karakterler (Çiftçi, Kurt, Kuzu, Lahana)
   ========================================================= */
(function (global) {
  'use strict';

  function buildSceneSVG() {
    return `
      <defs>
        <!-- Gökyüzü ve Güneş Gradyanları -->
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3da9eb" />
          <stop offset="48%" stop-color="#87d8fb" />
          <stop offset="82%" stop-color="#d5f2ff" />
          <stop offset="100%" stop-color="#fff4d2" />
        </linearGradient>

        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff9c4" stop-opacity="0.95" />
          <stop offset="35%" stop-color="#ffe066" stop-opacity="0.55" />
          <stop offset="70%" stop-color="#ffd166" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#ffd166" stop-opacity="0" />
        </radialGradient>

        <radialGradient id="sunDisc" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#fffef0" />
          <stop offset="55%" stop-color="#ffe169" />
          <stop offset="100%" stop-color="#f7b731" />
        </radialGradient>

        <!-- Uzak Dağ & Tepe Gradyanları (Atmosferik Derinlik) -->
        <linearGradient id="farMtnGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7eb7d9" />
          <stop offset="100%" stop-color="#a8d6cf" />
        </linearGradient>

        <linearGradient id="midHillLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#83cf65" />
          <stop offset="100%" stop-color="#4e9e45" />
        </linearGradient>

        <linearGradient id="midHillRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#96d96a" />
          <stop offset="100%" stop-color="#53a447" />
        </linearGradient>

        <!-- Ön Çayır & Kıyı Gradyanları -->
        <linearGradient id="leftBankGrad" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stop-color="#9be05a" />
          <stop offset="45%" stop-color="#6ac048" />
          <stop offset="100%" stop-color="#3c8a35" />
        </linearGradient>

        <linearGradient id="rightBankGrad" x1="1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stop-color="#a6e362" />
          <stop offset="45%" stop-color="#6ec24a" />
          <stop offset="100%" stop-color="#3d8c37" />
        </linearGradient>

        <linearGradient id="bankSoilLeft" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stop-color="#b58353" />
          <stop offset="60%" stop-color="#8c5c34" />
          <stop offset="100%" stop-color="#613d1e" />
        </linearGradient>

        <linearGradient id="bankSoilRight" x1="1" y1="0" x2="0" y2="0.6">
          <stop offset="0%" stop-color="#b58353" />
          <stop offset="60%" stop-color="#8c5c34" />
          <stop offset="100%" stop-color="#613d1e" />
        </linearGradient>

        <!-- Nehir Suyu Gradyanları -->
        <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7ce2f7" />
          <stop offset="22%" stop-color="#3ec4e0" />
          <stop offset="58%" stop-color="#1f9ec2" />
          <stop offset="100%" stop-color="#136f94" />
        </linearGradient>

        <linearGradient id="riverSunShimmer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fffbe0" stop-opacity="0.72" />
          <stop offset="45%" stop-color="#b8f4ff" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#7ce2f7" stop-opacity="0" />
        </linearGradient>

        <!-- Ahşap İskele & Sandal Gradyanları -->
        <linearGradient id="woodPlank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d49655" />
          <stop offset="50%" stop-color="#b07036" />
          <stop offset="100%" stop-color="#874f21" />
        </linearGradient>

        <linearGradient id="woodPost" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#633818" />
          <stop offset="35%" stop-color="#9e6232" />
          <stop offset="75%" stop-color="#7a461e" />
          <stop offset="100%" stop-color="#4e2a10" />
        </linearGradient>

        <linearGradient id="boatHullOuter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c97b38" />
          <stop offset="45%" stop-color="#9b5520" />
          <stop offset="100%" stop-color="#5e2f0e" />
        </linearGradient>

        <linearGradient id="boatHullInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6e3914" />
          <stop offset="100%" stop-color="#42200a" />
        </linearGradient>

        <linearGradient id="boatRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f2be7a" />
          <stop offset="100%" stop-color="#b87232" />
        </linearGradient>

        <!-- Ağaç Yaprak & Gövde Gradyanları -->
        <radialGradient id="foliageBright" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#9de359" />
          <stop offset="55%" stop-color="#4ea83b" />
          <stop offset="100%" stop-color="#2c6f27" />
        </radialGradient>

        <radialGradient id="foliageDeep" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#78cc47" />
          <stop offset="60%" stop-color="#3b8c32" />
          <stop offset="100%" stop-color="#215921" />
        </radialGradient>

        <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#5c361a" />
          <stop offset="40%" stop-color="#8c5830" />
          <stop offset="100%" stop-color="#4a2810" />
        </linearGradient>

        <!-- Karakter Gradyanları -->
        <radialGradient id="skinGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffe0c2" />
          <stop offset="70%" stop-color="#f5be92" />
          <stop offset="100%" stop-color="#de9b6c" />
        </radialGradient>

        <linearGradient id="strawHatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffe78c" />
          <stop offset="55%" stop-color="#eab543" />
          <stop offset="100%" stop-color="#c48a1e" />
        </linearGradient>

        <linearGradient id="denimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4e8cd4" />
          <stop offset="60%" stop-color="#3267ab" />
          <stop offset="100%" stop-color="#21487d" />
        </linearGradient>

        <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff7a59" />
          <stop offset="100%" stop-color="#d44528" />
        </linearGradient>

        <linearGradient id="wolfFurGrad" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#8b99ab" />
          <stop offset="52%" stop-color="#5d6b7d" />
          <stop offset="100%" stop-color="#3a4554" />
        </linearGradient>

        <linearGradient id="wolf2FurGrad" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#6c7482" />
          <stop offset="52%" stop-color="#454c59" />
          <stop offset="100%" stop-color="#272c36" />
        </linearGradient>

        <linearGradient id="wolfBellyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f2f4f7" />
          <stop offset="100%" stop-color="#cad2dc" />
        </linearGradient>

        <radialGradient id="feedSackGrad" cx="38%" cy="30%" r="72%">
          <stop offset="0%" stop-color="#f2d399" />
          <stop offset="58%" stop-color="#d4a660" />
          <stop offset="100%" stop-color="#9e6d30" />
        </radialGradient>

        <linearGradient id="feedRopeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#8f541c" />
          <stop offset="50%" stop-color="#d99a4a" />
          <stop offset="100%" stop-color="#7a4414" />
        </linearGradient>

        <radialGradient id="woolGrad" cx="36%" cy="28%" r="72%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="62%" stop-color="#f7f1e3" />
          <stop offset="100%" stop-color="#d9ceb8" />
        </radialGradient>

        <radialGradient id="cabbageOuter" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stop-color="#a6eb67" />
          <stop offset="55%" stop-color="#52b53e" />
          <stop offset="100%" stop-color="#277324" />
        </radialGradient>

        <radialGradient id="cabbageInner" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#d8fa9b" />
          <stop offset="65%" stop-color="#7fd44c" />
          <stop offset="100%" stop-color="#459c34" />
        </radialGradient>

        <linearGradient id="droolGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d6f7ff" />
          <stop offset="100%" stop-color="#56c7eb" />
        </linearGradient>

        <!-- Yumuşak Gölgeler -->
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#1b3019" flood-opacity="0.28" />
        </filter>
        <filter id="charShadow" x="-25%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#1a2414" flood-opacity="0.3" />
        </filter>
        <filter id="glowRing" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- ==================== 1. GÖKYÜZÜ & GÜNEŞ ==================== -->
      <rect x="-600" y="-400" width="2480" height="720" fill="url(#skyGrad)" />

      <!-- Parlayan Güneş ve Dönen Işınlar -->
      <g transform="translate(640, 92)">
        <circle cx="0" cy="0" r="130" fill="url(#sunGlow)" />
        <g class="sun-rays-spin" opacity="0.34">
          ${Array.from({ length: 12 }, (_, i) =>
            `<polygon points="-7,-56 7,-56 0,-112" fill="#fff3a1" transform="rotate(${i * 30})" />`
          ).join('')}
        </g>
        <circle cx="0" cy="0" r="42" fill="url(#sunDisc)" />
        <ellipse cx="-12" cy="-14" rx="12" ry="7" fill="#ffffff" opacity="0.45" transform="rotate(-24 -12 -14)" />
      </g>

      <!-- Süzülen Gölgeli Bulutlar -->
      <g class="cloud-drift-1" opacity="0.93">
        <g transform="translate(80, 68)">
          <path d="M22,42 Q6,42 6,28 Q6,15 20,14 Q28,-2 48,2 Q64,-6 78,8 Q96,6 102,21 Q116,24 114,36 Q112,44 98,44 Z" fill="#ffffff" />
          <path d="M16,42 Q60,48 104,42 Q112,42 112,35 Q85,37 60,36 Q32,37 12,36 Z" fill="#cfe9fa" />
        </g>
      </g>
      <g class="cloud-drift-2" opacity="0.86">
        <g transform="translate(460, 44) scale(0.82)">
          <path d="M18,40 Q4,40 4,26 Q6,14 22,12 Q32,-4 54,4 Q72,-4 86,12 Q104,12 108,26 Q110,40 94,40 Z" fill="#ffffff" />
          <path d="M14,40 Q54,45 96,40 Q105,39 105,33 Q68,35 12,34 Z" fill="#d3ecfc" />
        </g>
      </g>
      <g class="cloud-drift-3" opacity="0.9">
        <g transform="translate(860, 78) scale(1.08)">
          <path d="M20,42 Q6,42 6,28 Q8,14 24,14 Q34,-2 56,4 Q74,-2 86,12 Q104,14 106,28 Q106,42 90,42 Z" fill="#ffffff" />
          <path d="M14,42 Q55,46 94,42 Q102,40 102,34 Q64,36 12,34 Z" fill="#cde8f9" />
        </g>
      </g>

      <!-- Uzaktaki Kuşlar -->
      <g stroke="#3d6e8f" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.65">
        <path d="M490,118 Q497,111 504,118 Q511,111 518,118" />
        <path d="M528,104 Q533,99 538,104 Q543,99 548,104" />
        <path d="M770,126 Q776,120 782,126 Q788,120 794,126" />
      </g>

      <!-- ==================== 2. UZAK DAĞLAR & TEPELER ==================== -->
      <path d="M-600,260 L0,260 Q140,165 290,222 Q430,152 585,228 Q730,150 905,215 Q1075,148 1280,226 L1880,248 L1880,340 L-600,340 Z" fill="url(#farMtnGrad)" />
      <!-- Dağ Işık Vurguları -->
      <path d="M286,222 Q395,162 470,185 Q420,186 355,228 Z" fill="#ccebf2" opacity="0.45" />
      <path d="M895,212 Q1035,154 1125,180 Q1055,184 965,222 Z" fill="#ccebf2" opacity="0.42" />

      <!-- Orta Plan Tepeler -->
      <path d="M-600,272 L0,268 Q210,205 465,260 Q545,274 585,295 L-600,360 Z" fill="url(#midHillLeft)" />
      <path d="M1880,270 L1280,262 Q1040,198 795,262 Q725,276 695,298 L1880,360 Z" fill="url(#midHillRight)" />

      <!-- Sol Tepede Masalsı Çiftlik Evi -->
      <g transform="translate(178, 198)" filter="url(#softShadow)">
        <!-- Baca ve Duman -->
        <rect x="66" y="6" width="11" height="22" rx="2" fill="#9c543e" />
        <circle cx="72" cy="-2" r="5" fill="#ffffff" opacity="0.55" />
        <circle cx="78" cy="-11" r="7" fill="#ffffff" opacity="0.38" />
        <!-- Ev Duvarı -->
        <rect x="14" y="28" width="70" height="44" rx="3" fill="#fff3d6" stroke="#c9a571" stroke-width="2" />
        <!-- Çatı -->
        <polygon points="4,32 49,4 94,32" fill="#d94f3d" stroke="#992e21" stroke-width="2.2" stroke-linejoin="round" />
        <polygon points="49,4 94,32 82,32 49,12" fill="#b83b2c" opacity="0.5" />
        <!-- Kapı & Pencere -->
        <path d="M40,72 L40,49 Q49,43 58,49 L58,72 Z" fill="#8f5024" />
        <circle cx="53" cy="60" r="1.8" fill="#ffd166" />
        <rect x="22" y="42" width="12" height="12" rx="2" fill="#7fd1f5" stroke="#8f5024" stroke-width="2" />
        <rect x="64" y="42" width="12" height="12" rx="2" fill="#7fd1f5" stroke="#8f5024" stroke-width="2" />
      </g>

      <!-- Sağ Tepede Masalsı Yel Değirmeni -->
      <g transform="translate(996, 178)" filter="url(#softShadow)">
        <!-- Kule -->
        <polygon points="22,86 30,22 52,22 60,86" fill="#f8ecd2" stroke="#bfa074" stroke-width="2" />
        <path d="M24,70 L58,70 M27,48 L55,48" stroke="#dfcaa3" stroke-width="1.5" />
        <path d="M35,86 L35,68 Q41,62 47,68 L47,86 Z" fill="#7d4822" />
        <!-- Kubbe Çatı -->
        <path d="M26,24 Q41,4 56,24 Z" fill="#c94b3b" stroke="#8f2c20" stroke-width="2" />
        <!-- Dönen Kanatlar -->
        <g class="windmill-blades" transform="translate(41, 26)">
          ${[0, 90, 180, 270].map((deg) => `
            <g transform="rotate(${deg})">
              <line x1="0" y1="0" x2="0" y2="-38" stroke="#6e3c1a" stroke-width="3" />
              <rect x="2" y="-36" width="11" height="26" rx="2" fill="#fff7e3" stroke="#b88446" stroke-width="1.5" />
              <line x1="2" y1="-27" x2="13" y2="-27" stroke="#c99c62" stroke-width="1.2" />
              <line x1="2" y1="-18" x2="13" y2="-18" stroke="#c99c62" stroke-width="1.2" />
            </g>
          `).join('')}
          <circle cx="0" cy="0" r="5" fill="#7d4822" stroke="#ffd166" stroke-width="1.8" />
        </g>
      </g>

      <!-- ==================== 3. AKAN NEHİR (DERİNLİK PERSPEKTİFLİ) ==================== -->
      <g id="riverLayer">
        <!-- Ana Nehir Gövdesi -->
        <path d="M582,258 C565,310 470,348 395,418 C345,468 355,565 332,960 L948,960 C925,565 935,468 885,418 C810,348 715,310 698,258 Z" fill="url(#riverGrad)" />

        <!-- Güneş Yansıması -->
        <path d="M604,262 C595,345 555,445 538,678 L742,678 C725,445 685,345 676,262 Z" fill="url(#riverSunShimmer)" />

        <!-- Kıyı Sığlık Parlaması -->
        <path d="M582,262 C565,314 474,352 402,422 C358,468 366,565 356,680" fill="none" stroke="#9cf2ff" stroke-width="10" opacity="0.34" />
        <path d="M698,262 C715,314 806,352 878,422 C922,468 914,565 924,680" fill="none" stroke="#9cf2ff" stroke-width="10" opacity="0.34" />

        <!-- Sürekli Akan Su Çizgileri -->
        <g stroke-linecap="round" fill="none">
          <path d="M620,285 Q605,345 572,415 Q535,500 520,665" stroke="#d9fbff" stroke-width="3.2" opacity="0.58" class="water-flow-slow" />
          <path d="M645,275 Q644,355 642,450 Q640,545 642,670" stroke="#ffffff" stroke-width="3.8" opacity="0.55" class="water-flow-med" />
          <path d="M668,285 Q686,348 718,422 Q755,510 770,665" stroke="#d9fbff" stroke-width="3.2" opacity="0.55" class="water-flow-slow" />
          <path d="M595,318 Q548,376 490,455 Q450,532 440,665" stroke="#95eeff" stroke-width="2.6" opacity="0.52" class="water-flow-fast" />
          <path d="M685,318 Q732,376 790,455 Q830,532 842,665" stroke="#95eeff" stroke-width="2.6" opacity="0.52" class="water-flow-fast" />
          <path d="M630,360 Q615,445 588,560 Q575,615 568,672" stroke="#ffffff" stroke-width="2.2" opacity="0.48" class="water-flow-fast" />
          <path d="M660,365 Q678,452 702,568 Q715,618 724,672" stroke="#ffffff" stroke-width="2.2" opacity="0.48" class="water-flow-med" />
        </g>

        <!-- Nilüfer Yaprakları ve Pembe Çiçekler -->
        <g transform="translate(465, 616)">
          <ellipse cx="0" cy="4" rx="22" ry="9" fill="#0d5370" opacity="0.32" />
          <path d="M0,0 L19,-3 A21,9 0 1,1 14,-7 Z" fill="#46ab48" stroke="#2d7a32" stroke-width="1.5" />
          <path d="M-3,-2 Q-9,-12 -2,-14 Q2,-18 6,-14 Q12,-12 7,-2 Z" fill="#ff94b8" />
          <circle cx="2" cy="-7" r="3" fill="#ffe066" />
        </g>
        <g transform="translate(822, 608) scale(0.9)">
          <ellipse cx="0" cy="4" rx="22" ry="9" fill="#0d5370" opacity="0.32" />
          <path d="M0,0 L-19,-3 A21,9 0 1,0 -14,-7 Z" fill="#52ba4c" stroke="#2d7a32" stroke-width="1.5" />
          <path d="M-4,-2 Q-10,-12 -3,-14 Q1,-18 5,-14 Q11,-12 6,-2 Z" fill="#ffb0cb" />
          <circle cx="1" cy="-7" r="2.8" fill="#ffe066" />
        </g>
      </g>

      <!-- ==================== 4. SOL VE SAĞ ÇAYIR KIYILARI ==================== -->
      <!-- Sol Kıyı Toprak Kesiti -->
      <path d="M-600,335 L0,335 C155,318 320,342 406,408 C430,432 414,492 385,552 C368,595 372,645 352,960 L-600,960 Z" fill="url(#bankSoilLeft)" />
      <!-- Sol Kıyı Çimen Örtüsü -->
      <path d="M-600,318 L0,318 C165,300 326,328 408,392 C425,408 406,465 376,530 C358,576 364,638 342,960 L-600,960 Z" fill="url(#leftBankGrad)" />
      <!-- Sol Kıyı Çimen Işık Katmanı -->
      <path d="M-600,330 L0,330 C130,322 252,340 342,388 C265,412 135,410 -600,398 Z" fill="#b7f071" opacity="0.38" />

      <!-- Sağ Kıyı Toprak Kesiti -->
      <path d="M1880,335 L1280,335 C1125,318 960,342 874,408 C850,432 866,492 895,552 C912,595 908,645 928,960 L1880,960 Z" fill="url(#bankSoilRight)" />
      <!-- Sağ Kıyı Çimen Örtüsü -->
      <path d="M1880,318 L1280,318 C1115,300 954,328 872,392 C855,408 874,465 904,530 C922,576 916,638 938,960 L1880,960 Z" fill="url(#rightBankGrad)" />
      <!-- Sağ Kıyı Çimen Işık Katmanı -->
      <path d="M1880,330 L1280,330 C1150,322 1028,340 938,388 C1015,412 1145,410 1880,398 Z" fill="#c2f27a" opacity="0.38" />

      <!-- Dekoratif Çitler, Taşlar, Çiçekler ve Sazlıklar -->
      <g id="decorLayer">
        <!-- Sol Ahşap Çit -->
        <g transform="translate(26, 336)" stroke="#693e1b" stroke-width="1.5">
          <rect x="0" y="14" width="146" height="6" rx="2" fill="#c99053" />
          <rect x="0" y="28" width="146" height="6" rx="2" fill="#b87d42" />
          ${[8, 42, 76, 110, 140].map((px) =>
            `<path d="M${px},40 L${px},8 L${px + 5},2 L${px + 10},8 L${px + 10},40 Z" fill="#d9a166" />`
          ).join('')}
        </g>

        <!-- Sağ Taş Patika -->
        <g fill="#dfd2b8" stroke="#b09e7e" stroke-width="1.4" opacity="0.88">
          <ellipse cx="1055" cy="366" rx="20" ry="7" />
          <ellipse cx="1088" cy="382" rx="24" ry="8" />
          <ellipse cx="1044" cy="400" rx="22" ry="7" />
          <ellipse cx="1082" cy="422" rx="26" ry="8" />
        </g>

        <!-- Sol Büyük Meşe Ağacı -->
        <g transform="translate(18, 178)" filter="url(#softShadow)">
          <ellipse cx="52" cy="214" rx="54" ry="13" fill="#235720" opacity="0.35" />
          <path d="M36,214 Q42,165 38,118 L64,118 Q60,165 72,214 Z" fill="url(#trunkGrad)" />
          <path d="M46,154 Q26,136 16,120" stroke="#6b3f1d" stroke-width="8" stroke-linecap="round" fill="none" />
          <g class="tree-sway">
            <circle cx="22" cy="108" r="42" fill="url(#foliageDeep)" />
            <circle cx="82" cy="104" r="44" fill="url(#foliageDeep)" />
            <circle cx="52" cy="64" r="50" fill="url(#foliageBright)" />
            <circle cx="14" cy="78" r="32" fill="url(#foliageBright)" />
            <circle cx="92" cy="76" r="34" fill="url(#foliageBright)" />
            <circle cx="48" cy="96" r="38" fill="url(#foliageBright)" />
            <!-- Ağaçta minik parlak yaprak vurguları -->
            <ellipse cx="38" cy="44" rx="16" ry="9" fill="#c7f783" opacity="0.45" />
          </g>
        </g>

        <!-- Sağ Büyük Elma Ağacı -->
        <g transform="translate(1152, 184)" filter="url(#softShadow)">
          <ellipse cx="56" cy="210" rx="54" ry="13" fill="#235720" opacity="0.35" />
          <path d="M40,210 Q46,162 42,114 L68,114 Q64,162 76,210 Z" fill="url(#trunkGrad)" />
          <g class="tree-sway">
            <circle cx="24" cy="104" r="42" fill="url(#foliageDeep)" />
            <circle cx="86" cy="106" r="44" fill="url(#foliageDeep)" />
            <circle cx="56" cy="62" r="50" fill="url(#foliageBright)" />
            <circle cx="20" cy="72" r="33" fill="url(#foliageBright)" />
            <circle cx="94" cy="76" r="33" fill="url(#foliageBright)" />
            <circle cx="54" cy="96" r="38" fill="url(#foliageBright)" />
            <!-- Kırmızı Elmalar -->
            <circle cx="32" cy="84" r="6" fill="#e8433e" />
            <circle cx="30" cy="82" r="2" fill="#ffa8a4" />
            <circle cx="72" cy="68" r="6" fill="#e8433e" />
            <circle cx="70" cy="66" r="2" fill="#ffa8a4" />
            <circle cx="86" cy="102" r="5.5" fill="#e8433e" />
            <circle cx="48" cy="112" r="5.5" fill="#e8433e" />
          </g>
        </g>

        <!-- Çalılar ve Kır Çiçekleri -->
        ${buildFlowerCluster(66, 594)}
        ${buildFlowerCluster(254, 412)}
        ${buildFlowerCluster(292, 592)}
        ${buildFlowerCluster(974, 592)}
        ${buildFlowerCluster(1018, 410)}
        ${buildFlowerCluster(1196, 588)}

        <!-- Nehir Kenarı Sazlıklar (Sol) -->
        <g transform="translate(362, 578)" class="reed-sway">
          <path d="M0,40 Q-10,12 -14,-18" stroke="#367a34" stroke-width="4" fill="none" stroke-linecap="round" />
          <path d="M8,40 Q4,8 8,-26" stroke="#2d6e2d" stroke-width="4" fill="none" stroke-linecap="round" />
          <path d="M16,40 Q22,14 28,-12" stroke="#48913d" stroke-width="3.5" fill="none" stroke-linecap="round" />
          <rect x="4" y="-32" width="8" height="20" rx="4" fill="#6b3e1b" />
          <rect x="-18" y="-22" width="7" height="16" rx="3.5" fill="#7d4a22" />
        </g>

        <!-- Nehir Kenarı Sazlıklar (Sağ) -->
        <g transform="translate(906, 576)" class="reed-sway-alt">
          <path d="M0,40 Q-8,12 -16,-14" stroke="#48913d" stroke-width="3.5" fill="none" stroke-linecap="round" />
          <path d="M8,40 Q6,8 4,-26" stroke="#2d6e2d" stroke-width="4" fill="none" stroke-linecap="round" />
          <path d="M16,40 Q24,14 26,-16" stroke="#367a34" stroke-width="4" fill="none" stroke-linecap="round" />
          <rect x="0" y="-32" width="8" height="20" rx="4" fill="#6b3e1b" />
          <rect x="22" y="-20" width="7" height="16" rx="3.5" fill="#7d4a22" />
        </g>

        <!-- Kıyı Taşları -->
        <g fill="#8f989e" stroke="#5b646b" stroke-width="1.6">
          <ellipse cx="386" cy="436" rx="15" ry="9" />
          <ellipse cx="400" cy="442" rx="9" ry="6" fill="#a7b0b5" />
          <ellipse cx="892" cy="438" rx="15" ry="9" />
          <ellipse cx="878" cy="444" rx="9" ry="6" fill="#a7b0b5" />
        </g>
      </g>

      <!-- ==================== 5. AHŞAP İSKELELER (SOL & SAĞ) ==================== -->
      <!-- Sol Ahşap İskele -->
      <g id="leftPier" filter="url(#softShadow)">
        <!-- Su Altı Kazık Yansımaları -->
        <rect x="336" y="538" width="12" height="24" rx="4" fill="#0d4e68" opacity="0.28" />
        <rect x="382" y="538" width="13" height="26" rx="4" fill="#0d4e68" opacity="0.32" />
        <!-- Kazıklar -->
        <rect x="334" y="486" width="14" height="58" rx="4" fill="url(#woodPost)" stroke="#47260d" stroke-width="1.6" />
        <rect x="380" y="484" width="15" height="62" rx="4" fill="url(#woodPost)" stroke="#47260d" stroke-width="1.6" />
        <!-- İskele Gövde Destek Kirişi -->
        <rect x="296" y="514" width="106" height="11" rx="3" fill="#6b3b18" />
        <!-- Ahşap Kalaslar -->
        ${[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 294 + i * 18;
          return `
            <rect x="${x}" y="494" width="16" height="26" rx="3" fill="url(#woodPlank)" stroke="#5c3213" stroke-width="1.4" />
            <circle cx="${x + 8}" cy="500" r="1.5" fill="#4a260b" />
            <circle cx="${x + 8}" cy="514" r="1.5" fill="#4a260b" />
          `;
        }).join('')}
        <!-- Bağlama Babası & Halat -->
        <rect x="382" y="476" width="13" height="20" rx="4" fill="url(#woodPost)" stroke="#47260d" stroke-width="1.5" />
        <ellipse cx="388.5" cy="489" rx="9" ry="4" fill="none" stroke="#e6c48a" stroke-width="3" />
        <ellipse cx="388.5" cy="493" rx="9" ry="3.5" fill="none" stroke="#d1ab6d" stroke-width="2.5" />
        <!-- İskele Kıyısı Su Dalgaları -->
        <ellipse cx="388" cy="544" rx="18" ry="4.5" fill="none" stroke="#c8f6ff" stroke-width="2" opacity="0.65" />
      </g>

      <!-- Sağ Ahşap İskele -->
      <g id="rightPier" filter="url(#softShadow)">
        <rect x="885" y="538" width="13" height="26" rx="4" fill="#0d4e68" opacity="0.32" />
        <rect x="932" y="538" width="12" height="24" rx="4" fill="#0d4e68" opacity="0.28" />
        <rect x="885" y="484" width="15" height="62" rx="4" fill="url(#woodPost)" stroke="#47260d" stroke-width="1.6" />
        <rect x="932" y="486" width="14" height="58" rx="4" fill="url(#woodPost)" stroke="#47260d" stroke-width="1.6" />
        <rect x="878" y="514" width="106" height="11" rx="3" fill="#6b3b18" />
        ${[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 878 + i * 18;
          return `
            <rect x="${x}" y="494" width="16" height="26" rx="3" fill="url(#woodPlank)" stroke="#5c3213" stroke-width="1.4" />
            <circle cx="${x + 8}" cy="500" r="1.5" fill="#4a260b" />
            <circle cx="${x + 8}" cy="514" r="1.5" fill="#4a260b" />
          `;
        }).join('')}
        <rect x="885" y="476" width="13" height="20" rx="4" fill="url(#woodPost)" stroke="#47260d" stroke-width="1.5" />
        <ellipse cx="891.5" cy="489" rx="9" ry="4" fill="none" stroke="#e6c48a" stroke-width="3" />
        <ellipse cx="891.5" cy="493" rx="9" ry="3.5" fill="none" stroke="#d1ab6d" stroke-width="2.5" />
        <ellipse cx="892" cy="544" rx="18" ry="4.5" fill="none" stroke="#c8f6ff" stroke-width="2" opacity="0.65" />
      </g>

      <!-- ==================== 6. SANDAL ARKA KATMAN ==================== -->
      <g id="boatBackGroup" transform="translate(492, 514)" pointer-events="none">
        <g id="boatBackShake">
          <!-- Su Altı Gölge ve Dalga Halkası -->
          <ellipse cx="0" cy="34" rx="96" ry="16" fill="#0b4b66" opacity="0.34" />
          <ellipse cx="0" cy="34" rx="104" ry="18" fill="none" stroke="#c8f6ff" stroke-width="2.4" opacity="0.58" />
          <!-- Sandal İç Gövdesi -->
          <path d="M-86,-4 C-64,-18 64,-18 86,-4 L72,26 C40,36 -40,36 -72,26 Z" fill="url(#boatHullInner)" stroke="#42200a" stroke-width="2" />
          <!-- Oturma Sıraları -->
          <rect x="-60" y="-4" width="38" height="10" rx="3" fill="url(#woodPlank)" stroke="#4f290e" stroke-width="1.5" />
          <rect x="-14" y="-4" width="28" height="10" rx="3" fill="url(#woodPlank)" stroke="#4f290e" stroke-width="1.5" />
          <rect x="22" y="-4" width="38" height="10" rx="3" fill="url(#woodPlank)" stroke="#4f290e" stroke-width="1.5" />
          <!-- Koltuk İpucu Noktaları (Seviyeye göre güncellenir) -->
          <g id="boatSeatHints" opacity="0.72">
            <g id="seatHintCaptain">
              <circle cx="-37" cy="-16" r="10" fill="#fff4d2" stroke="#d49017" stroke-width="2" stroke-dasharray="3 2" />
              <text x="-37" y="-12" text-anchor="middle" font-size="11" font-weight="800" fill="#8f5406">🧑‍🌾</text>
            </g>
            <g id="seatHintP1">
              <circle cx="37" cy="-16" r="10" fill="#e6fbf4" stroke="#22a06b" stroke-width="2" stroke-dasharray="3 2" />
              <text x="37" y="-12" text-anchor="middle" font-size="11" font-weight="800" fill="#166e48">+</text>
            </g>
            <g id="seatHintP2" style="display:none">
              <circle cx="48" cy="-16" r="10" fill="#e6fbf4" stroke="#22a06b" stroke-width="2" stroke-dasharray="3 2" />
              <text x="48" y="-12" text-anchor="middle" font-size="11" font-weight="800" fill="#166e48">+</text>
            </g>
          </g>
        </g>
      </g>

      <!-- ==================== 7. KARAKTERLER KATMANI ==================== -->
      <g id="charactersLayer">
        ${buildCharactersForLevel(1)}
      </g>

      <!-- ==================== 8. SANDAL ÖN KATMAN & KÜREK ==================== -->
      <g id="boatFrontGroup" transform="translate(492, 514)" pointer-events="none">
        <g id="boatFrontShake">
          <!-- Sandal Ön Dış Ahşap Gövde -->
          <path d="M-90,-2 C-58,10 58,10 90,-2 L74,28 C44,40 -44,40 -74,28 Z" fill="url(#boatHullOuter)" stroke="#4a240a" stroke-width="2.4" stroke-linejoin="round" />
          <!-- Ahşap Kalas Çizgileri -->
          <path d="M-82,11 C-48,22 48,22 82,11" fill="none" stroke="#5e2e0d" stroke-width="2" opacity="0.7" />
          <path d="M-76,21 C-44,32 44,32 76,21" fill="none" stroke="#472108" stroke-width="2" opacity="0.65" />
          <!-- Üst Küpeşte Şeridi -->
          <path d="M-92,-3 C-58,9 58,9 92,-3 C94,2 90,6 86,6 C54,16 -54,16 -86,6 C-90,6 -94,2 -92,-3 Z" fill="url(#boatRim)" stroke="#5c3111" stroke-width="2" />
          <!-- Baş ve Kıç Dekoratif Süsleme -->
          <circle cx="-68" cy="14" r="3" fill="#ffd166" />
          <circle cx="68" cy="14" r="3" fill="#ffd166" />
          <!-- Kürek (Karşıya geçerken animasyonla sallanır) -->
          <g id="boatOar" transform="translate(-14, 7) rotate(-18)">
            <rect x="-3" y="-22" width="6" height="58" rx="3" fill="#d99c57" stroke="#5c3111" stroke-width="1.6" />
            <path d="M-8,30 C-10,44 -6,54 0,55 C6,54 10,44 8,30 Z" fill="#b86c29" stroke="#5c3111" stroke-width="1.6" />
          </g>
          <!-- Su Köpüğü Ön Çizgi -->
          <path d="M-66,34 Q-25,40 0,38 Q25,40 66,34" fill="none" stroke="#e4fbff" stroke-width="2.6" stroke-linecap="round" opacity="0.72" />

          <!-- Seviye 3: Sandalın Üzerinde Canlı Ağırlık Kapasite Barı -->
          <g id="boatWeightBar" transform="translate(0, -142)" style="display:none">
            <rect x="-74" y="-18" width="148" height="34" rx="12" fill="rgba(255, 251, 240, 0.96)" stroke="#b88446" stroke-width="2.2" filter="url(#softShadow)" />
            <text id="boatWeightText" x="0" y="-3" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="12.5" font-weight="700" fill="#4a2b10">⚖️ 0 / 100 kg</text>
            <rect x="-60" y="4" width="120" height="7" rx="3.5" fill="#e6d4b3" />
            <rect id="boatWeightFillRect" x="-60" y="4" width="0" height="7" rx="3.5" fill="#22a06b" />
          </g>
        </g>
      </g>
    `;
  }

  function buildCharactersForLevel(levelId) {
    if (levelId === 2) {
      return [
        buildWolfSVG({ id: 'wolf1', label: 'Kurt 1', variant: 1, x: 92, y: 446 }),
        buildWolfSVG({ id: 'wolf2', label: 'Kurt 2', variant: 2, x: 184, y: 454 }),
        buildSheepSVG({ id: 'sheep1', label: 'Kuzu 1', variant: 1, x: 108, y: 544 }),
        buildSheepSVG({ id: 'sheep2', label: 'Kuzu 2', variant: 2, x: 212, y: 546 }),
        buildFarmerSVG({ id: 'farmer', label: 'Çiftçi', x: 312, y: 472 })
      ].join('');
    }
    if (levelId === 3) {
      return [
        buildWolfSVG({ id: 'wolf', label: 'Kurt', variant: 1, weight: 30, x: 96, y: 444 }),
        buildSheepSVG({ id: 'sheep', label: 'Kuzu', variant: 1, weight: 20, x: 204, y: 468 }),
        buildFeedSackSVG({ id: 'feed', label: 'Yem Çuvalı', weight: 40, x: 102, y: 546 }),
        buildCabbageSVG({ id: 'cabbage', label: 'Lahana', weight: 10, x: 212, y: 554 }),
        buildFarmerSVG({ id: 'farmer', label: 'Çiftçi', weight: 60, x: 314, y: 470 })
      ].join('');
    }
    // Seviye 1: Klasik Kurt, Kuzu ve Lahana (aynen korunur)
    return [
      buildWolfSVG({ id: 'wolf', label: 'Kurt', variant: 1, x: 108, y: 458 }),
      buildSheepSVG({ id: 'sheep', label: 'Kuzu', variant: 1, x: 215, y: 496 }),
      buildCabbageSVG({ id: 'cabbage', label: 'Lahana', x: 148, y: 556 }),
      buildFarmerSVG({ id: 'farmer', label: 'Çiftçi', x: 315, y: 468 })
    ].join('');
  }

  function buildWeightBadge(weight, yOffset) {
    if (!weight) return '';
    return `
      <g class="char-weight-badge" transform="translate(0, ${yOffset})">
        <rect x="-25" y="-9" width="50" height="17" rx="8.5" fill="#fff2cc" stroke="#d49017" stroke-width="1.5" />
        <text x="0" y="3" text-anchor="middle" font-family="Nunito, sans-serif" font-size="11" font-weight="900" fill="#7a4700">${weight} kg</text>
      </g>
    `;
  }

  function buildFlowerCluster(cx, cy) {
    return `
      <g transform="translate(${cx}, ${cy})">
        <path d="M-12,10 Q-14,0 -18,-6 M0,10 Q0,-2 2,-10 M12,10 Q15,2 19,-4" stroke="#2f7d2e" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <g transform="translate(-18, -7)">
          <circle cx="-3" cy="0" r="3.4" fill="#ffffff" />
          <circle cx="3" cy="0" r="3.4" fill="#ffffff" />
          <circle cx="0" cy="-3" r="3.4" fill="#ffffff" />
          <circle cx="0" cy="3" r="3.4" fill="#ffffff" />
          <circle cx="0" cy="0" r="2.5" fill="#ffc933" />
        </g>
        <g transform="translate(2, -11)">
          <circle cx="-3.5" cy="0" r="3.8" fill="#ff9ebb" />
          <circle cx="3.5" cy="0" r="3.8" fill="#ff9ebb" />
          <circle cx="0" cy="-3.5" r="3.8" fill="#ff9ebb" />
          <circle cx="0" cy="3.5" r="3.8" fill="#ff9ebb" />
          <circle cx="0" cy="0" r="2.6" fill="#ffe169" />
        </g>
        <g transform="translate(19, -5)">
          <circle cx="-3" cy="0" r="3.2" fill="#ffe66d" />
          <circle cx="3" cy="0" r="3.2" fill="#ffe66d" />
          <circle cx="0" cy="-3" r="3.2" fill="#ffe66d" />
          <circle cx="0" cy="3" r="3.2" fill="#ffe66d" />
          <circle cx="0" cy="0" r="2.2" fill="#f08030" />
        </g>
      </g>
    `;
  }

  /* ==================== KARAKTER 1: ÇİFTÇİ ==================== */
  function buildFarmerSVG(opts) {
    const o = Object.assign({ id: 'farmer', label: 'Çiftçi', weight: 0, x: 315, y: 468 }, opts);
    const aria = o.weight ? `${o.label} (${o.weight} kg)` : o.label;
    return `
      <g id="char-${o.id}" class="character-node" data-char="${o.id}" transform="translate(${o.x}, ${o.y})" role="button" tabindex="0" aria-label="${aria}">
        <!-- Zemin Gölgesi -->
        <ellipse class="char-ground-shadow" cx="0" cy="8" rx="34" ry="10" fill="#1b4018" opacity="0.32" />
        <!-- Seçim / Hover Parlama Halkası -->
        <ellipse class="hover-ring" cx="0" cy="8" rx="40" ry="14" fill="none" stroke="#ffe169" stroke-width="4" filter="url(#glowRing)" />

        <g class="char-body-wrap" filter="url(#charShadow)">
          <g class="char-idle">
            <!-- Çizmeler -->
            <ellipse cx="-12" cy="4" rx="11" ry="6.5" fill="#593216" stroke="#361c09" stroke-width="2" />
            <ellipse cx="12" cy="4" rx="11" ry="6.5" fill="#593216" stroke="#361c09" stroke-width="2" />

            <!-- Gövde: Kareli/Çizgili Gömlek + Kot Tulum -->
            <path d="M-21,-52 C-24,-34 -23,-14 -19,0 L19,0 C23,-14 24,-34 21,-52 Z" fill="url(#shirtGrad)" stroke="#7a2514" stroke-width="2.2" />
            <!-- Kollar -->
            <path d="M-20,-48 C-34,-38 -36,-22 -28,-14" fill="none" stroke="#e85838" stroke-width="11" stroke-linecap="round" />
            <path d="M20,-48 C34,-38 36,-22 28,-14" fill="none" stroke="#e85838" stroke-width="11" stroke-linecap="round" />
            <circle cx="-28" cy="-14" r="6" fill="url(#skinGrad)" stroke="#a86d45" stroke-width="1.6" />
            <circle cx="28" cy="-14" r="6" fill="url(#skinGrad)" stroke="#a86d45" stroke-width="1.6" />

            <!-- Kot Tulum -->
            <path d="M-19,-32 L19,-32 L20,0 L4,0 L4,-10 L-4,-10 L-4,0 L-20,0 Z" fill="url(#denimGrad)" stroke="#1b3a66" stroke-width="2" stroke-linejoin="round" />
            <!-- Tulum Askıları ve Düğmeleri -->
            <rect x="-15" y="-52" width="6.5" height="23" rx="2" fill="url(#denimGrad)" stroke="#1b3a66" stroke-width="1.5" />
            <rect x="8.5" y="-52" width="6.5" height="23" rx="2" fill="url(#denimGrad)" stroke="#1b3a66" stroke-width="1.5" />
            <circle cx="-11.8" cy="-33" r="2.8" fill="#ffd166" stroke="#996408" stroke-width="1" />
            <circle cx="11.8" cy="-33" r="2.8" fill="#ffd166" stroke="#996408" stroke-width="1" />
            <!-- Ön Cep -->
            <path d="M-9,-27 L9,-27 L9,-17 Q0,-12 -9,-17 Z" fill="#2a5996" stroke="#1b3a66" stroke-width="1.5" />

            <!-- Boyun & Kafa -->
            <rect x="-7" y="-60" width="14" height="10" rx="4" fill="url(#skinGrad)" />
            <circle cx="-23" cy="-76" r="6" fill="url(#skinGrad)" stroke="#b57a52" stroke-width="1.6" />
            <circle cx="23" cy="-76" r="6" fill="url(#skinGrad)" stroke="#b57a52" stroke-width="1.6" />
            <ellipse cx="0" cy="-78" rx="23" ry="22" fill="url(#skinGrad)" stroke="#b57a52" stroke-width="2" />

            <!-- Yanak Kızarıklığı -->
            <ellipse cx="-13" cy="-72" rx="5.5" ry="3.2" fill="#ff8f8f" opacity="0.55" />
            <ellipse cx="13" cy="-72" rx="5.5" ry="3.2" fill="#ff8f8f" opacity="0.55" />

            <!-- Gözler -->
            <g class="eye-blink">
              <circle cx="-8.5" cy="-80" r="3.6" fill="#2b1e16" />
              <circle cx="-7.3" cy="-81.4" r="1.3" fill="#ffffff" />
              <circle cx="8.5" cy="-80" r="3.6" fill="#2b1e16" />
              <circle cx="9.7" cy="-81.4" r="1.3" fill="#ffffff" />
            </g>
            <!-- Kaşlar -->
            <path d="M-14,-88 Q-8.5,-91 -4,-87" fill="none" stroke="#6b3e1b" stroke-width="2.4" stroke-linecap="round" />
            <path d="M4,-87 Q8.5,-91 14,-88" fill="none" stroke="#6b3e1b" stroke-width="2.4" stroke-linecap="round" />

            <!-- Burun, Bıyık ve Gülümseme -->
            <ellipse cx="0" cy="-75" rx="3.4" ry="2.5" fill="#e69e73" />
            <path d="M-12,-68 Q-5,-73 0,-69 Q5,-73 12,-68 Q6,-64 0,-66 Q-6,-64 -12,-68 Z" fill="#7d4822" />
            <path class="farmer-mouth-happy" d="M-7,-64 Q0,-58 7,-64" fill="none" stroke="#6e2c1b" stroke-width="2.4" stroke-linecap="round" />

            <!-- Hasır Şapka -->
            <ellipse cx="0" cy="-94" rx="37" ry="10" fill="url(#strawHatGrad)" stroke="#9e6a14" stroke-width="2.2" />
            <path d="M-21,-95 C-20,-116 20,-116 21,-95 Z" fill="url(#strawHatGrad)" stroke="#9e6a14" stroke-width="2.2" />
            <!-- Şapka Kırmızı Kurdele -->
            <path d="M-21,-96 Q0,-90 21,-96 L20,-102 Q0,-97 -20,-102 Z" fill="#d93b3b" stroke="#8c1d1d" stroke-width="1.4" />
            <!-- Hasır Dokusu -->
            <path d="M-26,-93 Q0,-88 26,-93" fill="none" stroke="#c48a1e" stroke-width="1.3" stroke-dasharray="5 4" />
          </g>
        </g>

        <!-- İsim Etiketi & Ağırlık -->
        <g class="char-label" transform="translate(0, 26)">
          <rect x="-32" y="-12" width="64" height="22" rx="11" fill="rgba(255, 250, 238, 0.92)" stroke="#c69a5a" stroke-width="1.8" />
          <text x="0" y="3" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="13" font-weight="700" fill="#4a2b10">${o.label}</text>
        </g>
        ${buildWeightBadge(o.weight, 47)}

        <!-- Konuşma Balonu -->
        <g class="speech-bubble" id="bubble-${o.id}" transform="translate(0, -130)">
          <rect x="-66" y="-26" width="132" height="32" rx="14" fill="#ffffff" stroke="#d49017" stroke-width="2.4" />
          <polygon points="-7,5 7,5 0,14" fill="#ffffff" stroke="#d49017" stroke-width="2.2" />
          <rect x="-9" y="2" width="18" height="5" fill="#ffffff" />
          <text class="bubble-text" x="0" y="-6" text-anchor="middle" font-family="Nunito, sans-serif" font-size="12.5" font-weight="800" fill="#5c3310">Hadi geçelim!</text>
        </g>
      </g>
    `;
  }

  /* ==================== KARAKTER 2: KURT (1 & 2) ==================== */
  function buildWolfSVG(opts) {
    const o = Object.assign({ id: 'wolf', label: 'Kurt', variant: 1, weight: 0, x: 108, y: 458 }, opts);
    const furGrad = o.variant === 2 ? 'url(#wolf2FurGrad)' : 'url(#wolfFurGrad)';
    const pawFill = o.variant === 2 ? '#343b47' : '#445061';
    const showBandana = o.id === 'wolf1' || o.id === 'wolf2';
    const bandanaColor = o.variant === 2 ? '#2980b9' : '#d97706';
    const bandanaStroke = o.variant === 2 ? '#1a5276' : '#92400e';
    const labelW = o.label.length > 5 ? 68 : 60;
    const aria = o.weight ? `${o.label} (${o.weight} kg)` : o.label;

    return `
      <g id="char-${o.id}" class="character-node" data-char="${o.id}" transform="translate(${o.x}, ${o.y})" role="button" tabindex="0" aria-label="${aria}">
        <ellipse class="char-ground-shadow" cx="0" cy="8" rx="34" ry="10" fill="#1b4018" opacity="0.32" />
        <ellipse class="hover-ring" cx="0" cy="8" rx="40" ry="14" fill="none" stroke="#ffe169" stroke-width="4" filter="url(#glowRing)" />

        <g class="char-body-wrap" filter="url(#charShadow)">
          <g class="char-idle">
            <!-- Kabarık Kuyruk -->
            <g class="wolf-tail">
              <path d="M-18,-16 C-44,-22 -52,-48 -36,-56 C-24,-62 -16,-44 -14,-28 Z" fill="${furGrad}" stroke="#2e3845" stroke-width="2.2" />
              <path d="M-40,-54 C-32,-58 -24,-50 -24,-40 C-32,-42 -39,-47 -40,-54 Z" fill="#f0f4f8" />
            </g>

            <!-- Arka Patiler -->
            <ellipse cx="-16" cy="4" rx="10" ry="6" fill="${pawFill}" stroke="#2a3340" stroke-width="2" />
            <ellipse cx="16" cy="4" rx="10" ry="6" fill="${pawFill}" stroke="#2a3340" stroke-width="2" />

            <!-- Gövde -->
            <path d="M-23,-48 C-28,-24 -24,-6 -16,3 L16,3 C24,-6 28,-24 23,-48 Z" fill="${furGrad}" stroke="#2e3845" stroke-width="2.2" />
            <!-- Açık Renkli Göğüs Kürkü -->
            <path d="M-12,-42 C-16,-24 -12,-8 0,-4 C12,-8 16,-24 12,-42 Q0,-36 -12,-42 Z" fill="url(#wolfBellyGrad)" />
            <!-- Seviye 2'de Kurt 1 / Kurt 2 ayrım bandanası -->
            ${showBandana ? `
              <path d="M-16,-47 Q0,-40 16,-47 L12,-39 L0,-31 L-12,-39 Z" fill="${bandanaColor}" stroke="${bandanaStroke}" stroke-width="1.6" stroke-linejoin="round" />
              <text x="0" y="-37" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="10" font-weight="700" fill="#ffffff">${o.variant}</text>
            ` : ''}
            <!-- Ön Patiler -->
            <path d="M-14,-20 L-10,4 M14,-20 L10,4" stroke="#2e3845" stroke-width="2" />
            <ellipse cx="-9" cy="5" rx="7.5" ry="5" fill="#e2e8f0" stroke="#2e3845" stroke-width="1.8" />
            <ellipse cx="9" cy="5" rx="7.5" ry="5" fill="#e2e8f0" stroke="#2e3845" stroke-width="1.8" />

            <!-- Sivri Kulaklar -->
            <polygon points="-22,-78 -30,-108 -6,-92" fill="${furGrad}" stroke="#2e3845" stroke-width="2.2" stroke-linejoin="round" />
            <polygon points="-20,-83 -25,-100 -11,-90" fill="#f2a0a8" />
            <polygon points="22,-78 30,-108 6,-92" fill="${furGrad}" stroke="#2e3845" stroke-width="2.2" stroke-linejoin="round" />
            <polygon points="20,-83 25,-100 11,-90" fill="#f2a0a8" />

            <!-- Kafa -->
            <path d="M-26,-74 C-28,-94 -12,-102 0,-102 C12,-102 28,-94 26,-74 C30,-64 20,-50 0,-48 C-20,-50 -30,-64 -26,-74 Z" fill="${furGrad}" stroke="#2e3845" stroke-width="2.2" />
            <!-- Yanak Tüy Tutamları & Ağız Bölgesi -->
            <path d="M-21,-65 C-14,-74 14,-74 21,-65 C18,-52 10,-48 0,-48 C-10,-48 -18,-52 -21,-65 Z" fill="url(#wolfBellyGrad)" />

            <!-- İfadeli Kehribar Gözler -->
            <g class="eye-blink">
              <ellipse cx="-10" cy="-77" rx="5.5" ry="6" fill="#ffd166" stroke="#2e3845" stroke-width="1.6" />
              <circle cx="-9" cy="-77" r="2.7" fill="#1e242b" />
              <circle cx="-7.8" cy="-78.6" r="1.1" fill="#ffffff" />
              <ellipse cx="10" cy="-77" rx="5.5" ry="6" fill="#ffd166" stroke="#2e3845" stroke-width="1.6" />
              <circle cx="9" cy="-77" r="2.7" fill="#1e242b" />
              <circle cx="10.2" cy="-78.6" r="1.1" fill="#ffffff" />
            </g>
            <!-- Yaramaz Kaşlar -->
            <path d="M-17,-86 L-5,-82" stroke="#2a3340" stroke-width="2.8" stroke-linecap="round" />
            <path d="M17,-86 L5,-82" stroke="#2a3340" stroke-width="2.8" stroke-linecap="round" />

            <!-- Burun & Sırıtış -->
            <ellipse cx="0" cy="-66" rx="6.5" ry="4.5" fill="#1e242b" />
            <ellipse cx="-2" cy="-67.5" rx="2" ry="1.2" fill="#8b99ab" />
            <path d="M-11,-57 Q0,-51 11,-57" fill="none" stroke="#2a3340" stroke-width="2.3" stroke-linecap="round" />
            <!-- Minik Sivri Dişler -->
            <polygon points="-7,-55 -4.5,-50 -2,-54" fill="#ffffff" stroke="#2a3340" stroke-width="1" />
            <polygon points="7,-55 4.5,-50 2,-54" fill="#ffffff" stroke="#2a3340" stroke-width="1" />

            <!-- Açlık Mikro Animasyonu: Dil & Salya Damlaları -->
            <g class="wolf-hungry-extras">
              <path class="drool-drop drool-drop-1" d="M2,-53 C8,-53 9,-41 3,-41 C-2,-41 -2,-53 2,-53 Z" fill="#ff6b81" stroke="#b82c42" stroke-width="1.4" />
              <path class="drool-drop drool-drop-1" d="M-7,-50 Q-11,-42 -7,-38 Q-3,-42 -7,-50 Z" fill="url(#droolGrad)" stroke="#2f9ec4" stroke-width="1.2" />
              <path class="drool-drop drool-drop-2" d="M9,-49 Q5,-40 9,-36 Q13,-40 9,-49 Z" fill="url(#droolGrad)" stroke="#2f9ec4" stroke-width="1.2" />
            </g>
          </g>
        </g>

        <g class="char-label" transform="translate(0, 26)">
          <rect x="${-labelW / 2}" y="-12" width="${labelW}" height="22" rx="11" fill="rgba(255, 250, 238, 0.92)" stroke="#c69a5a" stroke-width="1.8" />
          <text x="0" y="3" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="13" font-weight="700" fill="#4a2b10">${o.label}</text>
        </g>
        ${buildWeightBadge(o.weight, 47)}

        <g class="speech-bubble" id="bubble-${o.id}" transform="translate(0, -124)">
          <rect x="-74" y="-26" width="148" height="32" rx="14" fill="#fff5f5" stroke="#e14d57" stroke-width="2.4" />
          <polygon points="-7,5 7,5 0,14" fill="#fff5f5" stroke="#e14d57" stroke-width="2.2" />
          <rect x="-9" y="2" width="18" height="5" fill="#fff5f5" />
          <text class="bubble-text" x="0" y="-6" text-anchor="middle" font-family="Nunito, sans-serif" font-size="12.5" font-weight="800" fill="#9c1824">Mmmm, nefis kuzu! 😋</text>
        </g>
      </g>
    `;
  }

  /* ==================== KARAKTER 3: KUZU (1 & 2) ==================== */
  function buildSheepSVG(opts) {
    const o = Object.assign({ id: 'sheep', label: 'Kuzu', variant: 1, weight: 0, x: 215, y: 496 }, opts);
    const collarColor = o.variant === 2 ? '#2998d6' : '#e64545';
    const labelW = o.label.length > 5 ? 68 : 60;
    const aria = o.weight ? `${o.label} (${o.weight} kg)` : o.label;

    return `
      <g id="char-${o.id}" class="character-node" data-char="${o.id}" transform="translate(${o.x}, ${o.y})" role="button" tabindex="0" aria-label="${aria}">
        <ellipse class="char-ground-shadow" cx="0" cy="8" rx="34" ry="10" fill="#1b4018" opacity="0.32" />
        <ellipse class="hover-ring" cx="0" cy="8" rx="40" ry="14" fill="none" stroke="#ffe169" stroke-width="4" filter="url(#glowRing)" />

        <g class="char-body-wrap" filter="url(#charShadow)">
          <g class="char-idle">
            <!-- Bacaklar ve Toynaklar -->
            <rect x="-18" y="-16" width="8" height="22" rx="4" fill="#4a3e37" />
            <rect x="-6" y="-14" width="8" height="20" rx="4" fill="#3a302a" />
            <rect x="6" y="-14" width="8" height="20" rx="4" fill="#3a302a" />
            <rect x="16" y="-16" width="8" height="22" rx="4" fill="#4a3e37" />

            <!-- Kabarık Bulut Gibi Yün Gövde -->
            <g fill="url(#woolGrad)" stroke="#c2b49d" stroke-width="2">
              <circle cx="-20" cy="-34" r="16" />
              <circle cx="20" cy="-34" r="16" />
              <circle cx="-12" cy="-50" r="16" />
              <circle cx="12" cy="-50" r="16" />
              <circle cx="0" cy="-28" r="18" />
              <circle cx="0" cy="-44" r="19" />
            </g>
            <!-- Yün İç Yumuşatma -->
            <ellipse cx="0" cy="-39" rx="24" ry="18" fill="url(#woolGrad)" />

            <!-- Tasma & Altın Çıngırak -->
            <path d="M-12,-46 Q0,-38 12,-46" fill="none" stroke="${collarColor}" stroke-width="4.5" stroke-linecap="round" />
            <circle cx="0" cy="-38" r="5" fill="#ffd166" stroke="#b8780b" stroke-width="1.5" />
            <circle cx="0" cy="-37" r="1.5" fill="#8f5406" />

            <!-- Sarkık Sevimli Kulaklar -->
            <ellipse cx="-24" cy="-64" rx="11" ry="6" fill="#4a3e37" stroke="#2e2520" stroke-width="1.8" transform="rotate(-24 -24 -64)" />
            <ellipse cx="-24" cy="-64" rx="7" ry="3.2" fill="#f7b2be" transform="rotate(-24 -24 -64)" />
            <ellipse cx="24" cy="-64" rx="11" ry="6" fill="#4a3e37" stroke="#2e2520" stroke-width="1.8" transform="rotate(24 24 -64)" />
            <ellipse cx="24" cy="-64" rx="7" ry="3.2" fill="#f7b2be" transform="rotate(24 24 -64)" />

            <!-- Yüz -->
            <ellipse cx="0" cy="-63" rx="19" ry="18" fill="#52453d" stroke="#2e2520" stroke-width="2" />
            <!-- Baş Üstü Yün Perçemi -->
            <g fill="url(#woolGrad)" stroke="#c2b49d" stroke-width="1.6">
              <circle cx="-9" cy="-78" r="7.5" />
              <circle cx="0" cy="-82" r="8.5" />
              <circle cx="9" cy="-78" r="7.5" />
            </g>
            ${o.variant === 2 ? `
              <!-- Kuzu 2 için sevimli minik papatya tokası -->
              <g transform="translate(10, -83)">
                <circle cx="-3" cy="0" r="2.8" fill="#90e0ff" />
                <circle cx="3" cy="0" r="2.8" fill="#90e0ff" />
                <circle cx="0" cy="-3" r="2.8" fill="#90e0ff" />
                <circle cx="0" cy="3" r="2.8" fill="#90e0ff" />
                <circle cx="0" cy="0" r="2.2" fill="#ffd166" />
              </g>
            ` : ''}

            <!-- Büyük Parlak Gözler -->
            <g class="eye-blink">
              <circle cx="-7.5" cy="-64" r="4.8" fill="#ffffff" />
              <circle cx="-7" cy="-64" r="2.8" fill="#1e1815" />
              <circle cx="-5.8" cy="-65.5" r="1.2" fill="#ffffff" />
              <circle cx="7.5" cy="-64" r="4.8" fill="#ffffff" />
              <circle cx="7" cy="-64" r="2.8" fill="#1e1815" />
              <circle cx="8.2" cy="-65.5" r="1.2" fill="#ffffff" />
            </g>

            <!-- Pembe Yanaklar & Burun -->
            <ellipse cx="-13" cy="-58" rx="3.8" ry="2.2" fill="#ff9ebb" opacity="0.7" />
            <ellipse cx="13" cy="-58" rx="3.8" ry="2.2" fill="#ff9ebb" opacity="0.7" />
            <path d="M-4,-57 Q0,-53 4,-57 Q0,-59 -4,-57 Z" fill="#ffb0c4" />
            <path d="M-5,-53 Q0,-49 5,-53" fill="none" stroke="#ffd8e2" stroke-width="1.8" stroke-linecap="round" />

            <!-- Korku Ter Damlası -->
            <path class="sweat-drop" d="M-20,-80 Q-26,-70 -20,-66 Q-14,-70 -20,-80 Z" fill="#7be0ff" stroke="#1f8eb8" stroke-width="1.4" />
          </g>
        </g>

        <g class="char-label" transform="translate(0, 26)">
          <rect x="${-labelW / 2}" y="-12" width="${labelW}" height="22" rx="11" fill="rgba(255, 250, 238, 0.92)" stroke="#c69a5a" stroke-width="1.8" />
          <text x="0" y="3" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="13" font-weight="700" fill="#4a2b10">${o.label}</text>
        </g>
        ${buildWeightBadge(o.weight, 47)}

        <g class="speech-bubble" id="bubble-${o.id}" transform="translate(0, -108)">
          <rect x="-70" y="-26" width="140" height="32" rx="14" fill="#ffffff" stroke="#e14d57" stroke-width="2.4" />
          <polygon points="-7,5 7,5 0,14" fill="#ffffff" stroke="#e14d57" stroke-width="2.2" />
          <rect x="-9" y="2" width="18" height="5" fill="#ffffff" />
          <text class="bubble-text" x="0" y="-6" text-anchor="middle" font-family="Nunito, sans-serif" font-size="12.5" font-weight="800" fill="#8f1c28">Meee! İmdat! 😱</text>
        </g>
      </g>
    `;
  }

  /* ==================== KARAKTER 4: LAHANA ==================== */
  function buildCabbageSVG(opts) {
    const o = Object.assign({ id: 'cabbage', label: 'Lahana', weight: 0, x: 148, y: 556 }, opts);
    const aria = o.weight ? `${o.label} (${o.weight} kg)` : o.label;

    return `
      <g id="char-${o.id}" class="character-node" data-char="${o.id}" transform="translate(${o.x}, ${o.y})" role="button" tabindex="0" aria-label="${aria}">
        <ellipse class="char-ground-shadow" cx="0" cy="7" rx="31" ry="9" fill="#1b4018" opacity="0.32" />
        <ellipse class="hover-ring" cx="0" cy="7" rx="38" ry="13" fill="none" stroke="#ffe169" stroke-width="4" filter="url(#glowRing)" />

        <g class="char-body-wrap" filter="url(#charShadow)">
          <g class="char-idle">
            <!-- Dış Kıvrımlı Yapraklar -->
            <path d="M-26,-6 C-42,-22 -36,-48 -18,-52 C-10,-64 10,-64 18,-52 C36,-48 42,-22 26,-6 C16,6 -16,6 -26,-6 Z" fill="url(#cabbageOuter)" stroke="#1f5e1e" stroke-width="2.2" />
            <!-- Yaprak Damarları (Dış) -->
            <path d="M-28,-22 Q-18,-26 -14,-38 M28,-22 Q18,-26 14,-38" fill="none" stroke="#c9f79c" stroke-width="2" stroke-linecap="round" opacity="0.68" />

            <!-- Orta Katman Yapraklar -->
            <ellipse cx="0" cy="-26" rx="25" ry="24" fill="url(#cabbageInner)" stroke="#2c7a2a" stroke-width="2" />
            <path d="M-22,-18 C-14,-38 8,-44 21,-32" fill="none" stroke="#e4ffb5" stroke-width="2.4" stroke-linecap="round" opacity="0.72" />
            <path d="M-16,-8 C-4,-24 14,-24 22,-12" fill="none" stroke="#e4ffb5" stroke-width="2" stroke-linecap="round" opacity="0.6" />

            <!-- Parlak Çiy Damlaları -->
            <circle cx="-16" cy="-42" r="3" fill="#e0fcff" opacity="0.85" />
            <circle cx="18" cy="-38" r="2.4" fill="#e0fcff" opacity="0.8" />

            <!-- Sevimli Masalsı Yüz -->
            <g class="eye-blink">
              <circle cx="-8" cy="-27" r="3.8" fill="#1e3b1b" />
              <circle cx="-6.8" cy="-28.3" r="1.4" fill="#ffffff" />
              <circle cx="8" cy="-27" r="3.8" fill="#1e3b1b" />
              <circle cx="9.2" cy="-28.3" r="1.4" fill="#ffffff" />
            </g>
            <ellipse cx="-14" cy="-22" rx="4" ry="2.2" fill="#ff9ebb" opacity="0.65" />
            <ellipse cx="14" cy="-22" rx="4" ry="2.2" fill="#ff9ebb" opacity="0.65" />
            <path d="M-5,-20 Q0,-15 5,-20" fill="none" stroke="#1e3b1b" stroke-width="2.2" stroke-linecap="round" />

            <!-- Uçuşan Yaprak Kırıntıları -->
            <path class="crumb-bit crumb-bit-1" d="M-14,-44 L-6,-48 L-9,-38 Z" fill="#8be854" stroke="#2c7a2a" stroke-width="1.2" />
            <path class="crumb-bit crumb-bit-2" d="M12,-46 L20,-42 L11,-37 Z" fill="#a8f569" stroke="#2c7a2a" stroke-width="1.2" />
            <path class="crumb-bit crumb-bit-3" d="M-2,-52 L5,-55 L3,-45 Z" fill="#74d442" stroke="#2c7a2a" stroke-width="1.2" />
          </g>
        </g>

        <g class="char-label" transform="translate(0, 25)">
          <rect x="-34" y="-12" width="68" height="22" rx="11" fill="rgba(255, 250, 238, 0.92)" stroke="#c69a5a" stroke-width="1.8" />
          <text x="0" y="3" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="13" font-weight="700" fill="#4a2b10">${o.label}</text>
        </g>
        ${buildWeightBadge(o.weight, 46)}

        <g class="speech-bubble" id="bubble-${o.id}" transform="translate(0, -84)">
          <rect x="-66" y="-26" width="132" height="32" rx="14" fill="#ffffff" stroke="#22a06b" stroke-width="2.4" />
          <polygon points="-7,5 7,5 0,14" fill="#ffffff" stroke="#22a06b" stroke-width="2.2" />
          <rect x="-9" y="2" width="18" height="5" fill="#ffffff" />
          <text class="bubble-text" x="0" y="-6" text-anchor="middle" font-family="Nunito, sans-serif" font-size="12.5" font-weight="800" fill="#176140">Yapraklarım! 🥬</text>
        </g>
      </g>
    `;
  }

  /* ==================== KARAKTER 5: YEM ÇUVALI (SEVİYE 3) ==================== */
  function buildFeedSackSVG(opts) {
    const o = Object.assign({ id: 'feed', label: 'Yem Çuvalı', weight: 40, x: 102, y: 546 }, opts);
    const aria = `${o.label} (${o.weight} kg)`;

    return `
      <g id="char-${o.id}" class="character-node" data-char="${o.id}" transform="translate(${o.x}, ${o.y})" role="button" tabindex="0" aria-label="${aria}">
        <ellipse class="char-ground-shadow" cx="0" cy="8" rx="34" ry="10" fill="#1b4018" opacity="0.34" />
        <ellipse class="hover-ring" cx="0" cy="8" rx="40" ry="14" fill="none" stroke="#ffe169" stroke-width="4" filter="url(#glowRing)" />

        <g class="char-body-wrap" filter="url(#charShadow)">
          <g class="char-idle">
            <!-- Çuvalın Üst Büzgü Kulakçıkları -->
            <path d="M-16,-62 C-24,-78 -6,-82 0,-68 C6,-82 24,-78 16,-62 Z" fill="url(#feedSackGrad)" stroke="#754918" stroke-width="2.2" stroke-linejoin="round" />

            <!-- Çuval Gövdesi -->
            <path d="M-16,-60 C-34,-44 -38,-14 -28,2 C-20,9 20,9 28,2 C38,-14 34,-44 16,-60 Z" fill="url(#feedSackGrad)" stroke="#754918" stroke-width="2.4" stroke-linejoin="round" />

            <!-- Çuval Kumaş Gölgelendirme ve Dikiş İzleri -->
            <path d="M-24,-10 C-18,-2 18,-2 24,-10" fill="none" stroke="#a87534" stroke-width="2" stroke-dasharray="4 4" opacity="0.7" />
            <path d="M-21,-40 Q-14,-22 -22,-4 M21,-40 Q14,-22 22,-4" fill="none" stroke="#8f5d24" stroke-width="1.6" opacity="0.45" />

            <!-- Boğum İpi -->
            <rect x="-17" y="-64" width="34" height="8" rx="4" fill="url(#feedRopeGrad)" stroke="#5c310d" stroke-width="1.6" />
            <path d="M8,-56 Q16,-48 18,-42" fill="none" stroke="#b57830" stroke-width="3" stroke-linecap="round" />

            <!-- Üzerinde Altın Başak Amblemi -->
            <g transform="translate(0, -14)" opacity="0.88">
              <path d="M0,6 L0,-12" stroke="#8f5811" stroke-width="2" stroke-linecap="round" />
              <ellipse cx="-4.5" cy="-8" rx="4" ry="2.2" fill="#ffd166" stroke="#8f5811" stroke-width="1" transform="rotate(-32 -4.5 -8)" />
              <ellipse cx="4.5" cy="-8" rx="4" ry="2.2" fill="#ffd166" stroke="#8f5811" stroke-width="1" transform="rotate(32 4.5 -8)" />
              <ellipse cx="-5" cy="-2" rx="4" ry="2.2" fill="#ffd166" stroke="#8f5811" stroke-width="1" transform="rotate(-32 -5 -2)" />
              <ellipse cx="5" cy="-2" rx="4" ry="2.2" fill="#ffd166" stroke="#8f5811" stroke-width="1" transform="rotate(32 5 -2)" />
            </g>

            <!-- Sevimli Masalsı Yüz -->
            <g class="eye-blink">
              <circle cx="-9" cy="-40" r="3.5" fill="#3a230b" />
              <circle cx="-7.8" cy="-41.2" r="1.2" fill="#ffffff" />
              <circle cx="9" cy="-40" r="3.5" fill="#3a230b" />
              <circle cx="10.2" cy="-41.2" r="1.2" fill="#ffffff" />
            </g>
            <ellipse cx="-15" cy="-35" rx="3.8" ry="2" fill="#ff9e80" opacity="0.6" />
            <ellipse cx="15" cy="-35" rx="3.8" ry="2" fill="#ff9e80" opacity="0.6" />
            <path d="M-5,-34 Q0,-29 5,-34" fill="none" stroke="#5c3511" stroke-width="2" stroke-linecap="round" />
          </g>
        </g>

        <g class="char-label" transform="translate(0, 26)">
          <rect x="-42" y="-12" width="84" height="22" rx="11" fill="rgba(255, 250, 238, 0.92)" stroke="#c69a5a" stroke-width="1.8" />
          <text x="0" y="3" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="12.5" font-weight="700" fill="#4a2b10">${o.label}</text>
        </g>
        ${buildWeightBadge(o.weight, 47)}

        <g class="speech-bubble" id="bubble-${o.id}" transform="translate(0, -96)">
          <rect x="-66" y="-26" width="132" height="32" rx="14" fill="#ffffff" stroke="#d49017" stroke-width="2.4" />
          <polygon points="-7,5 7,5 0,14" fill="#ffffff" stroke="#d49017" stroke-width="2.2" />
          <rect x="-9" y="2" width="18" height="5" fill="#ffffff" />
          <text class="bubble-text" x="0" y="-6" text-anchor="middle" font-family="Nunito, sans-serif" font-size="12.5" font-weight="800" fill="#7a4700">Ağırım ama güvenliyim!</text>
        </g>
      </g>
    `;
  }

  global.SceneArt = {
    buildSceneSVG,
    buildCharactersForLevel
  };
})(window);
