// ==========================================
// 🎮 Math Station 遊戲資料庫 (Game Database)
// 【日常更新區】：未來新增遊戲，只需在這裡複製貼上一行！
// ==========================================
const MATH_GAMES =[
    // --- 二年級 (P2) 遊戲清單 ---
    { id: "p2-game-1", grade: "P2", title: "2N1算珠挑戰", icon: "fa-calculator", color: "#ff4757" },
    { id: "p2-game-2", grade: "P2", title: "2N1數卡排列挑戰", icon: "fa-sort-numeric-up", color: "#ffa502" },
    { id: "p2-game-3", grade: "P2", title: "2N2直式退位減法挑戰", icon: "fa-minus", color: "#2ed573" },
    { id: "p2-game-4", grade: "P2", title: "2N2應用題速算(基礎)", icon: "fa-lightbulb", color: "#1e90ff" },
    { id: "p2-game-5", grade: "P2", title: "2N2應用題進階挑戰", icon: "fa-brain", color: "#ff6b81" },
    
    // --- 六年級 (P6) 遊戲清單 ---
    { id: "p6-game-1", grade: "P6", title: "6N1小數除法數神挑戰", icon: "fa-divide", color: "#ff6b7a" },        // 除號圖示，粉紅（精準運算）
    { id: "p6-game-2", grade: "P6", title: "6M3圓周探究", icon: "fa-circle", color: "#feca57" },       // 圓圈圖示，金黃（圓周率圓）
    { id: "p6-game-3", grade: "P6", title: "6M4時間魔數對決", icon: "fa-clock", color: "#48dbfb" },    // 時鐘圖示，青藍（時間計算）
    { id: "p6-game-4", grade: "P6", title: "6A1方程倒數配對", icon: "fa-equals", color: "#ff9ff3" },   // 等號圖示，紫粉（方程配對）
];
// ==========================================
// ⚙️ 系統核心引擎 (音效、轉場、自動生成 UI)
// ⚠️ 以下程式碼為系統核心，請勿隨意修改
// ==========================================
// 1. Web Audio API 無實體音效合成引擎 (電競級微互動)
let audioCtx = null;
function playSound(type) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        if (type === 'hover') {
            // 懸浮音效：輕快的 Tick 聲
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.start(); osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'click') {
            // 點擊音效：沉穩的啟動聲 (Swoosh/Thud)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc.start(); osc.stop(audioCtx.currentTime + 0.15);
        }
    } catch(e) { console.log("Audio skipped"); }
}
// 2. 頁面載入與 UI 自動生成
document.addEventListener('DOMContentLoaded', () => {
    // A. 頁面淡入效果
    document.body.style.opacity = '1';
    // B. 自動生成遊戲卡片 (資料驅動 UI)
    const grid = document.getElementById('game-grid');
    if (grid) {
        const currentGrade = document.body.dataset.grade; // 自動偵測現在是哪個年級的網頁
        const games = MATH_GAMES.filter(g => g.grade === currentGrade);
       
        grid.innerHTML = games.map(g => `
            <a href="play.html?game=${g.id}" class="game-card interactive-element">
                <div class="game-thumbnail" style="background: ${g.color};">
                    <i class="fa-solid ${g.icon}"></i>
                </div>
                <div class="game-info">
                    <div class="game-title">${g.title}</div>
                    <div class="btn-play">START <i class="fa-solid fa-play"></i></div>
                </div>
            </a>
        `).join('');
    }
    // C. 綁定所有互動元素的音效與轉場
    document.querySelectorAll('a, .interactive-element').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', (e) => {
            const href = el.getAttribute('href');
            // 如果不是返回上一頁的指令，則執行淡出轉場
            if (href && !href.startsWith('javascript')) {
                e.preventDefault();
                playSound('click');
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = href; }, 300); // 等待淡出後跳轉
            } else {
                playSound('click');
            }
        });
    });
});

// 【修復】防止回到上一頁時畫面卡在透明狀態 (BFCache 修復)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {  // 只在從 BFCache 載入時觸發
        document.body.style.opacity = '1';
    }
});
