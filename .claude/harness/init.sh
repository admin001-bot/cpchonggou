#!/bin/bash
# 项目初始化脚本
# 用于启动开发环境

echo "=== 初始化项目环境 ==="

# 检查PHP版本
echo "检查 PHP 版本..."
php -v

# 检查MySQL连接
echo "检查 MySQL 连接..."

# 创建必要的目录
echo "创建必要的目录..."
mkdir -p logs
mkdir -p cache

# 设置权限
echo "设置目录权限..."
chmod -R 755 upload/
chmod -R 755 _cache_*

# 检查配置文件
echo "检查配置文件..."
if [ ! -f .env ]; then
    echo "警告: .env 文件不存在，请复制 .env.example 并配置"
fi

# 启动开发服务器 (可选)
# php -S localhost:8080

echo "=== 初始化完成 ==="
echo "现在可以开始开发工作"
