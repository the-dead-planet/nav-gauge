import { describe, it } from "mocha";
import { expect } from "chai";
import {
    clampPanelLayout,
    clampPanelWidth,
    computeEffectiveWidth,
    LAYOUT_DEFAULTS,
    LAYOUT_MINS,
    type PanelLayout,
    type PanelState,
} from "../../src";

describe("panel-layout", () => {
    describe("computeEffectiveWidth", () => {
        it("returns 0 when no toolPanels", () => {
            const state: PanelState = { hasToolPanels: false, isCollapsed: false, storedSize: 360 };
            expect(computeEffectiveWidth(state, LAYOUT_MINS.panels.left)).to.equal(0);
        });

        it("returns minWidth when collapsed", () => {
            const state: PanelState = { hasToolPanels: true, isCollapsed: true, storedSize: 360 };
            expect(computeEffectiveWidth(state, LAYOUT_MINS.panels.left)).to.equal(LAYOUT_MINS.panels.left);
            expect(computeEffectiveWidth(state, LAYOUT_MINS.panels.right)).to.equal(LAYOUT_MINS.panels.right);
        });

        it("returns storedSize when expanded", () => {
            const state: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 400 };
            expect(computeEffectiveWidth(state, LAYOUT_MINS.panels.left)).to.equal(400);
        });

        it("returns 0 when no toolPanels even if collapsed", () => {
            const state: PanelState = { hasToolPanels: false, isCollapsed: true, storedSize: 360 };
            expect(computeEffectiveWidth(state, LAYOUT_MINS.panels.right)).to.equal(0);
        });
    });

    describe("clampPanelWidth", () => {
        it("clamps to thisMin when below", () => {
            expect(clampPanelWidth(10, LAYOUT_MINS.panels.left, 360, 1200)).to.equal(LAYOUT_MINS.panels.left);
        });

        it("clamps to max when above", () => {
            const max = 1200 - 360 - LAYOUT_MINS.remainingArea.width;
            expect(clampPanelWidth(2000, LAYOUT_MINS.panels.left, 360, 1200)).to.equal(max);
        });

        it("returns requested width when within range", () => {
            expect(clampPanelWidth(500, LAYOUT_MINS.panels.left, 360, 1200)).to.equal(500);
        });

        it("allows full width when otherEffective is 0", () => {
            expect(clampPanelWidth(800, LAYOUT_MINS.panels.right, 0, 1200)).to.equal(800);
        });

        it("clamps to thisMin exactly at min boundary", () => {
            expect(clampPanelWidth(LAYOUT_MINS.panels.left, LAYOUT_MINS.panels.left, 360, 1200)).to.equal(LAYOUT_MINS.panels.left);
        });
    });

    describe("clampPanelLayout", () => {
        const baseLeft: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 400 };
        const baseRight: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 400 };
        const baseBottomSecondary: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 300 };
        const window = { width: 1200, height: 1000 };
        const column3Min = Math.max(LAYOUT_MINS.tools.top, LAYOUT_MINS.remainingArea.width);
        const reservedChromeHeight = 160;

        it("returns prev reference when nothing changed", () => {
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 400, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, false, reservedChromeHeight);
            expect(result).to.equal(prev);
        });

        it("clamps left when too large", () => {
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 400, bottomSecondaryHeight: 300 };
            const maxLeft = 1200 - 400 - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, false, reservedChromeHeight);
            expect(result.leftWidth).to.equal(maxLeft);
        });

        it("clamps right when too large", () => {
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 1000, bottomSecondaryHeight: 300 };
            const max = 1200 - 400 - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, false, reservedChromeHeight);
            expect(result.rightWidth).to.equal(max);
        });

        it("uses effective width of 0 for absent panels", () => {
            const noPanels: PanelState = { hasToolPanels: false, isCollapsed: false, storedSize: 400 };
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 400, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, noPanels, baseBottomSecondary, window, false, false, reservedChromeHeight);
            const max = 1200 - 0 - column3Min;
            expect(result.leftWidth).to.be.at.most(max);
        });

        it("preserves collapsed panel stored width and clamps other side", () => {
            const collapsedRight: PanelState = { hasToolPanels: true, isCollapsed: true, storedSize: 400 };
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 400, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, collapsedRight, baseBottomSecondary, window, false, false, reservedChromeHeight);
            expect(result.rightWidth).to.equal(400);
            const max = 1200 - LAYOUT_MINS.panels.right - column3Min;
            expect(result.leftWidth).to.be.at.most(max);
        });

        it("accounts for left icons reserved width", () => {
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 400, bottomSecondaryHeight: 300 };
            const maxLeft = 1200 - 400 - LAYOUT_DEFAULTS.icons.left - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, true, false, reservedChromeHeight);
            expect(result.leftWidth).to.equal(maxLeft);
        });

        it("does not clamp collapsed panel storedSize even when max is lower", () => {
            const collapsedRight: PanelState = { hasToolPanels: true, isCollapsed: true, storedSize: 500 };
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 500, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, collapsedRight, baseBottomSecondary, { width: 600, height: 800 }, false, false, reservedChromeHeight);
            expect(result.rightWidth).to.equal(500);
        });

        it("accounts for right icons reserved width", () => {
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 1000, bottomSecondaryHeight: 300 };
            const max = 1200 - 400 - LAYOUT_DEFAULTS.icons.right - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, true, reservedChromeHeight);
            expect(result.rightWidth).to.equal(max);
        });

        it("clamps bottom secondary to remaining main area minus reserved chrome", () => {
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 400, bottomSecondaryHeight: 900 };
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, false, reservedChromeHeight);
            expect(result.bottomSecondaryHeight).to.equal(1000 - LAYOUT_MINS.remainingArea.height - reservedChromeHeight);
        });
    });
});
