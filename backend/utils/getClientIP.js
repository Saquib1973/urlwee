export const getClientIp = (req) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.includes('::ffff:')) {
        ip = ip.split('::ffff:')[1];
    }
    return ip;
};
