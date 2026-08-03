const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'en.wikipedia.org',
  path: '/wiki/Special:FilePath/Affinity_2025.svg',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

https.get(options, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const url = new URL(res.headers.location);
        https.get({ hostname: url.hostname, path: url.pathname + url.search, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
            let data = '';
            res2.on('data', chunk => data += chunk);
            res2.on('end', () => {
                data = data.replace(/fill=\"[^\"]*\"/g, '');
                data = data.replace(/stroke=\"[^\"]*\"/g, '');
                data = data.replace('<svg ', '<svg fill=\"#FFFFFF\" ');
                data = data.replace('</svg>', '<style>path, polygon, rect, circle, polyline, line { fill: #FFFFFF !important; stroke: none !important; }</style></svg>');
                fs.writeFileSync('src/assets/affinity-logo-white.svg', data);
                console.log('Saved src/assets/affinity-logo-white.svg');
            });
        });
    } else {
        console.log('Failed:', res.statusCode);
    }
});
