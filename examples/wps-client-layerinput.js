OpenLayers.ProxyHost = 'proxy.cgi?url=';

var map, client, intersect, buffer, wfsLayer;

function init() {
    
    map = new OpenLayers.Map('map', {
        allOverlays: true,
        center: [114, 16],
        zoom: 4,
        layers: [new OpenLayers.Layer.Vector()]
    });

    map.baseLayer.addFeatures(features);
    map.baseLayer.addFeatures([new OpenLayers.Feature.Vector(geometry)]);
   
    wfsLayer = new OpenLayers.Layer.Vector("WFS", {
        protocol: new OpenLayers.Protocol.WFS({
          version: "1.1.0",
          outputFormat: "JSON",
          url:  "http://demo.opengeo.org/geoserver/wfs",
          featurePrefix: "osm",
          featureType: "roads",
          geometryName: "the_geom",
          featureNS: "http://openstreemap.org"
        })
    });

    client = new OpenLayers.WPSClient({
        servers: {
            opengeo: 'http://demo.opengeo.org/geoserver/wps',
        }
    });
    
    client.execute({
      server: 'opengeo',
      process: 'gs:Simplify',
      inputs: {
        features: wfsLayer,
        distance: 0.1,
        preserveTopology: false
      },
      success: function(outputs) {
        map.baseLayer.addFeatures(outputs.result);
      }
    });

}