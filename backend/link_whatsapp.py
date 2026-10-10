"""
FinPilot — One-Time WhatsApp Web QR Linker Script
Run this script once to open a visible browser window and scan your WhatsApp QR code:
    python backend/link_whatsapp.py

Once scanned, your phone's WhatsApp account will be linked to the persistent session
folder (backend/whatsapp_session). All background automated reminders will then be sent
FROM your linked number headlessly!
"""
from pathlib import Path
import asyncio
import sys

BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

SESSION_DIR = Path(__file__).resolve().parent / "whatsapp_session"

async def link_whatsapp():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("Playwright is not installed. Install via: pip install playwright && playwright install chromium")
        return

    print("=" * 60)
    print("FinPilot — WhatsApp Account Linker")
    print("=" * 60)
    print("1. Opening a browser window...")
    print("2. Open WhatsApp on your phone -> Linked Devices -> Link a Device")
    print("3. Scan the QR code shown on screen.")
    print("4. Once you see your chats, close the browser or press Ctrl+C.")
    print(f"Session will be stored in: {SESSION_DIR}")
    print("=" * 60)

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(SESSION_DIR),
            headless=False,  # Visible so you can scan the official QR code!
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled"
            ]
        )
        page = context.pages[0] if context.pages else await context.new_page()
        await page.goto("https://web.whatsapp.com")
        print("Waiting for login... (Browser is open. Close the window when done scanning).")
        
        # Keep open until user closes browser or logs in
        try:
            await page.wait_for_selector("#pane-side", timeout=120000)
            print("✓ SUCCESS! WhatsApp Web is successfully logged in and linked!")
            print("All automated background reminders will now be sent from this account.")
            try:
                from backend.services.whatsapp_automation import save_connection_state
                save_connection_state("+92 3224154788", "Linked Primary WhatsApp")
            except Exception as e:
                print("State save notice:", e)
            await asyncio.sleep(3)
        except Exception:
            print("Finished waiting. If you completed scanning, session is saved.")
        finally:
            await context.close()

if __name__ == "__main__":
    asyncio.run(link_whatsapp())
