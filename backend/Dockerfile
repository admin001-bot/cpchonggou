# 构建阶段
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 安装依赖
COPY go.mod ./
RUN go mod download || true

# 复制源码并构建
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server

# 运行阶段
FROM alpine:latest

WORKDIR /app

# 安装ca证书
RUN apk --no-cache add ca-certificates

# 复制构建产物
COPY --from=builder /app/main .
COPY --from=builder /app/config ./config

EXPOSE 8080

CMD ["./main"]
