"""
Render Keep-Alive Pipeline
==========================
Automatically pings your Render deployment every 60 seconds to prevent
free-tier services from sleeping / spinning down.

Usage:
    python keep_awake.py
    python keep_awake.py --url https://your-app.onrender.com/api/health
    python keep_awake.py --url https://your-app.onrender.com --interval 60
    python keep_awake.py --once
"""

import sys
import time
import os
import argparse
from datetime import datetime
import urllib.request
import urllib.error

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Load environment variables from .env if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DEFAULT_URL = os.environ.get(
    "RENDER_URL",
    "https://financialpilot-api.onrender.com/api/health"
)
DEFAULT_INTERVAL_SECONDS = int(os.environ.get("PING_INTERVAL", "60"))


def format_url(url: str) -> str:
    """Ensures the URL has https:// prefix and points to /api/health if bare domain."""
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = f"https://{url}"
    if not url.endswith("/api/health") and not url.endswith("/api/health/"):
        # If user gave root URL (e.g. https://financialpilot-api.onrender.com)
        if url.endswith("/"):
            url = f"{url}api/health"
        else:
            url = f"{url}/api/health"
    return url


def ping_server(url: str, timeout: int = 65) -> tuple[bool, int, float, str]:
    """
    Sends a lightweight HTTP GET request to the target server.
    Returns: (success, status_code, latency_ms, message)
    """
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "FinPilot-KeepAwake/1.0",
            "Accept": "application/json, text/plain, */*"
        }
    )
    start_time = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            latency = (time.perf_counter() - start_time) * 1000.0
            status_code = response.getcode()
            body = response.read(256).decode("utf-8", errors="ignore").strip()
            return True, status_code, latency, body
    except urllib.error.HTTPError as err:
        latency = (time.perf_counter() - start_time) * 1000.0
        return False, err.code, latency, str(err.reason)
    except urllib.error.URLError as err:
        latency = (time.perf_counter() - start_time) * 1000.0
        return False, 0, latency, str(err.reason)
    except Exception as exc:
        latency = (time.perf_counter() - start_time) * 1000.0
        return False, 0, latency, str(exc)


def run_pipeline(url: str, interval: int, once: bool = False):
    target_url = format_url(url)
    print("=" * 65)
    print(" [*] FinPilot Render Keep-Alive Pipeline")
    print("=" * 65)
    print(f" Target Endpoint : {target_url}")
    print(f" Interval        : Every {interval} second(s) (1 minute)")
    print(f" Mode            : {'Single test ping' if once else 'Continuous keep-awake daemon'}")
    print(" Press Ctrl+C at any time to stop.")
    print("=" * 65 + "\n")

    count = 0
    try:
        while True:
            count += 1
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"[{now_str}] [Ping #{count}] Pinging {target_url}...")

            success, status_code, latency, response_text = ping_server(target_url)

            if success:
                print(f"[{now_str}] [SUCCESS] Status: {status_code} OK | Latency: {latency:.1f}ms | Render is AWAKE [ONLINE]")
                if response_text:
                    truncated = (response_text[:60] + "...") if len(response_text) > 60 else response_text
                    print(f"              Payload: {truncated}")
            else:
                if status_code > 0:
                    print(f"[{now_str}] [HTTP {status_code}] ({response_text}) | Latency: {latency:.1f}ms")
                else:
                    print(f"[{now_str}] [NOTICE] Cold-start or connection: {response_text} | Elapsed: {latency:.1f}ms")
                print("              (Render may be waking up from cold sleep; will retry)")

            if once:
                print("\n[Done] Single ping finished.")
                break

            print(f"              Sleeping {interval}s until next wake ping...\n")
            time.sleep(interval)

    except KeyboardInterrupt:
        print("\n\n[Stopped] Keep-awake pipeline stopped by user. Goodbye!")
        sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Render Keep-Alive Automation Pipeline")
    parser.add_argument(
        "--url",
        "-u",
        type=str,
        default=DEFAULT_URL,
        help=f"Target URL to ping (default: {DEFAULT_URL})"
    )
    parser.add_argument(
        "--interval",
        "-i",
        type=int,
        default=DEFAULT_INTERVAL_SECONDS,
        help=f"Interval between pings in seconds (default: {DEFAULT_INTERVAL_SECONDS})"
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="Run a single test ping and exit"
    )

    args = parser.parse_args()
    run_pipeline(url=args.url, interval=args.interval, once=args.once)
