import { expect } from "chai";
import { describe, it } from "mocha";
import { ChronoLens, Individuator, SignaliumBureau, SurveillanceState } from "../../src";

class TestChronoLens extends ChronoLens {
    public fileType = 'test';
    public stopCount = 0;
    public startRecording = async () => {};
    public stopRecording = async () => {
        this.stopCount++;
    };
    public download = async () => {};
    public destroyRecording = () => {};
}

describe("ChronoLens", () => {
    it("ignores duplicate surveillance states", () => {
        const chronoLens = new TestChronoLens(new Individuator(false));
        chronoLens.setUpSurveillance({} as SignaliumBureau, new AbortController().signal);

        chronoLens.surveillanceState$.next(SurveillanceState.Stopped);
        expect(chronoLens.stopCount).to.equal(0);

        chronoLens.surveillanceState$.next(SurveillanceState.InProgress);
        chronoLens.surveillanceState$.next(SurveillanceState.Stopped);
        chronoLens.surveillanceState$.next(SurveillanceState.Stopped);
        expect(chronoLens.stopCount).to.equal(1);
    });
});
