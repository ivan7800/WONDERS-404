from playwright.sync_api import expect


def test_live_webgl_loads_all_models_and_controls(app_server, page):
    errors = []
    failed_model_responses = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on(
        "response",
        lambda response: failed_model_responses.append((response.url, response.status))
        if "/assets/" in response.url and response.status >= 400
        else None,
    )

    response = page.goto(f"{app_server}/", wait_until="networkidle")
    assert response and response.ok
    expect(page.locator("#engineStatus")).to_contain_text("3D WEBGL LOCAL", timeout=20_000)
    expect(page.locator("#webgl-scene")).to_be_visible()
    assert not failed_model_responses, failed_model_responses

    for level, altitude in [(1, "057 M"), (2, "115 M"), (3, "276 M")]:
        page.locator(f'[data-level="{level}"]').click()
        expect(page.locator("#altitude")).to_have_text(altitude)

    for control in ["nightBtn", "sunsetBtn", "cityBtn", "parksBtn", "fogBtn", "sparkBtn", "cinemaBtn"]:
        button = page.locator(f"#{control}")
        expect(button).to_be_enabled()
        was_active = "active" in (button.get_attribute("class") or "")
        button.click()
        is_active = "active" in (button.get_attribute("class") or "")
        assert is_active != was_active, f"{control} did not toggle its active state"

    page.locator("#exposureSlider").evaluate(
        "element => { element.value = '1.80'; element.dispatchEvent(new Event('input', {bubbles: true})); }"
    )
    expect(page.locator("#exposureValue")).to_have_text("1.80")
    page.locator("#liftBtn").click()
    expect(page.locator("#rideLabel")).to_contain_text("ASCENSOR")
    page.locator("#stopBtn").click()
    expect(page.locator("#rideLabel")).to_have_text("EXPLORACIÓN LIBRE")

    page.locator("#photoModeBtn").click()
    expect(page.locator("#photoToolbar")).to_be_visible()
    page.locator("#photoExitBtn").click()
    expect(page.locator("#photoToolbar")).to_be_hidden()
    with page.expect_download() as download_info:
        page.locator("#photoBtn").click()
    assert download_info.value.suggested_filename.endswith(".png")
    page.locator("#resetBtn").click()
    expect(page.locator("#altitude")).to_have_text("000 M")
    assert not errors, errors


def test_mobile_layout_has_visible_render_surface(app_server, browser):
    page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    try:
        response = page.goto(f"{app_server}/", wait_until="networkidle")
        assert response and response.ok
        expect(page.locator("#engineStatus")).to_contain_text("3D WEBGL LOCAL", timeout=20_000)
        canvas = page.locator("#webgl-scene")
        expect(canvas).to_be_visible()
        dimensions = canvas.evaluate("element => [element.width, element.height]")
        assert dimensions[0] > 0 and dimensions[1] > 0, dimensions
        assert page.locator("body").evaluate("element => element.scrollWidth") <= 410
        assert not errors, errors
    finally:
        page.close()
