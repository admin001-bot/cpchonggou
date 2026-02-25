---
name: webapp-testing
description: 一个使用Playwright与本地Web应用交互并进行测试的工具包。支持验证前端功能、调试UI行为、捕获浏览器截图以及查看浏览器日志。
license: Complete terms in LICENSE.txt
tags: playwright-testing, web-app-testing, local-development, automation-scripts,
  browser-automation
tags_cn: Playwright测试, Web应用测试, 本地开发, 自动化脚本, 浏览器自动化
---

# Web应用测试

要测试本地Web应用，请编写原生Python Playwright脚本。

**可用的辅助脚本**:
- `scripts/with_server.py` - 管理服务器生命周期（支持多服务器）

**请始终先使用`--help`运行脚本**查看使用方法。除非你尝试运行脚本后发现确实需要定制化解决方案，否则不要阅读源代码。这些脚本可能非常庞大，会占用你的上下文窗口。它们的设计目的是作为黑盒脚本直接调用，而非导入到你的上下文窗口中。

## 决策树：选择你的方法

```
用户任务 → 是静态HTML?
    ├─ 是 → 直接读取HTML文件以定位选择器
    │         ├─ 成功 → 使用选择器编写Playwright脚本
    │         └─ 失败/不完整 → 按动态应用处理（见下文）
    │
    └─ 否（动态Web应用） → 服务器是否已启动?
        ├─ 否 → 运行: python scripts/with_server.py --help
        │        然后使用该辅助脚本 + 编写简化的Playwright脚本
        │
        └─ 是 → 先侦察后执行:
            1. 导航并等待networkidle
            2. 截取屏幕截图或检查DOM
            3. 从渲染状态中定位选择器
            4. 使用找到的选择器执行操作
```

## 示例：使用with_server.py

要启动服务器，请先运行`--help`，然后使用该辅助脚本：

**单服务器:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**多服务器（例如：后端 + 前端）:**
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

要创建自动化脚本，只需包含Playwright逻辑（服务器会被自动管理）：
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173') # Server already running and ready
    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
```

## 侦察-执行模式

1. **检查渲染后的DOM**:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. 从检查结果中**定位选择器**

3. 使用找到的选择器**执行操作**

## 常见陷阱

❌ **不要**在动态应用的`networkidle`等待完成前检查DOM
✅ **务必**在检查前等待`page.wait_for_load_state('networkidle')`

## 最佳实践

- **将捆绑脚本作为黑盒使用** - 要完成任务时，先考虑`scripts/`目录下的可用脚本是否能提供帮助。这些脚本可可靠处理常见的复杂工作流，且不会占用上下文窗口。使用`--help`查看用法，然后直接调用。 
- 对于同步脚本，使用`sync_playwright()`
- 完成后务必关闭浏览器
- 使用描述性选择器: `text=`、`role=`、CSS选择器或ID
- 添加适当的等待: `page.wait_for_selector()`或`page.wait_for_timeout()`

## 参考文件

- **examples/** - 展示常见模式的示例:
  - `element_discovery.py` - 发现页面上的按钮、链接和输入框
  - `static_html_automation.py` - 对本地HTML使用file:// URL
  - `console_logging.py` - 在自动化过程中捕获控制台日志