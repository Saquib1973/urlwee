import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import React, { useState, useEffect } from "react";

function WorldMap({ countriesData }) {
    const [max, setMax] = useState(0);

    useEffect(() => {
        if (countriesData && Object.keys(countriesData).length > 0) {
            const maxValue = Math.max(...Object.values(countriesData).filter(value => isFinite(value)));
            setMax(maxValue);
        }
    }, [countriesData]);

    const regionStyle = {
        initial: {
            fill: "#e4e4e4",
            "fill-opacity": 0.9,
            stroke: "none",
            "stroke-width": 0,
            "stroke-opacity": 0
        }
    };

    return (
        <div style={{ width: "100%", height: "500px" }} className="flex">
            {
                Object.keys(countriesData).length > 0 && isFinite(max) && max > 0 && (
                    <VectorMap
                        map={worldMill}
                        containerStyle={{
                            width: "100%",
                            height: "100%",
                        }}
                        backgroundColor="transparent"
                        regionStyle={regionStyle}
                        series={{
                            regions: [
                                {
                                    values: countriesData,
                                    scale: ["#E2AEFF", "#5E32CA"],
                                    min: 0,
                                    max: max
                                }
                            ]
                        }}
                        onRegionTipShow={(event, label, code) => {
                            const count = countriesData[code] || 0;
                            const countryName = label.html(); // Get country name
                            label.html(`
                                <div style="background-color: black; border-radius: 6px; min-height: 50px; width: 125px; color: white; padding-left: 10px">
                                    <p><b>${countryName}</b></p>
                                    <p>${count > 0 ? `${count} hits` : 'No hits'}</p>
                                </div>
                            `);
                        }}
                    />
                )
            }
        </div>
    );
}

export default WorldMap;
