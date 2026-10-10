"""
Tests for WhatsApp Automated Collection & Reconciliation Agent
"""
import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.modules.whatsapp_agent import get_overdue_invoices, mark_invoice_paid

client = TestClient(app)


def test_get_overdue_invoices_returns_targets():
    results = get_overdue_invoices()
    assert isinstance(results, list)
    if results:
        first = results[0]
        assert "invoice_id" in first
        assert "client_name" in first
        assert "client_phone" in first
        assert "amount" in first
        assert "due_date" in first
        assert "days_overdue" in first
        assert "ai_message" in first
        assert "whatsapp_link" in first
        assert first["whatsapp_link"].startswith("https://wa.me/")
        assert "text=" in first["whatsapp_link"]
        assert first["days_overdue"] >= 0


def test_api_whatsapp_reminders_endpoint():
    response = client.get("/api/whatsapp-reminders")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_api_mark_invoice_paid():
    # Fetch current overdue list
    reminders = client.get("/api/whatsapp-reminders").json()
    if reminders:
        target = reminders[-1]  # Pick the last one
        target_id = target["invoice_id"]
        
        # Mark as paid
        res = client.post(f"/api/invoices/{target_id}/mark-paid")
        assert res.status_code == 200
        body = res.json()
        assert body["success"] is True
        assert body["invoice_id"] == target_id
        assert body["status"] == "Paid"
