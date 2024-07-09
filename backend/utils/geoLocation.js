import geoip from 'geoip-lite';

export const getGeoLocation = (ip) => {
    return geoip.lookup(ip);
};
