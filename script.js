// #region 常數定義

const SNAKE_SIZE      = 20; // 蛇身節點大小
const UPDATE_INTERVAL = 150; // 更新間隔時間（毫秒）

// #endregion 常數定義

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

// #endregion 存取資料

// #region 自訂義函數

/**
 * brief: 遊戲開始函數
 * details: 初始化遊戲狀態，若遊戲已經開始則不執行
 */
function Start()
{
    // 初始化遊戲狀態
    gameStatus = 1; // 設定為進行中

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 重置蛇的身體
    snake = [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 }
    ];

    // 設定初始方向
    currentDirection = "right";

    // 初始渲染蛇的身體(靜止初始位置，可以省略)
    //RenderSnake();

    // 生成食物
    GenerateFood();
}

/**
 * brief: 更新遊戲狀態函數
 * details: 每隔一段時間移動蛇的身體
 */
function Update()
{
    if (isInitialized === false || gameStatus !== 1) {
        return; // 如果遊戲未初始化或未開始，則不執行更新
    }

    moveSnake(currentDirection);
}

/**
 * brief: 移動蛇的函數
 * param {string} direction - 移動方向，可以是 "up", "down", "left", "right"
 * return: 無
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
  
    // 渲染蛇的身體
    RenderSnake();
}

// 渲染蛇的身體
function RenderSnake()
{
    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    // ⬇️ 最後再畫食物（紅色）
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);
}   

function GenerateFood()
{
    food.x = Math.floor(Math.random() * (canvas.width / SNAKE_SIZE)) * SNAKE_SIZE;
    food.y = Math.floor(Math.random() * (canvas.height / SNAKE_SIZE)) * SNAKE_SIZE;
}

function RanderFood()
{
    ctx.fillStyle = "#ff0000"; // 紅色
    ctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);
}

/**
 * brief: 檢查蛇是否吃到食物
 * details: 如果蛇頭位置與食物位置相同，則增加蛇的長度並生成新的食物
 * param {Object} newHead - 新的蛇頭位置，包含 x 和 y 屬性
 * return: boolean - 如果吃到食物返回 true，否則返回 false
 */
function CheckFoodCollision(newHead)
{
    if (newHead.x === food.x && newHead.y === food.y)
    {
        GenerateFood(); // 生成新的食物
        return true; // 返回 true 表示吃到食物
    }

    return false; // 返回 false 表示沒有吃到食物
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

// #endregion 自訂義函數

// ===== 主要邏輯 =====

// 取得 canvas 與畫布內容
const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

// 監聽鍵盤事件
document.addEventListener("keydown", function(e)
{
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
