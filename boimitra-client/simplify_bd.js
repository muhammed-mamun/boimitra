import fs from 'fs';
import * as turf from '@turf/turf';

const bd = JSON.parse(fs.readFileSync('./public/bd.json', 'utf-8'));
const divisions = {};

// Group by Division (NAME_1)
bd.features.forEach(f => {
    const div = f.properties.NAME_1;
    if (!div) return;
    if (!divisions[div]) {
        divisions[div] = [];
    }
    divisions[div].push(f);
});

const output = { type: "FeatureCollection", features: [] };

for (const div in divisions) {
    let merged = divisions[div][0];
    for (let i = 1; i < divisions[div].length; i++) {
        merged = turf.union(turf.featureCollection([merged, divisions[div][i]]));
    }
    merged.properties = { id: div.toLowerCase(), name: div };

    // Simplify to reduce size
    const simplified = turf.simplify(merged, { tolerance: 0.005, highQuality: true });
    output.features.push(simplified);
}

fs.writeFileSync('./public/bd-divisions-simplified.json', JSON.stringify(output));
console.log('Simplification done, saved to public/bd-divisions-simplified.json');
