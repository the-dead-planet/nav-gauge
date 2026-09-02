


import { describe } from "mocha";
import { expect } from "chai";
import { AnimationControlsType, Animatrix } from "../src";

describe("Route story gear", () => {
    describe("Animatrix", () => {
        describe("Animation controls", () => {
            it("should throw if followCurrentPoint incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ followCurrentPoint: false })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ followCurrentPoint: "" } as unknown as AnimationControlsType)).to.throw("Follow current point should be of type boolean");
            });
            it("should throw if autoRotate incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ autoRotate: false })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ autoRotate: "" } as unknown as AnimationControlsType)).to.throw("Auto rotate should be of type boolean");
            });
            it("should throw if cameraAngle incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ cameraAngle: 90 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ cameraAngle: 2000000 } as unknown as AnimationControlsType)).to.throw("Camera angle should be within range [0, 360]");
                expect(() => Animatrix.validateAnimationControls({ cameraAngle: "" } as unknown as AnimationControlsType)).to.throw("Camera angle should be of type number");
            });
            it("should throw if cameraRoll incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ cameraRoll: 90 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ cameraRoll: 2000000 } as unknown as AnimationControlsType)).to.throw("Camera roll should be within range [0, 360]");
                expect(() => Animatrix.validateAnimationControls({ cameraRoll: "" } as unknown as AnimationControlsType)).to.throw("Camera roll should be of type number");
            });
            it("should throw if camera tilt incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ cameraTilt: 20 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ cameraTilt: 200 } as unknown as AnimationControlsType)).to.throw("Pitch should be within range [0, 85]");
                expect(() => Animatrix.validateAnimationControls({ cameraTilt: "" } as unknown as AnimationControlsType)).to.throw("Pitch should be of type number");
            });
            it("should throw if camera zoom incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ cameraZoom: 13 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ cameraZoom: 200 } as unknown as AnimationControlsType)).to.throw("Zoom should be within range [0, 20]");
                expect(() => Animatrix.validateAnimationControls({ cameraZoom: "" } as unknown as AnimationControlsType)).to.throw("Zoom should be of type number");
            });
            it("should throw if displayImageDuration incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: 4500 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: 2000000 } as unknown as AnimationControlsType)).to.throw("Image pause duration should be within range [0, 10000]");
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: -1000 } as unknown as AnimationControlsType)).to.throw("Image pause duration should be within range [0, 10000]");
                expect(() => Animatrix.validateAnimationControls({ displayImageDuration: "" } as unknown as AnimationControlsType)).to.throw("Image pause duration should be of type number");
            });
            it("should throw if routePlaybackDuration incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ routePlaybackDuration: 15000 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ routePlaybackDuration: 0 })).to.throw("Route playback duration should be within range [1000, 120000]");
                expect(() => Animatrix.validateAnimationControls({ routePlaybackDuration: 2000000 } as unknown as AnimationControlsType)).to.throw("Route playback duration should be within range [1000, 120000]");
                expect(() => Animatrix.validateAnimationControls({ routePlaybackDuration: "" } as unknown as AnimationControlsType)).to.throw("Route playback duration should be of type number");
            });
            it("should throw if easeDuration incorrect", () => {
                expect(() => Animatrix.validateAnimationControls({ easeDuration: 200 })).to.not.throw();
                expect(() => Animatrix.validateAnimationControls({ easeDuration: 1234 } as unknown as AnimationControlsType)).to.throw("Ease duration should be within range [0, 1000]");
                expect(() => Animatrix.validateAnimationControls({ easeDuration: -10 } as unknown as AnimationControlsType)).to.throw("Ease duration should be within range [0, 1000]");
                expect(() => Animatrix.validateAnimationControls({ easeDuration: "" } as unknown as AnimationControlsType)).to.throw("Ease duration should be of type number");
            });
        });
    });
});
