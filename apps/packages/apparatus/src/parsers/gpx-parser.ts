import { XMLParser } from "fast-xml-parser";
import { createFeature, getMissingGeometryError, getMissingTimeInformationError, ParsingResult } from "@tinker-chest";
import { FileToGeoJSONParser } from "./file-parser";

interface ParsedGpxData {
    gpx?: {
        version: string;
        creator: string;
        metadata?: {
            name?: string;
            time?: string;
        };
        wpt?: {
            /**
             * @example "0.123456"
             */
            lat: string;
            /**
             * @example "0.123456"
             */
            lon: string;
        };
        rte?: {
            type?: string;
            extensions?: {
                cumulativeClimb?: number;
                cumulativeDecrease?: number;
                routeType?: number;
                totalDistance?: number;
                totalTime?: number;
            },
            rtept?: {
                /**
                 * @example "0.123456"
                 */
                lat: string;
                /**
                 * @example "0.123456"
                 */
                lon: string;
                /**
                 * @example 4.1
                 */
                ele?: number;
                /**
                 * @example "2025-06-15T10:57:04.000Z"
                 */
                time?: string;
            }[]
        };
        trk?: {
            type?: string;
            extensions?: {
                cumulativeClimb?: number;
                cumulativeDecrease?: number;
                routeType?: number;
                totalDistance?: number;
                totalTime?: number;
            },
            trkseg?: {
                trkpt?: {
                    /**
                     * @example "0.123456"
                     */
                    lat: string;
                    /**
                     * @example "0.123456"
                     */
                    lon: string;
                    /**
                     * @example 4.1
                     */
                    ele?: number;
                    /**
                     * @example "2025-06-15T10:57:04.000Z"
                     */
                    time?: string;
                }[];
            };
        };
        xmlns?: string;
        "xmlns:xsi"?: string;
        "xsi:schemaLocation"?: string;
    }
}

export class GpxParser extends FileToGeoJSONParser {
    public acceptedFileExtensions = [".gpx"];
    public fileTypes = [
        ".gpx",
        "application/gpx+xml",
        "application/octet-stream",
    ];

    public parseTextToGeoJson = (text: string): ParsingResult => {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });
        const gpxData = parser.parse(text) as ParsedGpxData;
        const trkpt = gpxData.gpx?.trk?.trkseg?.trkpt;

        if (
            !trkpt ||
            !Array.isArray(trkpt) ||
            trkpt.length === 0 ||
            trkpt.some((p) => !p.lon || !p.lat)
        ) {
            throw getMissingGeometryError();
        }

        if (trkpt.some((p) => !p.time || typeof p.time !== 'string')) {
            throw getMissingTimeInformationError();
        }

        return {
            geojson: {
                type: 'FeatureCollection',
                features: trkpt.map((p, i) => createFeature(
                    [parseFloat(p.lon), parseFloat(p.lat)],
                    { id: i, time: p.time! }
                ))
            },
            routeName: gpxData.gpx?.metadata?.name || gpxData.gpx?.trk?.type,
        }
    };
}