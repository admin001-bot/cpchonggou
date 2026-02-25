from playwright.sync_api import sync_playwright
import json

def test_user_center():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 捕获控制台日志
        console_messages = []
        page.on("console", lambda msg: console_messages.append(f"[{msg.type}] {msg.text}"))

        # 捕获页面错误
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        try:
            # 访问首页
            page.goto('http://localhost:3001/')
            page.wait_for_load_state('networkidle')
            print("首页加载成功")

            # 登录（如果需要）
            # 先检查是否已登录
            page.goto('http://localhost:3001/#/user')
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(2000)

            # 截图
            page.screenshot(path='/tmp/user_center.png', full_page=True)
            print("截图已保存到 /tmp/user_center.png")

            # 打印控制台日志
            print("\n=== Console Messages ===")
            for msg in console_messages:
                print(msg)

            # 打印页面错误
            if page_errors:
                print("\n=== Page Errors ===")
                for err in page_errors:
                    print(err)

            # 打印当前URL
            print(f"\nCurrent URL: {page.url}")

        except Exception as e:
            print(f"Error: {e}")

        browser.close()

if __name__ == "__main__":
    test_user_center()
