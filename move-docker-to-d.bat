@echo off
echo ========================================
echo 迁移 Docker Desktop 数据到 D 盘
echo ========================================
echo.

REM 停止 Docker Desktop
echo 正在停止 Docker Desktop...
taskkill /F /IM "Docker Desktop.exe" 2>nul
taskkill /F /IM "com.docker.backend.exe" 2>nul
taskkill /F /IM "com.docker.proxy.exe" 2>nul
timeout /t 5 /nobreak >nul

REM 关闭 WSL Docker
echo 正在关闭 Docker WSL...
wsl --terminate docker-desktop
wsl --terminate docker-desktop-data
timeout /t 3 /nobreak >nul

REM 创建目标目录
echo 创建目标目录...
if not exist "D:\Docker\wsl" mkdir "D:\Docker\wsl"

REM 导出 Docker data
echo 正在导出 Docker data (这可能需要几分钟)...
wsl --export docker-desktop-data "D:\Docker\wsl\docker-desktop-data.tar"

REM 注销原 docker-desktop-data
echo 正在注销原 docker-desktop-data...
wsl --unregister docker-desktop-data

REM 导入到 D 盘
echo 正在导入到 D 盘...
wsl --import docker-desktop-data "D:\Docker\wsl\data" "D:\Docker\wsl\docker-desktop-data.tar" --version 2

REM 清理临时文件
echo 清理临时文件...
del "D:\Docker\wsl\docker-desktop-data.tar"

echo.
echo ========================================
echo 迁移完成！
echo ========================================
echo 请重新启动 Docker Desktop
echo.
pause
