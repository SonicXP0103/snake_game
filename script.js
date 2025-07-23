// #region 常數定義

const SNAKE_SIZE      = 20; // 蛇身節點大小
const UPDATE_INTERVAL = 150; // 更新間隔時間（毫秒）

// #endregion 常數定義

// #region 音效定義
const SOUND = {
    eat: new Audio("sounds/eat.mp3"), // 吃到食物音效
    gameover: new Audio("sounds/gameover.mp3"), // 遊戲結束音效
}
// #endregion 音效定義

// #region 存取資料

// 是否已初始化遊戲
let isInitialized = false; 

// 當前方向
let currentDirection = null;

// 遊戲狀態 (0: 未開始, 1: 進行中, 2: 結束)
let gameStatus = 0; 

// 蛇的身體初始位置
let snake = [
  { x: 100, y: 100 },
  { x: 80, y: 100 },
  { x: 60, y: 100 }
];

// 食物位置初始為 (0, 0)
let food = { x: 0, y: 0 };

// 用來清除 setInterval
let intervalId = null;

// 分數
let score = 0;

// 難度等級
let level = 1;

// 手機滑動方向控制
let touchStartX = 0;
let touchStartY = 0;

// #endregion 存取資料

// #region 自訂義函數

/**
 * @brief: 遊戲開始函數
 * @details: 初始化遊戲狀態，若遊戲已經開始則不執行
 */
function Start()
{
    // 初始化遊戲狀態
    gameStatus = 1; // 設定為進行中

    // 重置分數
    score = 0;

    // 重置蛇的身體
    snake = [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 }
    ];

    // 設定初始方向
    currentDirection = "right";

    // 生成食物
    GenerateFood();

    // 更新分數 UI
    UpdateScoreUI();
}

/**
 * @brief: 更新遊戲狀態函數
 * @details: 每隔一段時間移動蛇的身體
 */
function Update()
{
    if (isInitialized === false || gameStatus !== 1) {
        return; // 如果遊戲未初始化或未開始，則不執行更新
    }

    moveSnake(currentDirection);

    RenderPanel();
}

// 渲染整個畫布
function RenderPanel()
{
    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 渲染蛇的身體
    RenderSnake();

    // 渲染食物
    RenderFood();

    // 渲染分數
    //RenderScore();

    // 遊戲結束時渲染結束畫面
    if (gameStatus === 2) {
        RenderGameOver()
    }
}

// @brief 渲染蛇的身體
function RenderSnake()
{
    // 畫一個方塊（當作蛇的身體）
    ctx.fillStyle = "#66ff66"; // 綠色
    //ctx.fillRect(100, 100, 20, 20); // (x, y, 寬, 高)
    
    // 畫身體節點的外框
    ctx.strokeStyle = "#000000"; // 黑色
    ctx.lineWidth = 2; // 線寬
    
    // 繪製蛇的身體
    for (let i = 0; i < snake.length; i++)
    {
        ctx.fillRect(snake[i].x, snake[i].y, SNAKE_SIZE, SNAKE_SIZE);
        ctx.strokeRect(snake[i].x, snake[i].y, SNAKE_SIZE, SNAKE_SIZE);
    }
}   

/**
 * @brief: 渲染食物
 * @details: 在畫布上渲染食物，使用紅色方塊或Emoji
*/
function RenderFood()
{
    // 紅色樣式
    // ctx.fillStyle = "#ff0000"; // 紅色
    // ctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);
    
    // 改畫Emoji的蘋果
    ctx.font = "20px Arial"; // 設定字體大小
    ctx.fillStyle = "#ff0000"; // 紅色
    ctx.fillText("🍎", food.x + 2, food.y + 18); // 畫蘋果Emoji，調整位置以對齊格子
    ctx.strokeStyle = "#000000"; // 黑色邊框
    ctx.lineWidth = 1; // 邊框寬度
    ctx.strokeText("🍎", food.x + 2, food.y + 18); // 畫蘋果Emoji邊框    
}

/***
 * @brief: 渲染分數(主框架中，已棄用)
 * @details: 在遊戲層畫布上渲染分數，使用藍色字體
 */
function RenderScore()
{
    ctx.fillStyle = "#283adbff";
    ctx.font = "20px Arial";
    ctx.fillText("分數：" + score, 10, 30);
}

function RenderGameOver()
{
    message = "遊戲結束";

    // 顯示遊戲結束訊息
    //alert(message);
    
    // 顯示結束畫面
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 半透明背景

    ctx.fillStyle = "#ffffff";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "24px Arial";
    ctx.fillText("分數：" + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("點擊重新開始", canvas.width / 2, canvas.height / 2 + 60);    
}

/**
 * @brief: 移動蛇的函數
 * @param {string} direction - 移動方向，可以是 "up", "down", "left", "right"
 * @return: 無
 */
function moveSnake(direction)
{
    // 取得蛇頭位置
    let head = snake[0];
    
    // 根據方向移動蛇頭
    let newHead = { x: head.x, y: head.y };
    
    switch (direction)
    {
        case "up":
            newHead.y -= SNAKE_SIZE;
            break;
        case "down":
            newHead.y += SNAKE_SIZE;
            break;
        case "left":
            newHead.x -= SNAKE_SIZE;
            break;
        case "right":
            newHead.x += SNAKE_SIZE;
            break;
    }

    // 檢查是否死亡
    if (CheckGameOver())
    {
        endGame(); // 如果死亡，則結束遊戲
        return; // 結束函數執行
    }

    // 檢查蛇是否吃到食物
    if (CheckFoodCollision(newHead))
    {
        // 如果吃到食物，則不移除尾部節點
        // 但需要在頭部添加新的節點
        snake.unshift(newHead); // 在頭部添加新的節點
    }
    else
    {
        // 如果沒有吃到食物，則移除尾部節點
        snake.pop(); // 移除尾部節點
        snake.unshift(newHead); // 在頭部添加新的節點
    }
}

/**
 * @brief: 生成食物位置
 * @details: 隨機產生一個合法位置，並確保不與蛇
 <註> 可優化改Grid系統，使用格子對齊
 */
function GenerateFood()
{
    let valid = false; // 是否為合法位置（沒有重疊）

    while (!valid)
    {
        // 隨機產生一個食物座標，必須對齊格子
        let x = Math.floor(Math.random() * (canvas.width / SNAKE_SIZE)) * SNAKE_SIZE;
        let y = Math.floor(Math.random() * (canvas.height / SNAKE_SIZE)) * SNAKE_SIZE;

        // 預設為合法位置
        valid = true;

        // 檢查是否與蛇的任一節點重疊
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === x && snake[i].y === y) {
                valid = false; // 如果有重疊，就設為非法，重新亂數
                break;
            }
        }

        // 如果沒有重疊，就設置這個位置為新的食物位置
        if (valid) {
            food.x = x;
            food.y = y;
        }
    }
}
/**
 * @brief: 檢查蛇是否吃到食物
 * @details: 如果蛇頭位置與食物位置相同，則增加蛇的長度並生成新的食物
 * @param {Object} newHead - 新的蛇頭位置，包含 x 和 y 屬性
 * @return: boolean - 如果吃到食物返回 true，否則返回 false
 */
function CheckFoodCollision(newHead)
{
    if (newHead.x === food.x && newHead.y === food.y)
    {
        score += level; // 增加分數
        GenerateFood(); // 生成新的食物

        // 更新分數 UI
        UpdateScoreUI();

        // 播放吃到食物音效
        SOUND.eat.currentTime = 0; // 重置音效播放時間
        SOUND.eat.play(); // 播放音效

        return true; // 返回 true 表示吃到食物
    }

    return false; // 返回 false 表示沒有吃到食物
}

/**
 * @brief: 檢查是否死亡
 * @details: 檢查蛇頭是否碰到牆壁或自身
 * @return: boolean - 如果死亡返回 true，否則返回 false
 */
function CheckGameOver()
{
    // 檢查蛇頭是否碰到牆壁
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height)
    {
        return true; // 碰到牆壁，遊戲結束
    }

    // 檢查蛇頭是否碰到自身
    for (let i = 1; i < snake.length; i++)
    {
        if (head.x === snake[i].x && head.y === snake[i].y)
        {
            return true; // 碰到自身，遊戲結束
        }
    }

    // 沒有死亡
    return false;
}

// 開始遊戲按鈕
function startGame()
{
    // 已初始化
    if (isInitialized){
        return;
    }

    isInitialized = true;

    // 設定更新循環
    intervalId = setInterval(() => {
        Update();
    }, UPDATE_INTERVAL);

    Start();
}

// 重新開始遊戲按鈕
function resetGame()
{
    clearInterval(intervalId);
    isInitialized = false;
    currentDirection = null;

    startGame()
}

// 結束遊戲
function endGame()
{
    gameStatus = 2;
    clearInterval(intervalId);
    isInitialized = false;
    currentDirection = null;

    // 播放遊戲結束音效
    SOUND.gameover.currentTime = 0;
    SOUND.gameover.play();

    // 震動 500 毫秒（手機）
    if (navigator.vibrate) {
        navigator.vibrate(500);
    }
}

function resizeCanvasIfMobile()
{
    const canvas = document.getElementById("gameCanvas");

    // 檢查是否為手機版
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile)
    {   
        console.log("手機版");

        const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;

        canvas.style.width = size + "px";
        canvas.style.height = size + "px";

        canvas.width = size;
        canvas.height = size;
    }
    else
    {
        console.log("電腦版");

        // 💻 電腦版保持固定尺寸
        canvas.style.width = "400px";
        canvas.style.height = "400px";

        canvas.width = 400;
        canvas.height = 400;
    }
}

// #endregion 自訂義函數

// #region UI

/**
 * @brief: 更新分數 UI 顯示
 */
function UpdateScoreUI()
{
    const scoreBoard = document.getElementById("scoreBoard");
    if (scoreBoard) {
        scoreBoard.innerText = "分數：" + score;
    }
}

// #endregion UI

// ===== 主要邏輯 =====

// 取得 canvas 與畫布內容
const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

// 初始化畫布大小
resizeCanvasIfMobile();

// 螢幕尺寸變化時也要調整
window.addEventListener("resize", resizeCanvasIfMobile);


// 監聽鍵盤事件
document.addEventListener("keydown", function(e)
{
    if (!isInitialized || gameStatus !== 1) {
        return; // 如果遊戲未初始化或未開始，則不處理鍵盤
    }

    switch (e.key)
    {
        case "ArrowUp":                
            if(currentDirection !== "down")                    
                currentDirection = "up";
                console.log("向上");
        break;
        case "ArrowDown":
            if(currentDirection !== "up")
                currentDirection = "down";
                console.log("向下");
        break;
        case "ArrowLeft":
            if(currentDirection !== "right")
                currentDirection = "left";
                console.log("向左");
            break;
        case "ArrowRight":
            if(currentDirection !== "left")
                currentDirection = "right";
                console.log("向右");
        break;
    }
});

// 監聽觸控事件
canvas.addEventListener("touchstart", function(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

// 監聽觸控結束事件
canvas.addEventListener("touchend", function(e) {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    // 判斷滑動方向（避免誤觸小滑動）
    if (Math.abs(dx) > Math.abs(dy)) {
        // 左右滑動
        if (dx > 30 && currentDirection !== "left") {
            currentDirection = "right";
        } else if (dx < -30 && currentDirection !== "right") {
            currentDirection = "left";
        }
    } else {
        // 上下滑動
        if (dy > 30 && currentDirection !== "up") {
            currentDirection = "down";
        } else if (dy < -30 && currentDirection !== "down") {
            currentDirection = "up";
        }
    }
}, false);
