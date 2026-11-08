describe("Route player alignment", () => {
    beforeEach(() => {
        for (const file of [
            "../../../ui/web/src/gizmos/button/button.module.css",
            "src/player/player-slider/player-slider.module.css",
            "src/player/player.module.css",
        ]) {
            cy.readFile<string>(file).then((css) => {
                cy.document().then((document) => {
                    const stylesheet = document.createElement("style");
                    stylesheet.textContent = css;
                    document.head.appendChild(stylesheet);
                    document.body.style.margin = "0";
                });
            });
        }
    });

    it("aligns the wide-layout slider track with the Play/Pause icon center", () => {
        cy.document().then((document) => {
            document.body.innerHTML = `
                <div class="player lg">
                    <div class="slider">
                        <button id="play" style="height:32px;width:32px;padding:0;border:0">Play</button>
                        <div class="container slider-desktop">
                            <div class="slider-container"><div id="track" style="height:24px"></div></div>
                            <span style="font-size:10px;line-height:12px">Progress</span>
                        </div>
                    </div>
                </div>`;
        });
        cy.get("#track").should(($track) => {
            const track = $track[0].getBoundingClientRect();
            const play = $track[0].ownerDocument
                .querySelector("#play")!
                .getBoundingClientRect();
            expect(
                Math.abs(
                    track.top + track.height / 2 - play.top - play.height / 2,
                ),
            ).to.be.lessThan(1);
        });
    });

    it("keeps Play/Pause centered beside the recording controls on narrow screens", () => {
        cy.document().then((document) => {
            document.body.innerHTML = `
                <div class="player">
                    <div class="buttons">
                        <div>
                            ${["Record", "Pause", "Destroy"]
                                .map(
                                    (caption) => `
                                <button class="captioned-button" style="--caption-width:48px;--caption-gap:2px">
                                    <span class="icon" style="width:32px;height:32px"></span>
                                    <span style="font-size:10px;line-height:12px;min-height:24px">${caption}</span>
                                </button>`,
                                )
                                .join("")}
                        </div>
                        <button id="play" style="width:32px;height:32px;padding:0;border:0">Play</button>
                        <div>
                            <button class="captioned-button" style="--caption-width:48px;--caption-gap:2px">
                                <span style="width:32px;height:32px"></span>
                                <span style="font-size:10px;line-height:12px;min-height:24px">Markers</span>
                            </button>
                        </div>
                    </div>
                </div>`;
        });

        for (const width of [320, 600]) {
            cy.viewport(width, 640);
            cy.get("#play").should(($play) => {
                const bounds = $play[0].getBoundingClientRect();
                expect(
                    Math.abs(bounds.left + bounds.width / 2 - width / 2),
                ).to.be.lessThan(1);
            });
            cy.get(".buttons > div:first-child .icon").should(($icons) => {
                const play = $icons[0].ownerDocument
                    .querySelector("#play")!
                    .getBoundingClientRect();
                for (const icon of $icons.toArray()) {
                    const bounds = icon.getBoundingClientRect();
                    expect(bounds.right).to.be.at.most(play.left);
                    expect(Math.abs(bounds.top - play.top)).to.be.lessThan(1);
                }
            });
        }
    });
});
