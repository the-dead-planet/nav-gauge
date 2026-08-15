import { expect } from "chai";
import { getExifLngLat } from "../src/parsers/tinkers";

describe("Tinker chest", () => {
    describe("getExifLngLat", () => {
        it("should apply W/S refs to numeric GPS values", () => {
            expect(getExifLngLat({
                GPSLongitude: 9.132,
                GPSLongitudeRef: 'W',
                GPSLatitude: 38.715,
                GPSLatitudeRef: 'S'
            })).to.deep.equal({ lng: -9.132, lat: -38.715 });
        });

        it("should keep E/N refs positive for numeric GPS values", () => {
            expect(getExifLngLat({
                GPSLongitude: 9.132,
                GPSLongitudeRef: 'E',
                GPSLatitude: 38.715,
                GPSLatitudeRef: 'N'
            })).to.deep.equal({ lng: 9.132, lat: 38.715 });
        });

        it("should apply refs to array GPS values", () => {
            expect(getExifLngLat({
                GPSLongitude: [9, 7, 55.296],
                GPSLongitudeRef: 'W',
                GPSLatitude: [38, 42, 55.579],
                GPSLatitudeRef: 'N'
            })).to.deep.equal({ lng: -9.132026666666667, lat: 38.71543861111111 });
        });

        it("should return undefined without GPS refs", () => {
            expect(getExifLngLat({
                GPSLongitude: 9.132,
                GPSLatitude: 38.715
            })).to.equal(undefined);
        });
    });
});
