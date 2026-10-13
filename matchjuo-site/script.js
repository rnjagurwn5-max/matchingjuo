(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });


  /* ---------- Header state over hero ---------- */
  var header = $("#siteHeader"), hero = $("#hero");
  function headerState() {
    var limit = Math.max(40, hero.offsetHeight - 90);
    var over = window.scrollY < limit && innerWidth > 760 && !navLinks.classList.contains("open");
    header.classList.toggle("over", over);
    header.classList.toggle("solid", !over);
  }
  headerState();
  addEventListener("scroll", headerState, { passive: true });
  addEventListener("resize", headerState);
  menuBtn.addEventListener("click", headerState);

  /* ---------- Story accordion ---------- */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel-img"));
  function openPanel(p) {
    panels.forEach(function (x) { var on = x === p; x.classList.toggle("active", on); x.setAttribute("aria-expanded", String(on)); });
  }
  panels.forEach(function (p) {
    p.addEventListener("click", function () { openPanel(p); });
    p.addEventListener("mouseenter", function () { if (matchMedia("(hover: hover) and (min-width: 901px)").matches) openPanel(p); });
    p.addEventListener("focus", function () { openPanel(p); });
  });

  /* ---------- App demo walkthrough ---------- */
  var STEPS = [
    { t: "시작 화면", d: "앱을 처음 열면 브랜드와 슬로건을 보여주고, 바로 시작하거나 로그인할 수 있어요.", f: "서비스 소개, 로그인, 시작하기", u: "대형 로고, 슬로건, 시작 버튼", mvp: true },
    { t: "프로필 생성", d: "이름, 지역, 희망 직무와 관심 산업을 입력해 맞춤 추천의 기준을 만들어요.", f: "희망 직무·지역·경력 입력", u: "입력 카드, 단계별 진행 바", mvp: true },
    { t: "업무 성향 진단", d: "혼자 집중하는지, 협업할 때 힘이 나는지 등 나의 업무 스타일을 진단해요.", f: "협업, 자율성, 소통 성향 분석", u: "선택형 설문", mvp: true },
    { t: "기업문화 선호 진단", d: "회식 빈도, 조직 문화, 대면 업무, 자율성처럼 원하는 근무 환경을 5단계로 골라요.", f: "선호하는 조직문화·근무 환경 선택", u: "5단계 슬라이더", mvp: true },
    { t: "스와이프 추천", d: "AI가 추천한 기업을 카드로 넘기며 ♥(관심), ✕(패스), ★(저장)로 표시해요. 카드를 누르면 근무지, 산업군, 직원 수 같은 상세 정보를 먼저 볼 수 있어요.", f: "AI 추천 회사 탐색, 기업 상세 정보", u: "기업 사진, #문화 태그, 되돌리기 / X / ♥ / 저장", mvp: true },
    { t: "매칭 회사 리스트", d: "내가 관심을 보낸 기업과 서로 매칭된 기업을 한곳에서 관리해요.", f: "관심 기업, 상호 매칭 기업 관리", u: "기업 리스트, 필터", mvp: true },
    { t: "AI 궁합 분석 리포트", d: "현직자 설문과 나의 선호를 항목별로 비교하고, 잘 맞는 이유와 확인할 점을 알려줘요.", f: "나의 선호와 기업문화 비교", u: "궁합 점수, 비교 그래프, 추천 사유", mvp: true },
    { t: "이력서 등록", d: "PDF·DOC 파일을 올리거나, 입력한 기본 정보로 AI가 이력서를 작성해요. 쓰던 이력서를 불러올 수도 있어요.", f: "파일 업로드, AI 자동 작성, 기존 이력서 불러오기", u: "업로드 영역, 작성 방식 선택 카드", mvp: false },
    { t: "지원·현직자 채팅", d: "궁금한 점은 직무별 현직자에게 묻고, 채용 담당자와도 대화할 수 있어요.", f: "입사 지원, 현직자 질의, 채용 담당자 대화", u: "채팅창, 지원 상태", mvp: false },
    { t: "매칭 완료", d: "기업과 내가 서로 관심을 표시하면 매칭이 성사되고, 채용 대화가 시작돼요.", f: "기업과 지원자의 상호 관심 확인", u: "It's a Match! 화면, 채팅 버튼", mvp: false }
  ];
  var shot = $("#appShot");
  STEPS.forEach(function (st, i) { st.img = "assets/app/" + (i < 9 ? "0" : "") + (i + 1) + ".jpg"; });
  // Warm the cache so switching screens is instant.
  setTimeout(function () { STEPS.forEach(function (st) { var im = new Image(); im.src = st.img; }); }, 1500);
  var stepList = $("#stepList"), detail = $("#stepDetail"), count = $("#appCount"), cur = 0;
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  STEPS.forEach(function (st, i) {
    var li = document.createElement("li");
    li.innerHTML = '<button class="step-btn" role="tab" id="tab-' + i + '" aria-controls="appShot"><small>' + pad(i + 1) + '</small>' + st.t + '</button>';
    li.firstChild.addEventListener("click", function () { show(i); });
    stepList.appendChild(li);
  });
  function show(i) {
    cur = (i + STEPS.length) % STEPS.length;
    shot.classList.add("swap");
    setTimeout(function () { shot.src = STEPS[cur].img; shot.alt = "매칭해 쥬오 앱 " + STEPS[cur].t + " 화면"; }, 120);
    Array.prototype.forEach.call(stepList.querySelectorAll(".step-btn"), function (b, k) {
      b.setAttribute("aria-selected", String(k === cur)); b.tabIndex = k === cur ? 0 : -1;
    });
    var st = STEPS[cur];
    detail.innerHTML = '<span class="badge' + (st.mvp ? "" : " next") + '">' + (st.mvp ? "1차 MVP 범위" : "2차 확장 기능") + '</span>' +
      '<h3>' + pad(cur + 1) + '. ' + st.t + '</h3><p>' + st.d + '</p>' +
      '<dl class="spec"><div><dt>주요 기능</dt><dd>' + st.f + '</dd></div><div><dt>핵심 UI</dt><dd>' + st.u + '</dd></div></dl>' +
      '<p class="note">화면 속 기업명과 인물은 시안용 예시이며, 실제 기업과의 제휴를 뜻하지 않아요.</p>';
    count.textContent = pad(cur + 1) + " / " + STEPS.length;
    var active = stepList.querySelector('[aria-selected="true"]');
    if (active && stepList.scrollWidth > stepList.clientWidth) {
      stepList.scrollTo({ left: active.parentNode.offsetLeft - stepList.clientWidth / 2 + active.offsetWidth / 2, behavior: "smooth" });
    }
  }
  $("#appPrev").addEventListener("click", function () { show(cur - 1); });
  $("#appNext").addEventListener("click", function () { show(cur + 1); });
  stepList.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); stepList.querySelectorAll(".step-btn")[cur].focus(); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); stepList.querySelectorAll(".step-btn")[cur].focus(); }
  });
  shot.addEventListener("load", function () { shot.classList.remove("swap"); });
  show(0);

  /* ---------- Pricing: monthly / yearly ---------- */
  function setBill() {
    var year = $("#billYear").checked;
    document.querySelectorAll("#pricing [data-month]").forEach(function (el) {
      el.textContent = el.getAttribute(year ? "data-year" : "data-month");
    });
  }
  ["#billMonth", "#billYear"].forEach(function (id) { $(id).addEventListener("change", setBill); });
  setBill();

  /* ---------- Toast ---------- */
  var toastEl = $("#toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }

  /* ---------- Preference sliders ---------- */
  var DIMS = [
    { key: "dine", name: "회식 빈도", lo: "적은 편", hi: "많은 편" },
    { key: "flat", name: "조직 문화", lo: "수직적", hi: "수평적" },
    { key: "meet", name: "대면 업무", lo: "적은 편", hi: "많은 편" },
    { key: "intro", name: "업무 환경", lo: "외향형 친화", hi: "내향형 친화" },
    { key: "auto", name: "업무 자율성", lo: "낮은 편", hi: "높은 편" }
  ];
  var me = { dine: 2, flat: 4, meet: 2, intro: 4, auto: 4 };
  try { var saved = JSON.parse(localStorage.getItem("matchjuo-prefs") || "null"); if (saved) me = Object.assign(me, saved); } catch (e) {}

  var prefsEl = $("#prefs");
  DIMS.forEach(function (d) {
    var wrap = document.createElement("div"); wrap.className = "pref";
    wrap.innerHTML =
      '<label for="p-' + d.key + '">' + d.name + '<output id="o-' + d.key + '"></output></label>' +
      '<input type="range" id="p-' + d.key + '" min="1" max="5" step="1" value="' + me[d.key] + '" aria-describedby="e-' + d.key + '">' +
      '<div class="ends" id="e-' + d.key + '"><span>' + d.lo + '</span><span>' + d.hi + '</span></div>';
    prefsEl.appendChild(wrap);
    var input = wrap.querySelector("input");
    var setOut = function () {
      var v = +input.value;
      wrap.querySelector("output").textContent = v <= 2 ? d.lo : v >= 4 ? d.hi : "보통";
    };
    setOut();
    input.addEventListener("input", function () {
      me[d.key] = +input.value; setOut();
      try { localStorage.setItem("matchjuo-prefs", JSON.stringify(me)); } catch (e) {}
      renderDeck();
    });
  });

  /* ---------- Example companies (fictional) ---------- */
  var COMPANIES = [
    { name: "오로라랩스", field: "IT·SaaS", loc: "서울 성동구", size: "200명", n: 38, mutual: true,
      c: { dine: 1, flat: 5, meet: 2, intro: 4, auto: 5 }, tags: ["#회식적음", "#수평적소통", "#유연근무"], hue: ["#8FA2FF", "#B9A9FF"], img: "assets/building.jpg", logo: "assets/co/aurora_logo.png" },
    { name: "바닐라커머스", field: "이커머스", loc: "서울 강남구", size: "600명", n: 52, mutual: false,
      c: { dine: 3, flat: 3, meet: 3, intro: 3, auto: 3 }, tags: ["#빠른성장", "#데이터중심", "#주1회재택"], hue: ["#FFB3BF", "#C9B6FF"], img: "assets/co/vanilla.jpg", logo: "assets/co/vanilla_logo.png" },
    { name: "마루디자인스튜디오", field: "브랜드 디자인", loc: "서울 마포구", size: "40명", n: 14, mutual: false,
      c: { dine: 2, flat: 5, meet: 1, intro: 5, auto: 4 }, tags: ["#집중시간보장", "#소규모팀", "#자율출퇴근"], hue: ["#9FD9C8", "#A9B8FF"], img: "assets/co/maru.jpg", logo: "assets/co/maru_logo.png" },
    { name: "솔바람에너지", field: "에너지·인프라", loc: "부산 해운대구", size: "1,200명", n: 61, mutual: true,
      c: { dine: 2, flat: 4, meet: 4, intro: 3, auto: 3 }, tags: ["#워라밸", "#현장협업", "#교육지원"], hue: ["#FFD39A", "#FF9DAE"], img: "assets/co/solbaram.jpg", logo: "assets/co/solbaram_logo.png" },
    { name: "새벽물류", field: "물류·유통", loc: "인천 연수구", size: "900명", n: 47, mutual: false,
      c: { dine: 4, flat: 2, meet: 4, intro: 2, auto: 2 }, tags: ["#팀워크", "#체계적업무", "#현장중심"], hue: ["#A7C4FF", "#8B75EE"], img: "assets/co/saebyeok.jpg", logo: "assets/co/saebyeok_logo.png" },
    { name: "도담금융서비스", field: "금융", loc: "서울 중구", size: "3,000명", n: 120, mutual: false,
      c: { dine: 4, flat: 2, meet: 4, intro: 2, auto: 2 }, tags: ["#안정성", "#명확한체계", "#대면업무"], hue: ["#B6C2D9", "#8FA2FF"], img: "assets/co/dodam.jpg", logo: "assets/co/dodam_logo.png" }
  ];
  var DIM_LABEL = { dine: "회식 빈도", flat: "수평적 문화", meet: "대면 업무", intro: "내향형 친화", auto: "업무 자율성" };

  function score(c) {
    var diff = 0; DIMS.forEach(function (d) { diff += Math.abs(me[d.key] - c.c[d.key]); });
    return Math.max(35, Math.round(100 - diff * 3.4));
  }
  function verdict(s) { return s >= 85 ? "매우 잘 맞아요" : s >= 70 ? "잘 맞는 편이에요" : s >= 55 ? "확인이 필요해요" : "다른 점이 많아요"; }

  var queue = COMPANIES.slice(), liked = [], deckEl = $("#deck"), whyEl = $("#why");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; }); }

  function cardHTML(co) {
    var s = score(co), pos = function (v) { return ((v - 1) / 4 * 100) + "%"; };
    var rows = DIMS.map(function (d) {
      return '<div class="cmp-row"><span>' + d.name + '</span><div class="track">' +
        '<span class="dot co" style="left:' + pos(co.c[d.key]) + '"></span>' +
        '<span class="dot me" style="left:' + pos(me[d.key]) + '"></span></div></div>';
    }).join("");
    var bg = co.img ? 'background-image:url(' + co.img + ')' : 'background:linear-gradient(150deg,' + co.hue[0] + ',' + co.hue[1] + ')';
    return '<div class="cover" style="' + bg + '">' +
      '<span class="example">가상 기업 · 예시</span><span class="score-pill"><small>AI 궁합</small>' + s + '%</span>' +
      '<div class="cover-info">' + (co.logo ? '<img class="co-logo" src="' + co.logo + '" alt="">' : '') +
      '<div><h4>' + esc(co.name) + '</h4><div class="meta">' + esc(co.field) + ' · ' + esc(co.loc) + ' · ' + esc(co.size) + '</div></div></div></div>' +
      '<div class="body">' +
      '<div class="tags">' + co.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join("") + '</div>' +
      '<div class="legend"><span><i style="background:var(--coral)"></i>나</span><span><i style="background:var(--blue)"></i>' + esc(co.name) + '</span></div>' +
      '<div class="cmp">' + rows + '</div>' +
      '<div class="meta">현직자 ' + co.n + '명 응답 · 2026년 9월 조사 (예시)</div></div>' +
      '<span class="stamp yes">좋아요</span><span class="stamp no">패스</span>';
  }

  function renderWhy() {
    var co = queue[0];
    var likedHTML = '<h4>관심·저장한 기업</h4><div class="liked">' +
      (liked.length ? liked.map(function (l) {
        return '<span class="tag ' + (l.match ? "match" : l.saved ? "saved" : "") + '">' + esc(l.name) + (l.match ? " · 매칭" : l.saved ? " · 저장" : " · 관심") + '</span>';
      }).join("") : '<span class="note">아직 없어요. 마음에 드는 기업에 ♥를 눌러 보세요.</span>') + '</div>';
    if (!co) { whyEl.innerHTML = likedHTML; return; }
    var s = score(co), good = [], warn = [];
    DIMS.forEach(function (d) {
      var gap = Math.abs(me[d.key] - co.c[d.key]);
      if (gap <= 1) good.push(DIM_LABEL[d.key] + " 선호가 비슷해요");
      else warn.push(DIM_LABEL[d.key] + "에서 " + (co.c[d.key] > me[d.key] ? "기업 쪽이 더 높아요" : "기업 쪽이 더 낮아요"));
    });
    whyEl.innerHTML =
      '<div class="why-top"><div class="ring" style="--p:' + s + '"><b>' + s + '%</b></div><div><span class="eyebrow">AI 궁합 분석</span><h3>' + esc(co.name) + '</h3><p class="note">' + verdict(s) + '</p></div></div>' +
      (good.length ? '<div><h4>잘 맞는 이유</h4><ul>' + good.map(function (g) { return '<li class="good"><svg><use href="#i-check"/></svg>' + g + '</li>'; }).join("") + '</ul></div>' : "") +
      (warn.length ? '<div><h4>확인하면 좋은 점</h4><ul>' + warn.map(function (w) { return '<li class="warn"><svg><use href="#i-warn"/></svg>' + w + '</li>'; }).join("") + '</ul></div>' : "") +
      likedHTML;
  }

  function renderDeck() {
    deckEl.innerHTML = "";
    if (!queue.length) {
      deckEl.innerHTML = '<div class="deck-empty"><h3 style="font-size:24px">추천 기업을 모두 봤어요</h3><p class="note">선호를 바꾸고 다시 보면 점수가 달라져요.</p><div><button class="btn btn-primary btn-sm" id="restart">처음부터 다시 보기</button></div></div>';
      $("#restart").addEventListener("click", function () { queue = COMPANIES.slice(); liked = []; renderDeck(); });
      renderWhy(); return;
    }
    queue.slice(0, 2).reverse().forEach(function (co, i, arr) {
      var el = document.createElement("article");
      el.className = "ccard" + (i === 0 && arr.length > 1 ? " back" : "");
      el.innerHTML = cardHTML(co);
      el.setAttribute("aria-label", co.name + " 추천 카드");
      deckEl.appendChild(el);
    });
    attachDrag(deckEl.lastElementChild);
    renderWhy();
  }

  function decide(kind) {
    var co = queue[0]; if (!co) return;
    var top = deckEl.lastElementChild;
    var dx = kind === "no" ? -1 : 1;
    if (top && top.classList.contains("ccard")) {
      top.style.transform = "translate(" + (dx * 140) + "%, 0) rotate(" + (dx * 18) + "deg)";
      top.style.opacity = "0";
    }
    setTimeout(function () {
      queue.shift();
      if (kind === "yes") {
        liked.push({ name: co.name, match: co.mutual });
        if (co.mutual) openMatch(co); else toast("관심을 보냈어요. 기업도 관심을 보내면 매칭돼요.");
      } else if (kind === "save") {
        liked.push({ name: co.name, saved: true }); toast("관심 목록에 저장했어요: " + co.name);
      }
      renderDeck();
    }, 280);
  }
  $("#btnNo").addEventListener("click", function () { decide("no"); });
  $("#btnYes").addEventListener("click", function () { decide("yes"); });
  $("#btnSave").addEventListener("click", function () { decide("save"); });
  document.addEventListener("keydown", function (e) {
    if (!$("#matchModal").hidden) { if (e.key === "Escape") closeMatch(); return; }
    var r = deckEl.getBoundingClientRect();
    if (r.top > innerHeight || r.bottom < 0 || /INPUT|TEXTAREA/.test(document.activeElement.tagName) || document.activeElement.closest(".step-list, .accordion")) return;
    if (e.key === "ArrowLeft") decide("no");
    if (e.key === "ArrowRight") decide("yes");
  });

  function attachDrag(el) {
    if (!el || !el.classList.contains("ccard")) return;
    var sx = 0, sy = 0, dx = 0, active = false;
    var yes = el.querySelector(".stamp.yes"), no = el.querySelector(".stamp.no");
    el.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      active = true; sx = e.clientX; sy = e.clientY; dx = 0; el.classList.add("dragging");
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (!active) return;
      dx = e.clientX - sx;
      var dy = (e.clientY - sy) * .2;
      el.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + dx / 18 + "deg)";
      yes.style.opacity = Math.max(0, Math.min(1, dx / 90));
      no.style.opacity = Math.max(0, Math.min(1, -dx / 90));
    });
    var end = function () {
      if (!active) return; active = false; el.classList.remove("dragging");
      if (dx > 100) decide("yes");
      else if (dx < -100) decide("no");
      else { el.style.transform = ""; yes.style.opacity = 0; no.style.opacity = 0; }
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  /* ---------- Match modal ---------- */
  var modal = $("#matchModal"), lastFocus;
  function openMatch(co) {
    lastFocus = document.activeElement;
    $("#matchText").textContent = co.name + " 그리고 나, 서로에게 관심을 표시했어요!";
    var av = $("#matchCo");
    av.textContent = co.img ? "" : co.name.charAt(0);
    av.style.backgroundImage = co.img ? "url(" + co.img + ")" : "";
    modal.hidden = false;
    var card = modal.querySelector(".match-card");
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var colors = ["#FF647C", "#8B75EE", "#526CFA", "#FFD39A", "#ffffff"];
      for (var i = 0; i < 26; i++) {
        var c = document.createElement("i"); c.className = "confetti";
        c.style.left = Math.random() * 100 + "%"; c.style.background = colors[i % colors.length];
        c.style.animationDelay = Math.random() * .5 + "s";
        card.appendChild(c);
        setTimeout(function (n) { return function () { n.remove(); }; }(c), 2600);
      }
    }
    $("#matchChat").focus();
  }
  function closeMatch() { modal.hidden = true; if (lastFocus) lastFocus.focus(); }
  $("#matchClose").addEventListener("click", closeMatch);
  $("#matchChat").addEventListener("click", function () { closeMatch(); toast("체험용 화면이에요. 채팅은 정식 서비스에서 열려요."); });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeMatch(); });

  renderDeck();

  /* ---------- Sign-up form ---------- */
  var form = $("#joinForm"), msg = $("#formMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("#email").value.trim();
    msg.hidden = false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.className = "form-msg err"; msg.textContent = "이메일 주소를 확인해 주세요. 예: name@example.com"; $("#email").focus(); return;
    }
    if (!$("#agree").checked) {
      msg.className = "form-msg err"; msg.textContent = "이메일 수집·이용에 동의해야 신청할 수 있어요."; return;
    }
    var type = form.querySelector('input[name="type"]:checked').value === "biz" ? "기업 담당자" : "구직자";
    msg.className = "form-msg ok";
    msg.textContent = type + " 사전 신청 화면이에요. 지금은 데모라 신청 정보가 저장되거나 전송되지 않아요.";
  });

  /* ---------- Background music: on by default every visit ---------- */
  var audio = $("#bgm"), bgmBtn = $("#bgmBtn"), bgmLabel = bgmBtn.querySelector(".bgm-label"), hint = $("#bgmHint");
  var VOL = 0.5, wantMusic = true, fadeT;
  audio.preload = "auto";
  function fadeTo(target, done) {
    clearInterval(fadeT);
    fadeT = setInterval(function () {
      var up = target > audio.volume, v = audio.volume + (up ? 0.04 : -0.06);
      if ((up && v >= target) || (!up && v <= target)) { v = target; clearInterval(fadeT); if (done) done(); }
      audio.volume = Math.max(0, Math.min(1, v));
    }, 50);
  }
  function setBtn(on) {
    bgmBtn.setAttribute("aria-pressed", String(on));
    bgmBtn.setAttribute("aria-label", on ? "배경음악 끄기" : "배경음악 켜기");
    bgmLabel.textContent = on ? "음악 끄기" : "음악 켜기";
  }
  function audible() { return !audio.paused && !audio.muted; }
  function showHint(on) { if (hint) hint.hidden = !on; }
  // Try to start with sound. If the browser blocks sound before any interaction,
  // keep the track running muted so it is in time, and unmute on the first tap, click or key.
  function start() {
    audio.muted = false; audio.volume = 0;
    var p = audio.play();
    if (p && p.then) {
      p.then(function () { setBtn(true); showHint(false); fadeTo(VOL); })
       .catch(function () {
         audio.muted = true;
         audio.play().catch(function () {});
         setBtn(false); showHint(true);
       });
    } else { setBtn(true); fadeTo(VOL); }
  }
  function stop() { setBtn(false); fadeTo(0, function () { audio.pause(); }); }
  bgmBtn.addEventListener("click", function () {
    if (audible()) { wantMusic = false; stop(); }
    else { wantMusic = true; start(); }
  });
  var GESTURES = ["pointerup", "click", "touchend", "keydown", "mousedown"];
  function onGesture(e) {
    if (e.target && e.target.closest && e.target.closest("#bgmBtn")) { GESTURES.forEach(function (t) { removeEventListener(t, onGesture, true); }); return; }
    if (!wantMusic || audible()) return;
    var p = audio.play();
    audio.muted = false;
    if (p && p.then) p.then(function () {
      GESTURES.forEach(function (t) { removeEventListener(t, onGesture, true); });
      setBtn(true); showHint(false); fadeTo(VOL);
    }).catch(function () { audio.muted = true; });
  }
  GESTURES.forEach(function (t) { addEventListener(t, onGesture, true); });
  if (hint) hint.addEventListener("click", function () { wantMusic = true; start(); });
  start();
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audio.paused) { audio.pause(); audio.dataset.resume = "1"; }
    else if (!document.hidden && audio.dataset.resume) { delete audio.dataset.resume; if (wantMusic) audio.play().catch(function () {}); }
  });

  /* ---------- Hero video: silent loop, paused off-screen and for reduced motion ---------- */
  (function heroVideo() {
    var v = $("#heroVideo"); if (!v) return;
    v.muted = true; // the page's own music plays separately
    var reduce = matchMedia("(prefers-reduced-motion: reduce)");
    var onScreen = true;
    function sync() {
      if (reduce.matches || document.hidden || !onScreen) { v.pause(); return; }
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; sync(); }).observe(v);
    }
    document.addEventListener("visibilitychange", sync);
    if (reduce.addEventListener) reduce.addEventListener("change", sync);
    sync();
  })();

})();
