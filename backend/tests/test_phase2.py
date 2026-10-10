"""
Unit and Integration Tests for Phase 2: Finance Depth
- Anomaly & Fraud Guard Module
- Tax & Compliance Assistant Module
- FastAPI Endpoints: /api/anomalies and /api/tax-summary
"""
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.modules.a_modules.anomaly_guard import detect_anomalies
from backend.modules.a_modules.tax_assistant import calculate_tax_estimates


def test_detect_anomalies_pure_function():
    anomalies = detect_anomalies()
    assert isinstance(anomalies, list), "detect_anomalies must return a list"
    assert len(anomalies) > 0, "detect_anomalies should return flagged records"

    categories = set()
    severities = set()

    for item in anomalies:
        assert isinstance(item, dict), "Each anomaly must be a dictionary"
        assert "id" in item, "Missing 'id'"
        assert "category" in item, "Missing 'category'"
        assert "severity" in item, "Missing 'severity'"
        assert "item_reference" in item, "Missing 'item_reference'"
        assert "amount" in item, "Missing 'amount'"
        assert "reason" in item, "Missing 'reason'"

        assert item["severity"] in ["High", "Medium", "Low"], f"Invalid severity: {item['severity']}"
        assert item["amount"] >= 0, "Amount must be non-negative"
        assert len(item["reason"].strip()) > 10, "Reason must be descriptive"

        categories.add(item["category"])
        severities.add(item["severity"])

    # Ensure all 3 specific detection rules are represented
    assert "Duplicate" in categories, "Must detect Duplicate invoices"
    assert "Unusual Payment" in categories, "Must detect Unusual Payments (z > 2.5)"
    assert "Price Spike" in categories, "Must detect Supplier Price Spikes"


def test_calculate_tax_estimates_pure_function():
    tax_data = calculate_tax_estimates()
    assert isinstance(tax_data, dict), "calculate_tax_estimates must return a dict"

    required_keys = ["estimated_tax_due", "deductible_total", "filing_deadlines", "accountant_summary"]
    for key in required_keys:
        assert key in tax_data, f"Missing required contract key: {key}"

    assert isinstance(tax_data["estimated_tax_due"], (int, float))
    assert isinstance(tax_data["deductible_total"], (int, float))
    assert tax_data["estimated_tax_due"] > 0
    assert tax_data["deductible_total"] > 0

    assert isinstance(tax_data["filing_deadlines"], list)
    assert len(tax_data["filing_deadlines"]) >= 3
    for deadline in tax_data["filing_deadlines"]:
        assert "event" in deadline
        assert "due_date" in deadline
        assert "days_remaining" in deadline
        assert deadline["days_remaining"] >= 0

    assert isinstance(tax_data["accountant_summary"], str)
    assert len(tax_data["accountant_summary"]) > 50


def test_api_anomalies_endpoint():
    client = TestClient(app)
    response = client.get("/api/anomalies")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    sample = data[0]
    assert "id" in sample
    assert "category" in sample
    assert "severity" in sample
    assert "item_reference" in sample
    assert "amount" in sample
    assert "reason" in sample


def test_api_tax_summary_endpoint():
    client = TestClient(app)
    response = client.get("/api/tax-summary")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "estimated_tax_due" in data
    assert "deductible_total" in data
    assert "filing_deadlines" in data
    assert "accountant_summary" in data


if __name__ == "__main__":
    print("Running Phase 2 tests manually...")
    test_detect_anomalies_pure_function()
    print("[PASS] test_detect_anomalies_pure_function passed")
    test_calculate_tax_estimates_pure_function()
    print("[PASS] test_calculate_tax_estimates_pure_function passed")
    test_api_anomalies_endpoint()
    print("[PASS] test_api_anomalies_endpoint passed")
    test_api_tax_summary_endpoint()
    print("[PASS] test_api_tax_summary_endpoint passed")
    print("ALL PHASE 2 TESTS PASSED!")
