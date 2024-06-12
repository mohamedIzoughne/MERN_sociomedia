// import NodeCache from 'node-cache';

// const cache = new NodeCache();

// function doCache(duration) {
//     return (req, res, next) => {
//         if(req.method !== 'GET') {
//             const error = new Error('cannot cache non-GET methods')
//             return next(error);
//         }
//     }

//     const key = req.originalUrl;
//     const cachedValue = cache.get(key);
//     if (cachedValue) {
//         return res.json(cachedValue);
//     } else {
        
//     }
// }
