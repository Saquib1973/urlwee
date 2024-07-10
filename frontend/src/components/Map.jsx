import React from "react";
import { VectorMap } from "react-jvectormap";
import { getCode } from "country-list";
import { worldMill } from "@react-jvectormap/world";
import { colorScale, countries, missingCountries } from "./Countries";

const Map = ({ hits }) => {
    // Function to create map data in the required format
    // const createMapData = (hits) => {
    //     const mapData = {};
    //     hits.forEach((hit) => {
    //         const countryCode = getCode(hit.location.country);
    //         if (countryCode) {
    //             mapData[countryCode] = (mapData[countryCode] || 0) + 1; // Increment count for each country
    //         }
    //     });
    //     return mapData;
    // };

    // // Data for the map
    // const mapData = createMapData(hits);

    return (
        <div style={{ margin: "auto", width: "700px", height: "600px" }}>
            <VectorMap
                map={worldMill}
                containerStyle={{
                    width: "700px",
                    height: "600px",
                }}
                backgroundColor="#282c34"
                markers={missingCountries}
                markerStyle={{
                    initial: {
                        fill: "red",
                    },
                }}
                series={{
                    regions: [
                        {
                            scale: colorScale,
                            values: countries,
                            min: 0,
                            max: 100,
                        },
                    ],
                }}
                onRegionTipShow={function reginalTip(event, label, code) {
                    return label.html(`
                  <div style="background-color: black; border-radius: 6px; min-height: 50px; width: 125px; color: white"; padding-left: 10px>
                    <p>
                    <b>
                    ${label.html()}
                    </b>
                    </p>
                    <p>
                    ${countries[code]}
                    </p>
                    </div>`);
                }}
                onMarkerTipShow={function markerTip(event, label, code) {
                    return label.html(`
                  <div style="background-color: white; border-radius: 6px; min-height: 50px; width: 125px; color: black !important; padding-left: 10px>
                    <p style="color: black !important;">
                    <b>
                    ${label.html()}
                    </b>
                    </p>
                    </div>`);
                }}
            />
        </div>
    );
};

export default Map;
