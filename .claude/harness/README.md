# 长期运行代理框架

基于 Anthropic 的 ["Effective Harnesses for Long-Running Agents"](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) 文章实现。

## 核心概念

### 问题
AI代理在有限的上下文窗口中工作，每次新会话开始时都没有之前工作的记忆。这就像一个软件项目中的工程师轮班工作，每个新工程师到达时都不记得上一班发生了什么。

### 解决方案
使用两种专门的代理：

1. **初始化代理**: 仅在第一个会话中运行
   - 设置开发环境
   - 创建功能测试列表
   - 创建初始化脚本
   - 初始化 git 仓库

2. **编码代理**: 在所有后续会话中运行
   - 读取进度文件了解历史
   - 每次只处理一个功能
   - 测试验证后更新状态
   - 提交并更新进度记录

## 目录结构

```
.claude/harness/
├── feature_list.json      # 功能测试列表 (核心!)
├── claude-progress.txt    # 会话进度日志
├── app_spec.txt           # 项目规范说明
├── init.sh                # 初始化脚本
├── agent.py               # 代理运行脚本
├── prompts/
│   ├── initializer_prompt.md  # 初始化代理提示
│   └── coding_prompt.md       # 编码代理提示
└── README.md              # 本文档
```

## 功能列表格式

```json
[
  {
    "id": 1,
    "category": "security|functional|performance|refactor|documentation",
    "priority": "critical|high|medium|low",
    "description": "功能描述",
    "steps": [
      "测试步骤1",
      "测试步骤2",
      "验证预期结果"
    ],
    "passes": false
  }
]
```

**重要规则：**
- `passes` 字段初始为 `false`
- 功能标记完成后，只能修改 `passes` 为 `true`
- 不能删除或修改已完成功能的其他字段

## 使用方法

### 查看当前状态
```bash
python .claude/harness/agent.py --status
```

### 开始开发会话
1. 阅读编码代理提示: `.claude/harness/prompts/coding_prompt.md`
2. 按照提示的步骤执行
3. 完成后更新进度文件

### 关键原则

1. **一个功能一个会话** - 不要同时处理多个功能
2. **质量优于速度** - 确保每个功能完全测试通过
3. **保持干净状态** - 会话结束时提交所有更改
4. **详细记录** - 进度文件记录关键决策

## 参考资料

- [原文: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [GitHub: anthropics/claude-quickstarts](https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding)
