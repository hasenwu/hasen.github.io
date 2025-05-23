document.addEventListener('DOMContentLoaded', () => {
    // 随机小游戏功能
    const games = [
        {
            name: '我有你没有',
            intro: '每人伸出五指，轮流说一件自己做过但别人可能没做过的事（越夸张越好！），没做过的人弯一根手指，最先全弯的人接受惩罚。'
        },
        {
            name: '猜歌名',
            intro: '轮流播放自己的歌单，放3秒前奏，其他人猜歌名，五首歌谁猜对的多的赢,都没猜出继续放几秒'
        },
        {
            name: '你画我猜',
            intro: '点击选题按钮，由画的人在手机上进行画画，其他人猜图，猜对的赢'
        },
        {
            name: '海龟汤',
            intro: '每人一轮，到网上找一个海龟汤给其他人猜，最先猜到结局的赢'
        }
        // 后续可在此添加更多游戏
    ];
    const gameDisplay = document.getElementById('gameDisplay');
    const randomGameButton = document.getElementById('randomGameButton');
    const gameIntro = document.getElementById('gameIntro');
    const topicButton = document.createElement('button');
    topicButton.textContent = '选题';
    topicButton.classList.add('topic-btn');
    gameIntro.parentNode.insertBefore(topicButton, gameIntro.nextSibling);
    
    const topics = ['树', '猫', '汽车', '房子', '太阳', '花', '狗', '鸟', '鱼', '山', '海', '河', '树枝', '果子', '苹果', '香蕉', '橘子', '梨', '西瓜', '草', '药', '酒', '沙拉', '面包', '饼', '蛋糕', '蛋', '面条', '米饭', '馒头', '鸡蛋', '鸭子', '鱼', '虾', '蟹', '贝壳', '蜜蜂', '蚂蚁', '蜗牛', '蝴蝶', '螃蟹', '蟑螂', '蚊子', '蜘蛛', '蝉', '蜥蜴', '蚁子', '蝎子', '兔子', '乌龟', '鸭子', '猪', '鹅', '青蛙', '老鼠', '蝴蝶', '蜜蜂', '老虎', '熊猫', '大象', '海豚', '鲨鱼', '鹦鹉', '狐狸', '狼', '驯鹿', '河马', '犀牛', '斑马', '孔雀', '骆驼', '长颈鹿', '猫', '狗', '鸟', '马', '牛', '羊', '鸡', '兔子', '乌龟', '鸭子', '猪', '鹅', '青蛙', '老鼠', '蝴蝶', '蜜蜂', '老虎', '熊猫', '大象', '海豚', '鲨鱼', '鹦鹉', '狐狸', '狼', '驯鹿', '河马', '犀牛', '斑马', '孔雀', '骆驼', '火锅', '汉堡', '披萨', '面条', '冰淇淋', '蛋糕', '咖啡', '奶茶', '苹果', '香蕉', '葡萄', '西瓜', '草莓', '寿司', '烤串', '薯条', '爆米花', '棉花糖', '手机', '电脑', '电视', '电风扇', '雨伞', '剪刀', '台灯', '手套', '围裙', '吉他', '钢琴', '画板', '遥控器', '闹钟', '眼镜', '耳机', '滑板', '篮球', '足球', '哑铃'];
    
    topicButton.addEventListener('click', () => {
        const topicIdx = Math.floor(Math.random() * topics.length);
        gameIntro.textContent = `题目：${topics[topicIdx]}`;
    });
    if(randomGameButton) {
        randomGameButton.addEventListener('click', () => {
            const idx = Math.floor(Math.random() * games.length);
            gameDisplay.textContent = games[idx].name;
            gameIntro.textContent = games[idx].intro;
    
            if (games[idx].name === '你画我猜') {
                topicButton.style.display = 'block';
            } else {
                topicButton.style.display = 'none';
            }
        });
    }

    const wheelCanvas = document.getElementById('wheelCanvas');
    const spinButton = document.getElementById('spinButton');
    const resultText = document.getElementById('resultText');
    const modeSelector = document.querySelector('.mode-selector');
    const lotteryWheelDiv = document.querySelector('.lottery-wheel');
    const instructionsDiv = document.querySelector('.instructions');
    const resultDiv = document.querySelector('.result');
    const truthModeButton = document.getElementById('truthModeButton');
    const dareModeButton = document.getElementById('dareModeButton');
    const backToModeSelectionButton = document.getElementById('backToModeSelectionButton');

    const ctx = wheelCanvas.getContext('2d');

    const truthOptionsBase = [
        '真心话：说出你最近一次撒谎是什么时候？',
        '真心话：你最尴尬的经历是什么？',
        '真心话：你手机里最近一张照片是什么？',
        '真心话：你上一次哭是什么时候，为什么？',
        '真心话：如果可以拥有一种超能力，你希望是什么？',
        '真心话：你做过最大胆的事情是什么？'
    ];

    const dareOptionsBase = [
        '大冒险：模仿一个你认识的人，直到有人猜出来。',
        '大冒险：用屁股写出自己的名字。',
        '大冒险：给通讯录第一个异性发“我想你了”。',
        '大冒险：闭眼让右边的人在你脸上画画。',
        '大冒险：原地转10圈。',
        '大冒险：学猫叫三声。',
        '大冒险：做10个俯卧撑/深蹲。'
    ];

    const rewardsAndPunishments = [
        '奖励：获得一次免罚机会（下次抽到的大冒险和真心话将不会被惩罚）。',
        '惩罚：唱一首歌片段。',
        '奖励：指定下一个人来回答你的真心话或大冒险或惩罚。',
        '惩罚：回答一个指定问题或大冒险。',
    ];

    let currentOptions = [];
    const specialOption = '特殊任务：为大家表演一个节目！';
    let arc = 0; // Will be calculated based on currentOptions.length
    let spinCount = 0;
    let forcedSpinTurn = Math.floor(Math.random() * 2) + 4;
    let startAngle = 0;
    let spinTimeout = null;
    let spinAngleStartValue = 10; // Renamed to avoid conflict
    let spinTime = 0;
    let spinTimeTotal = 0;

    const colors = ["#FFD700", "#FF6347", "#ADFF2F", "#40E0D0", "#EE82EE", "#6495ED", "#FFDEAD", "#98FB98"];

    function initializeMode(modeOptions, modeName) {
        currentOptions = [...modeOptions];
        // 仅在真心话或大冒险模式下，50%概率混入奖励和惩罚
        if ((modeName === '真心话' || modeName === '大冒险') && Math.random() < 0.5) {
        // 随机插入一条奖励或惩罚
        const rp = rewardsAndPunishments[Math.floor(Math.random() * rewardsAndPunishments.length)];
        currentOptions.push(rp);
        }
        if (currentOptions.length < 2) {
            currentOptions.push("选项不足1", "选项不足2"); 
        }
        arc = Math.PI / (currentOptions.length / 2);
        spinCount = 0;
        forcedSpinTurn = Math.floor(Math.random() * 2) + 4;
        console.log(`当前模式选项:`, currentOptions);
        resultText.textContent = '---';
        spinButton.disabled = false;
        drawRouletteWheel();

        // 标题切换
        document.getElementById('mainTitle').style.display = 'none';
        const modeTitle = document.getElementById('modeTitle');
        modeTitle.style.display = '';
        modeTitle.textContent = modeName + '转盘';
        modeSelector.style.display = 'none';
        lotteryWheelDiv.style.display = 'flex';
        instructionsDiv.style.display = 'block';
        resultDiv.style.display = 'block';
        backToModeSelectionButton.style.display = 'inline-block';
    }

    // 新增：spinButton 随机选择模式
    spinButton.addEventListener('click', () => {
        // 如果当前还在模式选择界面，则随机进入一个模式
        if (modeSelector.style.display !== 'none') {
            if (Math.random() < 0.5) {
                initializeMode(truthOptionsBase, '真心话');
            } else {
                initializeMode(dareOptionsBase, '大冒险');
            }
        } else {
            // 如果已经在转盘界面，则直接执行抽奖
            spin();
        }
    });

    truthModeButton.addEventListener('click', () => initializeMode(truthOptionsBase, '真心话'));
    dareModeButton.addEventListener('click', () => initializeMode(dareOptionsBase, '大冒险'));

    backToModeSelectionButton.addEventListener('click', () => {
        modeSelector.style.display = 'flex';
        lotteryWheelDiv.style.display = 'none';
        instructionsDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        backToModeSelectionButton.style.display = 'none';
        resultText.textContent = '---';
        clearTimeout(spinTimeout); // Stop any ongoing animation
        // 标题还原
        document.getElementById('mainTitle').style.display = '';
        document.getElementById('modeTitle').style.display = 'none';
    });

    function drawRouletteWheel() {
        if (currentOptions.length === 0) return; // Don't draw if no options
        const outsideRadius = wheelCanvas.width / 2 - 10;
        const textRadius = outsideRadius - 35; // Adjusted for better text placement
        const insideRadius = 0;

        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 1;
        ctx.font = '10px Arial'; // Adjusted font size

        for (let i = 0; i < currentOptions.length; i++) {
            const angle = startAngle + i * arc;
            ctx.fillStyle = colors[i % colors.length];

            ctx.beginPath();
            ctx.arc(wheelCanvas.width / 2, wheelCanvas.height / 2, outsideRadius, angle, angle + arc, false);
            ctx.arc(wheelCanvas.width / 2, wheelCanvas.height / 2, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "#000";
            ctx.translate(wheelCanvas.width / 2 + Math.cos(angle + arc / 2) * textRadius,
                          wheelCanvas.height / 2 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            // const text = currentOptions[i]; // To show full text
            const text = `选项 ${i + 1}`;
            wrapText(ctx, text, 0, 0, wheelCanvas.width / currentOptions.length - 15, 12); // Dynamic maxWidth
            ctx.restore();
        }

        // Arrow
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(wheelCanvas.width / 2 - 6, wheelCanvas.height / 2 - (outsideRadius + 10)); // Adjusted arrow position
        ctx.lineTo(wheelCanvas.width / 2 + 6, wheelCanvas.height / 2 - (outsideRadius + 10));
        ctx.lineTo(wheelCanvas.width / 2, wheelCanvas.height / 2 - (outsideRadius - 0)); // Adjusted arrow tip
        ctx.fill();
        ctx.closePath();
    }

    function spin() {
        if (currentOptions.length === 0) {
            resultText.textContent = '请先选择一个模式！';
            return;
        }
        spinCount++;
        resultText.textContent = '旋转中...';
        spinButton.disabled = true;
        spinAngleStartValue = Math.random() * 20 + 35;
        spinTime = 0;
        spinTimeTotal = Math.random() * 2500 + 3000;
        animateRotation();
    }

    function animateRotation() {
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            stopRotateWheel();
            return;
        }
        // Corrected easeOut usage if it's a custom one, or use a standard one.
        // Assuming a simple linear decay for now, or use the previous easeOut if defined elsewhere.
        const spinAngle = spinAngleStartValue * (1 - spinTime / spinTimeTotal); // Simple linear decay
        startAngle += (spinAngle * Math.PI / 180);
        drawRouletteWheel();
        spinTimeout = setTimeout(animateRotation, 30);
    }

    function stopRotateWheel() {
        clearTimeout(spinTimeout);
        const degrees = startAngle * 180 / Math.PI + 90; // Adjustment for arrow position
        const arcd = arc * 180 / Math.PI;
        let index;

        if (spinCount === forcedSpinTurn && currentOptions.includes(specialOption)) {
            index = currentOptions.indexOf(specialOption);
            console.log(`第 ${spinCount} 次抽奖，强制选中特殊选项: ${currentOptions[index]}`);
        } else {
            // Ensure calculation is correct for pointing at top arrow
            index = Math.floor(((360 - degrees % 360) % 360) / arcd) % currentOptions.length;
            if (index < 0) index += currentOptions.length; // Ensure positive index
            console.log(`正常抽奖，随机结果: ${currentOptions[index]}`);
        }
        
        if (index >= 0 && index < currentOptions.length) {
             resultText.innerHTML = `<span style="color: #e74c3c; font-weight: bold;">${currentOptions[index]}</span>`;
        } else {
            resultText.textContent = '抽奖出错，请重试';
            console.error('Selected index out of bounds:', index, 'currentOptions length:', currentOptions.length);
        }
        spinButton.disabled = false;
    }

    function easeOut(t, b, c, d) { // Assuming this was the intended easeOut function
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }
    
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        const linesArray = [];

        for (let n = 0; n < words.length; n++) {
            testLine += `${words[n]} `;
            const metrics = ctx.measureText(testLine.trim());
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                linesArray.push(line.trim());
                line = `${words[n]} `;
                testLine = `${words[n]} `;
            } else {
                line = testLine;
            }
        }
        linesArray.push(line.trim());

        const totalTextHeight = linesArray.length * lineHeight;
        let currentY = y - (totalTextHeight / 2) + (lineHeight / 2); 

        for (let i = 0; i < linesArray.length; i++) {
            ctx.fillText(linesArray[i], x, currentY);
            currentY += lineHeight;
        }
    }

    spinButton.addEventListener('click', spin);

    // Initial state: show mode selector, hide wheel
    modeSelector.style.display = 'flex';
    lotteryWheelDiv.style.display = 'none';
    instructionsDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    backToModeSelectionButton.style.display = 'none';
});