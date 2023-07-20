import { $ } from "@src/util/domHelpers";
import { assume } from "@src/util/typeAssertions";
import browser from "webextension-polyfill";

import { ActionToSimulate, notifyEventHappenedInGameTab } from "@src/gameTab";

const canvas = assume($("#canvas"));

function pressKey(code: string) {
    ["keydown", "keyup", "keypress"].forEach((eventType) => {
        canvas.dispatchEvent(new KeyboardEvent(eventType, { code }));
    });
}

function click(x: number, y: number) {
    ["mousedown", "mouseup", "click"].forEach((eventType) => {
        canvas.dispatchEvent(
            new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
            }),
        );
    });
}

canvas.addEventListener(
    "mousedown",
    (event) => {
        if (event.altKey) {
            notifyEventHappenedInGameTab({
                action: "ALT_CLICKED",
                x: event.clientX,
                y: event.clientY,
            });
        }
    },
    false,
);

canvas.addEventListener(
    "keydown",
    (event) => {
        if (event.altKey && event.code !== "AltLeft") {
            notifyEventHappenedInGameTab({
                action: "ALT_KEY_PRESSED",
                code: event.code,
            });
        }
    },
    false,
);

browser.runtime.onMessage.addListener((request: ActionToSimulate) => {
    if (request.action === "SIMULATE_KEY_PRESS") {
        pressKey(request.code);
    }
    if (request.action === "SIMULATE_CLICK") {
        click(request.x, request.y);
    }
});
