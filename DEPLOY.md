# 一键部署指南

## 快速部署命令

```bash
# 1. 克隆仓库
git clone https://github.com/your-org/lottery-system.git

# 2. 进入目录
cd lottery-system

# 3. 一键部署
chmod +x deploy.sh
./deploy.sh deploy
```

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- Git

## 访问地址

部署完成后访问：
- 前端: http://服务器IP
- 后端API: http://服务器IP:8080
- 日志可视化: http://服务器IP:5601

## 常用命令

```bash
# 查看状态
./deploy.sh status

# 查看日志
./deploy.sh logs backend

# 停止服务
./deploy.sh stop

# 重启服务
./deploy.sh restart
```
