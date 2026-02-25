# 浏览器调试MCP服务器

这是一个基于Puppeteer的MCP服务器，用于本地浏览器调试。

## 安装

依赖已自动安装完成。包含：
- Puppeteer (浏览器自动化)
- @modelcontextprotocol/sdk (MCP SDK)

## 可用工具

- `browser_navigate` - 导航到指定URL
- `browser_screenshot` - 截图
- `browser_click` - 点击元素
- `browser_type` - 输入文本
- `browser_evaluate` - 执行JavaScript
- `browser_get_html` - 获取页面HTML
- `browser_close` - 关闭浏览器

## Claude Code配置

将以下内容添加到Claude Code的配置文件中：

```json
{
  "mcpServers": {
    "puppeteer-browser": {
      "command": "node",
      "args": ["C:/Users/Administrator/Desktop/chonggou/mcp-browser/index.js"]
    }
  }
}
```

Claude Code配置文件位置：
- Windows: `%APPDATA%/Claude/settings.json`
- 或使用 `/claude configure mcp` 命令配置

## 启动测试

```bash
cd C:\Users\Administrator\Desktop\chonggou\mcp-browser
node index.js
```
