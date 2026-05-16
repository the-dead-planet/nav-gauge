import { XMLParser } from "fast-xml-parser";
import { createFeature, getMissingGeometryError, getMissingTimeInformationError, ParsingResult } from "@tinker-chest";
import { FileToGeoJSONParser } from "./file-parser";

interface ParsedKmlData {
    kml?: {
        version: string;
        Folder?: KmlFolder | KmlFolder[];
        xmlns?: string;
        "xmlns:xsi"?: string;
        "xsi:schemaLocation"?: string;
    }
}

interface KmlFolder {
    name: string;
    ExtendedData?: KmlData | KmlData[];
    Folder?: [
        {
            name: "Laps";
            Placemark?: [
                {
                    name: "Start";
                    Point: KlmPoint;
                },
                {
                    name: "End";
                    Point: KlmPoint;
                },
            ];
        },
        {
            name: "Track Points";
            Placemark?: {
                Point: KlmPoint;
                TimeSpan: {
                    /**
                     * @example "2026-01-28T11:32:58.000Z"
                     */
                    begin: string;
                    /**
                     * @example "2026-01-28T11:32:58.000Z"
                     */
                    end: string;
                };
            }[]
        },
    ];
}

interface KmlData {
    Data?: {
        /**
         * @example "totalTime", "totalDistance", "cumulativeClimb", "cumulativeDecrease", "routeType"
         */
        name: string;
        /**
         * @example 2377, 4056, 6.099
         */
        value: number;
    }[];
}

interface KlmPoint {
    /**
     * @example "clampToGround"
     */
    altitudeMode: string;
    /**
     * @example "0.1234,1.4567"
     */
    coordinates: string;
}

export class KmlParser extends FileToGeoJSONParser {
    public acceptedFileExtensions = [".kml"];
    public fileTypes = [
        ".kml",
        "application/vnd.google-earth.kml+xml",
        "application/kml+xml"
    ];

    public parseTextToGeoJson = (text: string): ParsingResult => {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });
        const kmlData = parser.parse(text) as ParsedKmlData;
        const folder = Array.isArray(kmlData.kml?.Folder) ? kmlData.kml.Folder[0] : kmlData.kml?.Folder;
        const trackPoints = folder?.Folder?.[1]?.Placemark;

        if (
            !trackPoints ||
            !Array.isArray(trackPoints) ||
            trackPoints.length === 0 ||
            trackPoints.some((p) => !p.Point.coordinates || p.Point.coordinates.split(",").length < 2 || p.Point.coordinates.split(',').some((n) => isNaN(Number(n))))
        ) {
            throw getMissingGeometryError();
        }

        if (trackPoints.some((p) => !p.TimeSpan.begin || !p.TimeSpan.end)) {
            throw getMissingTimeInformationError();
        }

        return {
            geojson: {
                type: 'FeatureCollection',
                features: trackPoints.map((p, i) => createFeature(
                    p.Point.coordinates.split(',').map((n) => parseFloat(n)),
                    { id: i, time: p.TimeSpan.begin }
                ))
            },
            routeName: folder.name,
        }
    };
}