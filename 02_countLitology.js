// contagem de pixeis

// dado de entrada
var input = 'users/luisragg/RochasBrasil';

// importar  entrada
var input = ee.Image(input);
// 1: Rochas Ígneas
// 2: Rochas Metamórficas 
// 3: Rochas Sedimentares

// Plotar litologia  
Map.addLayer(input.randomVisualizer(), {}, 'Input');

// importar regiões de classificação 
var regioes = ee.FeatureCollection('users/dhconciani/base/cerrado_regioes_c6');

// Plotar regiões
Map.addLayer(regioes, {}, 'Regiões');

// Função para extrair contagem de pixels
var getCount = function(feature) {
  // contar numero de pixels por classe
  var contagem = input.reduceRegion({
                  reducer: ee.Reducer.frequencyHistogram(),
                  geometry : feature.geometry(), 
                  scale:30, 
                  maxPixels: 1e13
                  });
                  
  var value_contagem = ee.Dictionary(ee.Number(contagem.get('b1')));

  return feature.set(value_contagem);
  };

// Aplicar função 
var regioes_contagem = regioes.map(getCount);

// printar resultado
print (regioes_contagem);

// exportar como CSV
Export.table.toDrive({
  collection: regioes_contagem,
  description: 'contagem',
  folder: 'EXPORT',
  fileFormat: 'CSV'
});
