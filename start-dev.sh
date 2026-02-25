#!/bin/bash
# 启动开发环境

echo "=========================================="
echo "  彩票系统开发环境启动脚本"
echo "=========================================="
echo ""

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "错误: Docker未运行，请先启动Docker Desktop"
    exit 1
fi

echo "停止现有容器..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null

echo ""
echo "构建并启动开发环境 (首次启动需要导入186MB数据库，请耐心等待)..."
docker-compose -f docker-compose.dev.yml up --build -d

echo ""
echo "等待服务启动..."
sleep 5

# 检查MySQL是否就绪
echo "检查MySQL状态..."
for i in {1..30}; do
    if docker exec lottery-mysql-dev mysqladmin ping -h localhost -pj > /dev/null 2>&1; then
        echo "MySQL已就绪!"
        break
    fi
    echo "等待MySQL... ($i/30)"
    sleep 2
done

echo ""
echo "=========================================="
echo "  开发环境已启动!"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  前端 (Vue):  http://localhost:3000"
echo "  后端 (Go):   http://localhost:8080"
echo "  数据库:      localhost:3306 (用户: pj, 密码: pj)"
echo ""
echo "查看日志:"
echo "  docker-compose -f docker-compose.dev.yml logs -f"
echo ""
echo "查看单个服务日志:"
echo "  docker logs lottery-frontend-dev -f"
echo "  docker logs lottery-backend-dev -f"
echo "  docker logs lottery-mysql-dev -f"
echo ""
echo "停止服务:"
echo "  docker-compose -f docker-compose.dev.yml down"
echo ""
