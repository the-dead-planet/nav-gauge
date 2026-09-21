import { expect } from "chai";
import { describe, it } from "mocha";
import { Individuator } from "../../src";

describe("Individuator", () => {
    it("uses the runtime locale by default", () => {
        expect(new Individuator(false).settings$.value.locale).to.equal(Intl.DateTimeFormat().resolvedOptions().locale);
    });

    it("infers distance units from the locale region", () => {
        expect(Individuator.getPreferredDistanceUnit('en-US')).to.equal('imperial');
        expect(Individuator.getPreferredDistanceUnit('en-Latn-US')).to.equal('imperial');
        expect(Individuator.getPreferredDistanceUnit('en-GB')).to.equal('imperial');
        expect(Individuator.getPreferredDistanceUnit('de')).to.equal('metric');
    });
});
