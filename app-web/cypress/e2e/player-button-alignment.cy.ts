describe("Compact player button alignment", () => {
    it("aligns the wide-layout slider track with the Play/Pause icon center", () => {
        for (const file of [
            "../gears/route-story/web/src/player/player-slider/player-slider.module.css",
            "../gears/route-story/web/src/player/player.module.css",
        ]) {
            cy.readFile<string>(file).then((css) => {
                cy.document().then((document) => {
                    const stylesheet = document.createElement("style");
                    stylesheet.textContent = css;
                    document.head.appendChild(stylesheet);
                });
            });
        }
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
            const play = $track[0].ownerDocument.querySelector("#play")!
                .getBoundingClientRect();
            expect(Math.abs(track.top + track.height / 2 - play.top - play.height / 2))
                .to.be.lessThan(1);
        });
    });

    it("mirrors the marker spacing as well as the diamond, cap, and pan action", () => {
        for (const file of [
            "../gears/route-story/web/src/player/player-slider/slider-markers.module.css",
            "../gears/route-story/web/src/player/player-slider/player-slider.module.css",
        ]) {
            cy.readFile<string>(file).then((css) => {
                cy.document().then((document) => {
                    const stylesheet = document.createElement("style");
                    stylesheet.textContent = css;
                    document.head.appendChild(stylesheet);
                });
            });
        }
        cy.document().then((document) => {
            document.body.innerHTML = `
                    <div class="slider-container" style="margin-top:20px;width:280px">
                        <div class="slider-markers">
                            <div class="image-marker-container" style="left:50%">
                                <button class="pan-to-icon">Pan</button>
                                <span class="image-marker"></span>
                            </div>
                        </div>
                        <div id="track" style="height:24px"></div>
                    </div>`;
        });
        cy.get(".image-marker").should(($marker) => {
            const marker = $marker[0];
            const window = marker.ownerDocument.defaultView!;
            const diamond = window.getComputedStyle(marker, "::after");
            const cap = window.getComputedStyle(marker, "::before");
            const markerBounds = marker.getBoundingClientRect();
            const track = marker.ownerDocument
                .querySelector("#track")!
                .getBoundingClientRect();
            const trackCenter = track.top + track.height / 2;
            const diamondCenter =
                markerBounds.top +
                Number.parseFloat(diamond.top) +
                Number.parseFloat(diamond.height);
            expect(Math.abs(diamondCenter - trackCenter - 17)).to.be.lessThan(
                1,
            );
            expect(
                Math.abs(trackCenter - markerBounds.top - 14),
            ).to.be.lessThan(1);
            expect(Number.parseFloat(diamond.top)).to.be.greaterThan(
                marker.getBoundingClientRect().height / 2,
            );
            expect(Number.parseFloat(cap.top)).to.equal(0);
            const pan = marker
                .parentElement!.querySelector(".pan-to-icon")!
                .getBoundingClientRect();
            expect(pan.bottom).to.be.lessThan(
                marker.getBoundingClientRect().top,
            );
        });
    });

    it("centers Play/Pause between equal side groups with recording captions", () => {
        cy.readFile<string>(
            "../ui/web/src/gizmos/button/button.module.css",
        ).then((css) => {
            cy.document().then((document) => {
                const stylesheet = document.createElement("style");
                stylesheet.textContent = css;
                document.head.appendChild(stylesheet);
            });
        });
        cy.readFile<string>(
            "../gears/route-story/web/src/player/player.module.css",
        ).then((css) => {
            cy.document().then((document) => {
                const stylesheet = document.createElement("style");
                stylesheet.textContent = css;
                document.head.appendChild(stylesheet);
                document.body.style.margin = "0";
                document.body.innerHTML = `
                    <div class="player">
                        <div class="buttons">
                            <div>
                                ${["Record", "Pause", "Destroy"]
                                    .map(
                                        (caption) => `
                                    <button class="captioned-button" style="--caption-width:48px;--caption-gap:2px">
                                        <span class="icon" style="width:32px;height:32px;flex-shrink:0"></span>
                                        <span style="font-size:10px;line-height:12px;min-height:24px">${caption}</span>
                                    </button>`,
                                    )
                                    .join("")}
                            </div>
                            <button id="play" style="width:32px;height:32px;padding:0;border:0">Play</button>
                            <div><button style="width:32px;height:32px;padding:0;border:0">Marker</button></div>
                        </div>
                    </div>`;
            });
        });

        for (const width of [320, 375, 600]) {
            cy.viewport(width, 640);
            cy.get("#play").should(($play) => {
                const bounds = $play[0].getBoundingClientRect();
                expect(
                    Math.abs(bounds.left + bounds.width / 2 - width / 2),
                ).to.be.lessThan(1);
            });
            cy.get(".buttons > div:first-child .icon").should(($icons) => {
                const playBounds = $icons[0].ownerDocument
                    .querySelector("#play")!
                    .getBoundingClientRect();
                for (const icon of $icons.toArray()) {
                    const bounds = icon.getBoundingClientRect();
                    expect(bounds.right).to.be.at.most(playBounds.left);
                    expect(
                        Math.abs(bounds.top - playBounds.top),
                    ).to.be.lessThan(1);
                }
            });
        }
    });
});
