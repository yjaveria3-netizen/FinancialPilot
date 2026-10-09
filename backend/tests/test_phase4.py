"""
FinPilot Phase 4 Test Suite: Polish, Reset Data, and Unified Flow
"""
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.data.generate_data import regenerate_all_data
from backend.modules.a_modules.anomaly_guard import detect_anomalies
from backend.modules.a_modules.tax_assistant import calculate_tax_estimates
from backend.modules.a_modules.scenario_planner import run_monte_carlo_simulation
from backend.modules.a_modules.accountant_portal import get_verified_financials
from backend.main import reset_demo_data


def test_reset_data_endpoint():
    print("Testing /api/reset-data endpoint handler...")
    res = reset_demo_data()
    assert res is not None, "Response must not be None"
    assert res.get("status") == "ok", f"Expected status 'ok', got {res.get('status')}"
    assert "transactions.csv" in res.get("files_updated", []), "transactions.csv must be updated"
    print("  -> reset_demo_data [PASS]")


def test_data_integrity_post_reset():
    print("Testing module computations post-reset...")
    anomalies = detect_anomalies()
    assert isinstance(anomalies, list) and len(anomalies) > 0, "Anomalies should be detected"
    print(f"  -> detect_anomalies returned {len(anomalies)} anomalies [PASS]")

    tax = calculate_tax_estimates()
    assert "estimated_tax_due" in tax, "Tax estimate must include estimated_tax_due"
    assert "filing_deadlines" in tax and len(tax["filing_deadlines"]) > 0, "Tax deadlines must exist"
    print(f"  -> calculate_tax_estimates due=${tax['estimated_tax_due']} [PASS]")

    scenario = run_monte_carlo_simulation({"sales_change_pct": 10, "hiring_count": 2, "days": 30})
    assert "projections" in scenario and len(scenario["projections"]) == 30, "Scenario projections must match horizon"
    assert "impact_summary" in scenario, "Impact summary must exist"
    print(f"  -> run_monte_carlo_simulation projected {len(scenario['projections'])} days [PASS]")

    portal = get_verified_financials("Auditor")
    assert "verified_statements" in portal, "Portal must return verified statements"
    assert portal.get("consent_status", {}).get("cryptographic_hash") is not None, "Hash must exist"
    print("  -> get_verified_financials returned verified financials [PASS]")


if __name__ == "__main__":
    print("=== Running FinPilot Phase 4 Verification Suite ===")
    test_reset_data_endpoint()
    test_data_integrity_post_reset()
    print("=== All Phase 4 Tests PASSED Successfully ===")
