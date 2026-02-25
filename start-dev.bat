@echo off
chcp 65001 >nul
echo ==========================================
echo   彩票系统开发环境启动脚本
echo ==========================================
echo.

REM 检查Docker是否运行
docker info >nul 2>&1
if errorlevel 1 (
    echo 错误: Docker未运行，请先启动Docker Desktop
    pause
    exit /b 1
)

echo 停止现有容器...
docker-compose -f docker-compose.dev.yml down 2>nul

echo.
echo 构建并启动开发环境 (首次启动需要导入186MB数据库，请耐心等待)...
docker-compose -f docker-compose.dev.yml up --build -d

echo.
echo 等待服务启动...
timeout /t 5 /nobreak >nul

echo.
echo ==========================================
echo   开发环境已启动!
echo ==========================================
echo.
echo 访问地址:
echo   前端 (Vue):  http://localhost:3000
echo   后端 (Go):   http://localhost:8080
echo   数据库:      localhost:3306 (用户: pj, 密码: pj)
echo.
echo 查看日志:
echo   docker-compose -f docker-compose.dev.yml logs -f
echo.
echo 停止服务:
echo   docker-compose -f docker-compose.dev.yml down
echo.
pause
