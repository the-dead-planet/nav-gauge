import { describe, it } from "mocha";
import { expect } from "chai";
import { computeEffectiveWidth, clampPanelWidth, clampPanelLayout, LEFT_ICONS_WIDTH, MAP_MIN, PANEL_MIN, PANEL_MIN_LEFT, RIGHT_ICONS_WIDTH, TOP_TOOLS_MIN } from "../src/machine/tool-panels/tool-panel-size";
import type { PanelLayout, PanelState } from "../src/machine/tool-panels/tool-panel-size";

describe("panel-layout", () => {
    describe("computeEffectiveWidth", () => {
        it("returns 0 when no toolPanels", () => {
            const state: PanelState = { hasToolPanels: false, isCollapsed: false, storedSize: 360 };
            expect(computeEffectiveWidth(state, PANEL_MIN_LEFT)).to.equal(0);
        });

        it("returns minWidth when collapsed", () => {
            const state: PanelState = { hasToolPanels: true, isCollapsed: true, storedSize: 360 };
            expect(computeEffectiveWidth(state, PANEL_MIN_LEFT)).to.equal(PANEL_MIN_LEFT);
            expect(computeEffectiveWidth(state, PANEL_MIN)).to.equal(PANEL_MIN);
        });

        it("returns storedSize when expanded", () => {
            const state: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 400 };
            expect(computeEffectiveWidth(state, PANEL_MIN_LEFT)).to.equal(400);
        });

        it("returns 0 when no toolPanels even if collapsed", () => {
            const state: PanelState = { hasToolPanels: false, isCollapsed: true, storedSize: 360 };
            expect(computeEffectiveWidth(state, PANEL_MIN)).to.equal(0);
        });
    });

    describe("clampPanelWidth", () => {
        it("clamps to thisMin when below", () => {
            expect(clampPanelWidth(10, PANEL_MIN_LEFT, 360, 1200)).to.equal(PANEL_MIN_LEFT);
        });

        it("clamps to max when above", () => {
            const max = 1200 - 360 - MAP_MIN;
            expect(clampPanelWidth(2000, PANEL_MIN_LEFT, 360, 1200)).to.equal(max);
        });

        it("returns requested width when within range", () => {
            expect(clampPanelWidth(500, PANEL_MIN_LEFT, 360, 1200)).to.equal(500);
        });

        it("allows full width when otherEffective is 0", () => {
            expect(clampPanelWidth(800, PANEL_MIN, 0, 1200)).to.equal(800);
        });

        it("clamps to thisMin exactly at min boundary", () => {
            expect(clampPanelWidth(PANEL_MIN_LEFT, PANEL_MIN_LEFT, 360, 1200)).to.equal(PANEL_MIN_LEFT);
        });
    });

    describe("clampPanelLayout", () => {
        const baseLeft: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 400 };
        const baseRight: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 400 };
        const baseBottomSecondary: PanelState = { hasToolPanels: true, isCollapsed: false, storedSize: 300 };
        const window = { width: 1200, height: 1000 };
        const column3Min = Math.max(TOP_TOOLS_MIN, MAP_MIN);

        it("returns prev reference when nothing changed", () => {
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 400, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, false);
            expect(result).to.equal(prev);
        });

        it("clamps left when too large", () => {
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 400, bottomSecondaryHeight: 300 };
            const maxLeft = 1200 - 400 - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, false);
            expect(result.leftWidth).to.equal(maxLeft);
        });

        it("clamps right when too large", () => {
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 1000, bottomSecondaryHeight: 300 };
            const max = 1200 - 400 - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, false);
            expect(result.rightWidth).to.equal(max);
        });

        it("uses effective width of 0 for absent panels", () => {
            const noPanels: PanelState = { hasToolPanels: false, isCollapsed: false, storedSize: 400 };
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 400, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, noPanels, baseBottomSecondary, window, false, false);
            const max = 1200 - 0 - column3Min;
            expect(result.leftWidth).to.be.at.most(max);
        });

        it("preserves collapsed panel stored width and clamps other side", () => {
            const collapsedRight: PanelState = { hasToolPanels: true, isCollapsed: true, storedSize: 400 };
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 400, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, collapsedRight, baseBottomSecondary, window, false, false);
            expect(result.rightWidth).to.equal(400);
            const max = 1200 - PANEL_MIN - column3Min;
            expect(result.leftWidth).to.be.at.most(max);
        });

        it("accounts for left icons reserved width", () => {
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 400, bottomSecondaryHeight: 300 };
            const maxLeft = 1200 - 400 - LEFT_ICONS_WIDTH - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, true, false);
            expect(result.leftWidth).to.equal(maxLeft);
        });

        it("does not clamp collapsed panel storedSize even when max is lower", () => {
            const collapsedRight: PanelState = { hasToolPanels: true, isCollapsed: true, storedSize: 500 };
            const prev: PanelLayout = { leftWidth: 1000, rightWidth: 500, bottomSecondaryHeight: 300 };
            const result = clampPanelLayout(prev, baseLeft, collapsedRight, baseBottomSecondary, { width: 600, height: 800 }, false, false);
            expect(result.rightWidth).to.equal(500);
        });

        it("accounts for right icons reserved width", () => {
            const prev: PanelLayout = { leftWidth: 400, rightWidth: 1000, bottomSecondaryHeight: 300 };
            const max = 1200 - 400 - RIGHT_ICONS_WIDTH - column3Min;
            const result = clampPanelLayout(prev, baseLeft, baseRight, baseBottomSecondary, window, false, true);
            expect(result.rightWidth).to.equal(max);
        });
    });
});
