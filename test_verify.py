#!/usr/bin/env python3
"""
WeatherBlend AI - Integrity & Design Compliance Test
Audits the simplified, accessible, hybrid AI-NWP dashboard.
"""
import re
import os

def run_checks():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    print("--- WEATHERBLEND AI COMPLIANCE AUDIT ---")

    # 1. Sidebar Nav: Home, Forecast, Weather Map, Alerts, AI Assistant, Get Started
    nav_pattern = re.compile(r'<a class="nav-link[^"]*"[^>]*>.*?<span>(.*?)</span>.*?</a>', re.DOTALL)
    nav_matches = nav_pattern.findall(html)
    print(f"Sidebar Navigation Items ({len(nav_matches)}): {nav_matches}")
    expected_nav = ['Home', 'Forecast', 'Weather Map', 'Alerts', 'AI Assistant', 'Get Started']
    assert nav_matches == expected_nav, f"Nav mismatch! {nav_matches} vs {expected_nav}"

    # 2. Check no emojis in nav
    for name in nav_matches:
        for ch in name:
            assert ord(ch) < 1000, f"Found emoji in nav item: {name}"

    # 2b. Check Get Started page exists
    assert 'id="view-get-started"' in html, "Missing 'view-get-started' page view"
    assert 'id="signUpForm"' in html, "Missing 'signUpForm'"
    assert 'id="signInForm"' in html, "Missing 'signInForm'"

    # 3. Check NO "Sync Data" button exists
    assert "Sync Data" not in html, "ERROR: 'Sync Data' button found in index.html!"

    # 4. Check NO "Why this forecast?" or "Explain Factors" button
    assert "Why this forecast?" not in html, "ERROR: 'Why this forecast?' button found in index.html!"
    assert "Explain Factors" not in html, "ERROR: 'Explain Factors' button found in index.html!"

    # 5. Check Homepage Hero & Compact Summaries
    assert 'id="heroPrimaryVal"' in html, "Missing hero primary weather value"
    assert 'class="compact-weather-grid"' in html, "Missing compact weather grid"
    assert 'id="homeAlertBanner"' in html, "Missing compact alert banner"
    assert 'How the forecast is combined' in html, "Missing 'How the forecast is combined' section"

    # 6. Check Chatbot has exactly 4 simple suggestions
    question_chips = re.findall(r'<button class="question-chip">(.*?)</button>', html)
    print(f"Chatbot Question Chips ({len(question_chips)}): {question_chips}")
    expected_chips = [
        "Will it rain?",
        "What will the temperature be?",
        "Is there any weather alert?",
        "What is the forecast for the next 3 days?"
    ]
    assert question_chips == expected_chips, f"Expected chips {expected_chips}, got {question_chips}"

    # 7. Check Chatbot clean branding
    assert "Meteorological Core Online" not in html, "Technical status found in chatbot!"
    assert "meteorological intelligence assistant" not in html, "Technical wording found in chatbot!"

    # 8. Check Weather Map layer controls
    map_layers = re.findall(r'data-layer="([^"]+)"', html)
    print(f"Map Layer Controls: {map_layers}")
    assert 'model' not in map_layers, "ERROR: 'model' (Model Contributions) layer should be removed from visible map controls!"
    assert 'error' not in map_layers, "ERROR: 'error' (Forecast Error) layer should be removed from visible map controls!"

    # 9. Check Color Tokens in variables.css
    with open('css/variables.css', 'r', encoding='utf-8') as f:
        vars_css = f.read()
    assert '#0b1f3a' in vars_css.lower(), "Missing navy #0B1F3A"
    assert '#1f5d42' in vars_css.lower(), "Missing forest green #1F5D42"
    assert '#c62828' in vars_css.lower(), "Missing alert red #C62828"
    assert '#f6f8f7' in vars_css.lower(), "Missing light background #F6F8F7"

    # 10. Check that NO emojis exist in headings or buttons
    headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', html)
    for h in headings:
        clean_h = re.sub(r'<[^>]+>', '', h)
        for ch in clean_h:
            assert ord(ch) < 1000, f"Disallowed emoji in heading: {clean_h}"

    buttons = re.findall(r'<button[^>]*>(.*?)</button>', html, re.DOTALL)
    for b in buttons:
        clean_b = re.sub(r'<[^>]+>', '', b).strip()
        for ch in clean_b:
            assert ord(ch) < 1000, f"Disallowed emoji in button: {clean_b}"

    print("\n=============================================")
    print(" ALL 10 COMPREHENSIVE AUDIT CHECKS PASSED!   ")
    print("=============================================")

if __name__ == '__main__':
    run_checks()
