from playwright.sync_api import expect


def test_canvas_mode_core_controls_work(app_server, page):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    response = page.goto(f"{app_server}/?engine=canvas", wait_until="networkidle")
    assert response and response.ok
    expect(page.locator("#engineStatus")).to_contain_text("MODO COMPATIBLE")

    expect(page.locator("#scene")).to_be_visible()
    for level, altitude in [(1, "057 M"), (2, "115 M"), (3, "276 M"), (0, "000 M")]:
        page.locator(f'[data-level="{level}"]').click()
        expect(page.locator("#altitude")).to_have_text(altitude)

    page.locator("#nightBtn").click()
    assert "active" in page.locator("#nightBtn").get_attribute("class")
    page.locator("#dayBtn").click()
    page.locator("#spinBtn").click()
    assert "active" in page.locator("#spinBtn").get_attribute("class")
    page.locator("#resetBtn").click()
    expect(page.locator("#altitude")).to_have_text("000 M")
    assert "active" not in page.locator("#spinBtn").get_attribute("class")

    page.locator("#helpBtn").click()
    expect(page.locator("#helpModal")).to_be_visible()
    page.locator("#closeHelp").click()
    expect(page.locator("#helpModal")).to_be_hidden()
    assert not errors, errors
