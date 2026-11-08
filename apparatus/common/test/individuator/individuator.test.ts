import { expect } from "chai";
import { describe, it } from "mocha";
import { DateFormat } from "@tinker-chest";
import { Individuator, IndividuatorSettings } from "../../src";

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

    it("formats weekdays in the selected language instead of the saved device locale", () => {
        const individuator = new Individuator(false);
        const settings: IndividuatorSettings = {
            ...individuator.settings$.value,
            locale: "en-US",
            language: "de",
            dateFormat: {
                value: DateFormat.EEEEddMMyyyy,
                short: DateFormat.ddMMyyyy,
            },
        };

        expect(
            individuator.formatTimestamp(
                new Date(2026, 5, 19, 12).valueOf(),
                settings,
            ),
        ).to.include("Freitag");
    });
});
