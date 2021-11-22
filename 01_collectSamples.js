// sample code to collect reference points of rocky outcrop 
// issue/bug write to dhemerson.costa@ipam.org.br

// import cerrado
var regions = ee.FeatureCollection('users/dh-conciani/vectors/cerrado_regions_without_overlap');
var biomes = ee.Image('projects/mapbiomas-workspace/AUXILIAR/biomas-2019-raster');

// inspect classification result
var year = 2020

// inspect region (1 - 38)
var region_id = 1

// define inputs
var mosaic = 'projects/nexgenmap/MapBiomas2/SENTINEL/mosaics';
var col6 = ee.Image('projects/mapbiomas-workspace/public/collection6/mapbiomas_collection60_integration_v1');
var landsat =  'projects/nexgenmap/MapBiomas2/LANDSAT/mosaics';
var region = regions.filterMetadata('gridcode', 'equals', region_id);

// import the color ramp module from mapbiomas 
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 49,
    'palette': palettes.get('classification6')
};

// import mosaic 
var mosaic = ee.ImageCollection(mosaic)
    .filterMetadata('year', 'equals', year)
    .filterMetadata('version', 'equals', '1')
    .filterMetadata('biome', 'equals', 'CERRADO')
    .mosaic()
    .clip(region);

// import col6
var col6 = col6.select(['classification_' + year]).clip(region);
            
// import landsat mosaic
var landsat = ee.ImageCollection(landsat)
    .filterMetadata('year', 'equals', year)
    .filterMetadata('biome', 'equals', 'CERRADO')
    .filterMetadata('version', 'equals', '2')
    .mosaic()
    .clip(region);
    
// plot sentinel mosaic
Map.addLayer(mosaic, {
    'bands': ['swir1_median', 'nir_median', 'red_median'],
    'gain': [0.08, 0.07, 0.2],
    'gamma': 0.85
}, 'Sentinel ' + year, true);

// Plot Landsat
Map.addLayer(landsat, {
        bands: ['swir1_median', 'nir_median', 'red_median'],
        gain: [0.08, 0.07, 0.2],
        gamma: 0.85
    },
    'Landsat ' + year, false);

// plot col6
Map.addLayer(col6, vis, 'Collection 6.0 ' + year, false);

// regions to inspect
//Map.addLayer(region, {}, 'region');
