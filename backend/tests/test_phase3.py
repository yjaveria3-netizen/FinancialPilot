"""
Unit and Integration Tests for Phase 3: Growth Features
- Scenario Planner Module (Monte Carlo simulation)
- Accountant and Lender Portal Module (Verified financials & role framework)
- FastAPI Endpoints: POST /api/simulate-scenario and GET /api/accountant-portal
"""
from fastapi.testclient import TestClient
from backend.main import app
from backend.modules.a_modules.scenario_planner import run_monte_carlo_simulation
from backend.modules.a_modules.accountant_portal import get_verified_financials


def test_monte_carlo_simulation_pure_function():
    # Test baseline simulation
    res = run_monte_carlo_simulation({
        "sales_change_pct": 10.0,
        "hiring_count": 2,
        "procurement_cost_pct": 5.0,
        "days": 30,
        "simulations": 200,
    })

    assert isinstance(res, dict), "Simulation must return a dict"
    assert "projections" in res, "Missing 'projections'"
    assert "impact_summary" in res, "Missing 'impact_summary'"
    assert "ai_analysis" in res, "Missing 'ai_analysis'"
    assert "params_applied" in res, "Missing 'params_applied'"

    # Check fan projections
    projections = res["projections"]
    assert len(projections) == 30, "Should have 30 daily projection points"

    first_day = projections[0]
    required_keys = ["date", "baseline", "p10", "p25", "p50", "p75", "p90"]
    for k in required_keys:
        assert k in first_day, f"Missing key {k} in projection point"

    # Monotonic percentile order check
    for p in projections:
        assert p["p10"] <= p["p25"] <= p["p50"] <= p["p75"] <= p["p90"], "Percentiles must be ordered"

    # Check impact summary
    impact = res["impact_summary"]
    assert "ending_cash_p50" in impact
    assert "shortfall_probability" in impact
    assert "credit_risk_impact" in impact
    assert impact["shortfall_probability"] >= 0.0

    # Check AI narrative
    assert isinstance(res["ai_analysis"], str)
    assert len(res["ai_analysis"]) > 50


def test_accountant_portal_pure_function():
    # Test Auditor role
    res_auditor = get_verified_financials(role="Auditor")
    assert res_auditor["active_role"] == "Auditor"
    assert "verified_statements" in res_auditor
    assert "consent_status" in res_auditor
    assert "audit_trail" in res_auditor

    bs = res_auditor["verified_statements"]["balance_sheet"]
    assert bs["is_balanced"] is True
    assets = bs["assets"]["total_current_assets"]
    liab_equity = bs["total_liabilities_and_equity"]
    assert abs(assets - liab_equity) < 0.01, "Balance sheet must balance"

    # Test Lender role
    res_lender = get_verified_financials(role="Lender")
    assert res_lender["active_role"] == "Lender"
    ratios = res_lender["verified_statements"]["ratios"]
    assert "current_ratio" in ratios
    assert "quick_ratio" in ratios
    assert "dscr" in ratios
    assert ratios["current_ratio"] > 0

    # Test Accountant role
    res_accountant = get_verified_financials(role="Accountant")
    assert res_accountant["active_role"] == "Accountant"
    assert "income_statement" in res_accountant["verified_statements"]


def test_api_simulate_scenario_endpoint():
    client = TestClient(app)
    response = client.post(
        "/api/simulate-scenario",
        json={"sales_change_pct": -15.0, "hiring_count": 1, "days": 30, "simulations": 150},
    )
    assert response.status_code == 200
    data = response.json()
    assert "projections" in data
    assert "impact_summary" in data
    assert "ai_analysis" in data
    assert len(data["projections"]) == 30


def test_api_accountant_portal_endpoint():
    client = TestClient(app)
    response = client.get("/api/accountant-portal?role=Lender")
    assert response.status_code == 200
    data = response.json()
    assert data["active_role"] == "Lender"
    assert "verified_statements" in data
    assert "audit_trail" in data


if __name__ == "__main__":
    print("Running Phase 3 tests manually...")
    test_monte_carlo_simulation_pure_function()
    print("[PASS] test_monte_carlo_simulation_pure_function passed")
    test_accountant_portal_pure_function()
    print("[PASS] test_accountant_portal_pure_function passed")
    test_api_simulate_scenario_endpoint()
    print("[PASS] test_api_simulate_scenario_endpoint passed")
    test_api_accountant_portal_endpoint()
    print("[PASS] test_api_accountant_portal_endpoint passed")
    print("ALL PHASE 3 TESTS PASSED!")
