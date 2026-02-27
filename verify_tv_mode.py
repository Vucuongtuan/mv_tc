from playwright.sync_api import sync_playwright

def verify_tv_mode():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            # Navigate to the homepage
            page.goto("http://localhost:3000")

            # Wait for content to load, handling potential error overlay
            # We can't fix the API error, but we can try to verify the header button if it renders
            page.wait_for_timeout(5000)

            # Take a screenshot of the initial state (Web Mode)
            page.screenshot(path="verification_web_mode.png")
            print("Captured Web Mode screenshot")

            # Try to force the button visible if obscured by error overlay
            # Or just check if we can interact with it

            # Find and click the TV Mode toggle button
            # Look for button with title "Enter TV Mode" or similar aria-label
            tv_toggle = page.wait_for_selector('button[title="Enter TV Mode"]', timeout=10000)
            if tv_toggle:
                tv_toggle.click()
                print("Clicked TV Mode toggle")

                # Wait for layout changes (sidebar should appear)
                page.wait_for_selector('.tv-mode-root', state='visible')

                # Wait a bit for transitions
                page.wait_for_timeout(1000)

                # Take a screenshot of TV Mode
                page.screenshot(path="verification_tv_mode.png")
                print("Captured TV Mode screenshot")

                # Test spatial navigation
                page.keyboard.press("ArrowDown")
                page.wait_for_timeout(200)
                page.screenshot(path="verification_tv_nav_down.png")

            else:
                print("TV Mode toggle button not found")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_tv_mode()
