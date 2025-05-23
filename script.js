const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');

const urlParams = new URLSearchParams(window.location.search);
const numOptions = parseInt(urlParams.get('options')) || 8;

let optionsData = [];
if (numOptions === 6) {
    optionsData = [
        { text: "罚一杯", color: "#FFC0CB" }, // Pink
        { text: "任选一人弹脑瓜三下", color: "#ADD8E6" }, // Light Blue
        { text: "和垃圾桶合影", color: "#90EE90" }, // Light Green
        { text: "任选一人帮自己喝一杯", color: "#FFD700" }, // Gold
        { text: "恭喜你，逃过一劫", color: "#FFA07A" }, // Light Salmon
        { text: "闭上眼睛10秒摆3个表情拍照", color: "#DDA0DD" } // Plum
    ];
} else {
    optionsData = [
        { text: "罚一杯", color: "#FFC0CB" }, // Pink
        { text: "任选一人弹脑瓜三下", color: "#ADD8E6" }, // Light Blue
        { text: "和垃圾桶合影", color: "#90EE90" }, // Light Green
        { text: "任选一人帮自己喝一杯", color: "#FFD700" }, // Gold
        { text: "恭喜你，逃过一劫", color: "#FFA07A" }, // Light Salmon
        { text: "说一段绕口令并录音下来", color: "#DDA0DD" }, // Plum
        { text: "给同性擦嘴巴", color: "#87CEEB" }, // Sky Blue
        { text: "闭上眼睛10秒摆3个表情拍照", color: "#F0E68C" } // Khaki
    ];
}

let availableOptions = [...optionsData]; // Options that haven't been landed on yet
let currentOptionIndex = 0; // To track the next option to land on in sequence
let spinCount = 0; // 新增变量，记录已抽奖次数

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) - 10;

function drawWheelBase() { // Renamed to avoid confusion, only draws the wheel sectors
    const arcSize = (2 * Math.PI) / numOptions;
    // No clearRect here, it will be done before rotation

    for (let i = 0; i < numOptions; i++) {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.fillStyle = optionsData[i].color;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
        ctx.closePath();
        ctx.fill();

        // Draw text (optional, as per requirement no text on wheel)
        // ctx.save();
        // ctx.fillStyle = "black";
        // ctx.font = "12px Arial";
        // ctx.translate(centerX + Math.cos(angle + arcSize / 2) * radius / 1.5, 
        //               centerY + Math.sin(angle + arcSize / 2) * radius / 1.5);
        // ctx.rotate(angle + arcSize / 2 + Math.PI / 2);
        // // ctx.fillText(optionsData[i].text, -ctx.measureText(optionsData[i].text).width / 2, 0);
        // ctx.restore();
    }
}

function drawPointer() {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(centerX - 5, centerY - radius - 10);
    ctx.lineTo(centerX + 5, centerY - radius - 10);
    ctx.lineTo(centerX, centerY - radius + 10);
    ctx.closePath();
    ctx.fill();
}

function drawScene() { // Combines drawing wheel and pointer
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheelBase(); // This will be rotated
    // Pointer is drawn after rotation, so it's static
}

function showFireworksAndMessage() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 简单烟花动画（可扩展为更复杂的效果）
    let particles = [];
    let fireworksFrame = 0;
    function createFirework() {
        const colors = ["#ff4242","#ffd700","#42ff42","#4287ff","#ff42e9","#fff"];
        const cx = centerX;
        const cy = centerY;
        for (let i = 0; i < 40; i++) {
            const angle = (2 * Math.PI / 40) * i;
            const speed = Math.random() * 4 + 2;
            particles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random()*colors.length)],
                alpha: 1
            });
        }
    }
    createFirework();
    function animateFireworks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
        }
        particles = particles.filter(p => p.alpha > 0);
        fireworksFrame++;
        if (fireworksFrame < 60) {
            requestAnimationFrame(animateFireworks);
        } else {
            showBirthdayMessage();
        }
    }
    animateFireworks();
}
function showBirthdayMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 32px '微软雅黑', Arial";
    ctx.fillStyle = "#ff69b4";
    ctx.textAlign = "center";
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 20;
    ctx.fillText("祝富贵天天开心,生日快乐！", centerX, centerY);
    ctx.shadowBlur = 0;
}

function spin() {
    if (availableOptions.length === 0 || spinButton.dataset.birthday === "true") {
        return;
    }

    spinButton.disabled = true;
    resultDiv.textContent = "旋转中...";

    // 计算当前是第几人版和第几次抽奖
    spinCount++;
    let targetOption;
    if (numOptions === 6) {
        // 三人版，前5次只能抽1-5，第6次必须抽6
        if (spinCount <= 5) {
            // 只在前5个选项中随机
            const idx = Math.floor(Math.random() * 5);
            targetOption = optionsData[idx];
        } else {
            // 第6次必须抽第6个
            targetOption = optionsData[5];
        }
    } else {
        // 四人版，前7次只能抽1-7，第8次必须抽8
        if (spinCount <= 7) {
            const idx = Math.floor(Math.random() * 7);
            targetOption = optionsData[idx];
        } else {
            targetOption = optionsData[7];
        }
    }
    const targetOptionActualIndex = optionsData.findIndex(opt => opt.text === targetOption.text);

    // Calculate the target angle
    const arcSize = (2 * Math.PI) / numOptions;
    const targetAngleOffset = (targetOptionActualIndex * arcSize) + (arcSize / 2);
    const finalRotation = -(targetAngleOffset - Math.PI / 2) ;
    const randomSpins = Math.floor(Math.random() * 5) + 5; // 5 to 9 full spins
    const totalRotation = randomSpins * 2 * Math.PI + finalRotation;

    let currentRotation = 0;
    const duration = 3000; // 3 seconds
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        currentRotation = easedProgress * totalRotation;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentRotation);
        ctx.translate(-centerX, -centerY);
        drawWheelBase();
        ctx.restore();
        drawPointer();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            resultDiv.textContent = `结果: ${targetOption.text}`;
            // 不移除选项，保证每次都能抽到指定内容
            if ((numOptions === 6 && spinCount === 6) || (numOptions !== 6 && spinCount === 8)) {
                resultDiv.textContent += "\n";
                spinButton.textContent = "生日快乐";
                spinButton.disabled = false;
                spinButton.dataset.birthday = "true";
            } else {
                spinButton.disabled = false;
            }
        }
    }
    requestAnimationFrame(animate);
}
spinButton.addEventListener('click', function(){
    if (spinButton.dataset.birthday === "true") {
        spinButton.disabled = true;
        resultDiv.textContent = "";
        showFireworksAndMessage();
    } else {
        spin();
    }
});
// Initial draw: wheel base and pointer separately
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawWheelBase();
drawPointer();
