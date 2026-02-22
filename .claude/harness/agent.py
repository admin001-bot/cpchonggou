#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
长期运行代理框架
基于 Anthropic 的 "Effective Harnesses for Long-Running Agents" 方法论

用法:
    python agent.py --project-dir /path/to/project --max-iterations 10
"""

import os
import sys
import json
import argparse
import subprocess
from datetime import datetime
from pathlib import Path

# 设置Windows控制台UTF-8编码
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except:
        pass

# 配置
HARNESS_DIR = ".claude/harness"
FEATURE_LIST_FILE = "feature_list.json"
PROGRESS_FILE = "claude-progress.txt"
APP_SPEC_FILE = "app_spec.txt"
INIT_SCRIPT = "init.sh"


def load_feature_list(project_dir: Path) -> list:
    """加载功能列表"""
    feature_path = project_dir / HARNESS_DIR / FEATURE_LIST_FILE
    if not feature_path.exists():
        print(f"错误: 功能列表文件不存在: {feature_path}")
        return []

    with open(feature_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def count_remaining_features(features: list) -> tuple:
    """统计剩余功能数量"""
    total = len(features)
    completed = sum(1 for f in features if f.get('passes', False))
    remaining = total - completed
    return total, completed, remaining


def get_next_feature(features: list) -> dict:
    """获取下一个要处理的功能"""
    priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
    category_order = {'setup': 0, 'security': 1, 'functional': 2, 'performance': 3, 'refactor': 4, 'documentation': 5}

    incomplete = [f for f in features if not f.get('passes', False)]
    if not incomplete:
        return None

    # 按优先级和类别排序
    incomplete.sort(key=lambda x: (
        priority_order.get(x.get('priority', 'low'), 3),
        category_order.get(x.get('category', 'functional'), 1),
        x.get('id', 999)
    ))

    return incomplete[0]


def print_session_header(session_num: int, is_first: bool):
    """打印会话头"""
    print("\n" + "=" * 60)
    print(f"  会话 #{session_num} - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  类型: {'初始化会话' if is_first else '编码会话'}")
    print("=" * 60)


def print_progress(features: list):
    """打印进度摘要"""
    total, completed, remaining = count_remaining_features(features)
    percentage = (completed / total * 100) if total > 0 else 0

    print(f"\n[进度摘要]")
    print(f"   总计: {total} 个功能")
    print(f"   已完成: {completed} 个")
    print(f"   剩余: {remaining} 个")
    print(f"   完成率: {percentage:.1f}%")


def update_progress_file(project_dir: Path, session_num: int, work_done: str, next_steps: str):
    """更新进度文件"""
    progress_path = project_dir / HARNESS_DIR / PROGRESS_FILE

    entry = f"""
### 会话 {session_num} - {datetime.now().strftime('%Y-%m-%d')}
**类型**: 编码会话
**状态**: 已完成

#### 完成的工作
{work_done}

#### 下一步计划
{next_steps}

---
"""

    with open(progress_path, 'a', encoding='utf-8') as f:
        f.write(entry)


def run_git_status(project_dir: Path):
    """检查 git 状态"""
    result = subprocess.run(
        ['git', 'status', '--short'],
        cwd=project_dir,
        capture_output=True,
        text=True
    )
    return result.stdout.strip()


def check_git_repo(project_dir: Path) -> bool:
    """检查是否是 git 仓库"""
    git_dir = project_dir / '.git'
    return git_dir.exists()


def print_instructions(session_num: int, is_first: bool, project_dir: Path):
    """打印下一步指导"""
    features = load_feature_list(project_dir)
    next_feature = get_next_feature(features)

    print("\n" + "-" * 60)
    print("[下一步操作指南]")
    print("-" * 60)

    if is_first:
        print("""
1. 阅读项目规范:
   - 读取 .claude/harness/app_spec.txt

2. 审查功能列表:
   - 查看 .claude/harness/feature_list.json
   - 添加或修改功能测试

3. 初始化环境:
   - 运行 .claude/harness/init.sh

4. 创建初始提交 (如果还没有):
   - git add .
   - git commit -m "Initial commit"
""")
    else:
        if next_feature:
            print(f"""
1. 获取上下文:
   - git log --oneline -10
   - cat .claude/harness/claude-progress.txt

2. 下一个要处理的功能 (#{next_feature['id']}):
   类别: {next_feature['category']}
   优先级: {next_feature['priority']}
   描述: {next_feature['description']}

3. 测试步骤:
""")
            for i, step in enumerate(next_feature.get('steps', []), 1):
                print(f"   {i}. {step}")
        else:
            print("\n[完成] 所有功能已完成!")

    print("\n" + "-" * 60)


def main():
    parser = argparse.ArgumentParser(description='长期运行代理框架')
    parser.add_argument('--project-dir', type=str, default='.',
                        help='项目目录路径')
    parser.add_argument('--max-iterations', type=int, default=None,
                        help='最大迭代次数')
    parser.add_argument('--status', action='store_true',
                        help='只显示当前状态')

    args = parser.parse_args()
    project_dir = Path(args.project_dir).resolve()

    # 检查项目目录
    harness_path = project_dir / HARNESS_DIR
    if not harness_path.exists():
        print(f"错误: 代理框架未初始化: {harness_path}")
        print("请确保 .claude/harness/ 目录存在")
        sys.exit(1)

    # 加载功能列表
    features = load_feature_list(project_dir)
    if not features:
        print("警告: 功能列表为空")

    # 只显示状态
    if args.status:
        print_progress(features)
        next_feature = get_next_feature(features)
        if next_feature:
            print(f"\n下一个功能: #{next_feature['id']} - {next_feature['description']}")
        return

    # 显示进度
    print_progress(features)

    # 显示下一步指导
    is_first = not check_git_repo(project_dir)
    print_instructions(1, is_first, project_dir)


if __name__ == '__main__':
    main()
