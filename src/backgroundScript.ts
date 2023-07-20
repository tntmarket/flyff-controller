import browser from "webextension-polyfill";
import { assume } from "@src/util/typeAssertions";
import { GameTabEvent, simulateActionInGameTab } from "@src/gameTab";

async function getAssistTabs(windowId: number) {
    const tabs = await browser.tabs.query({
        url: "https://universe.flyff.com/play",
        windowId,
    });
    return tabs.slice(1);
}

browser.runtime.onMessage.addListener(async (request: GameTabEvent, sender) => {
    console.log(request);
    const windowId = assume(sender.tab?.windowId);
    const assistTabs = await getAssistTabs(windowId);

    if (request.action === "ALT_KEY_PRESSED") {
        assistTabs.forEach((tab) =>
            simulateActionInGameTab(tab, {
                action: "SIMULATE_KEY_PRESS",
                code: request.code,
            }),
        );
    } else if (request.action === "ALT_CLICKED") {
        assistTabs.forEach((tab) =>
            simulateActionInGameTab(tab, {
                action: "SIMULATE_CLICK",
                x: request.x,
                y: request.y,
            }),
        );
    }
});
