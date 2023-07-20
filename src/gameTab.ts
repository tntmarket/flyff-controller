import browser, { Tabs } from "webextension-polyfill";
import { assume } from "@src/util/typeAssertions";
import Tab = Tabs.Tab;

export type GameTabEvent = AltKeyPressed | AltClicked;

type AltKeyPressed = {
    action: "ALT_KEY_PRESSED";
    code: string;
};
type AltClicked = {
    action: "ALT_CLICKED";
    x: number;
    y: number;
};

export function notifyEventHappenedInGameTab(event: GameTabEvent) {
    browser.runtime.sendMessage(event);
}

export type ActionToSimulate = SimulateKeyPress | SimulateClick;

type SimulateKeyPress = {
    action: "SIMULATE_KEY_PRESS";
    code: string;
};
type SimulateClick = {
    action: "SIMULATE_CLICK";
    x: number;
    y: number;
};

export function simulateActionInGameTab(tab: Tab, action: ActionToSimulate) {
    browser.tabs.sendMessage(assume(tab.id), action);
}
