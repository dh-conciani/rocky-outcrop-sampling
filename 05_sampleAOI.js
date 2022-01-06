// script auxiliar para elaboração de área de interesse para classe de afloramento rochoso
// mapbiomas cerrado

// definir tamanho do buffer (em metros)
var buffer_size = 10000;

// definir ano para mosaico Landsat e coleção 6.0
var ano = 2020;

// carregar limites dos biomas
var biomas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/biomas-2019');

// carregar regiões de classificação do cerrado
var regioes_classificacao = ee.FeatureCollection('users/dh-conciani/vectors/cerrado_regions_without_overlap');

// classificação mapbiomas
var mapbiomas = ee.Image('projects/mapbiomas-workspace/public/collection6/mapbiomas_collection60_integration_v1')
                    .select(['classification_' + ano]);

// mosaico landsat
var landsat = ee.ImageCollection('projects/nexgenmap/MapBiomas2/LANDSAT/mosaics')
                  .filterMetadata('year', 'equals', ano)
                  .filterMetadata('biome', 'equals', 'CERRADO')
                  .filterMetadata('version', 'equals', '2')
                  .mosaic();

// palheta de cores mapbiomas
// import the color ramp module from mapbiomas 
var palettes = require('users/mapbiomas/modules:Palettes.js');
var vis = {
    'min': 0,
    'max': 49,
    'palette': palettes.get('classification6')
};

// criar buffer em cada ponto
var pontos_buffer = ee.FeatureCollection(pontos).map(
                    function (feature) {
                      return (feature.buffer(buffer_size));
                      }
                    );

// plotar
// mosaico landsat
Map.addLayer(landsat, {
        bands: ['swir1_median', 'nir_median', 'red_median'],
        gain: [0.08, 0.07, 0.2],
        gamma: 0.85
    }, 'landsat ' + ano);

// mapbiomas
Map.addLayer(mapbiomas.updateMask(landsat.select(0)), vis, 'mapbiomas ' + ano, false);

// biomas
Map.addLayer(biomas, {}, 'biomas', false);

// regioes
Map.addLayer(regioes_classificacao, {}, 'regiões', false);

// buffer
Map.addLayer(pontos_buffer, {}, 'buffer');

// buffer
//Map.addLayer(pontos, {}, 'pontos');
