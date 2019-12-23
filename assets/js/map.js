/**
 * Created by Jean on 2019-10-09.
 */

var MapBase = {
    minZoom: 2,
    maxZoom: 7,
    heatmapData: []
};

MapBase.init = function ()
{
    var southWestTiles = L.latLng(-144, 0),
        northEastTiles = L.latLng(0, 176),
        boundsTiles = L.latLngBounds(southWestTiles, northEastTiles);

    var mapLayers = [];
    mapLayers['Default'] = L.tileLayer('https://s.rsg.sc/sc/images/games/RDR2/map/game/{z}/{x}/{y}.jpg', { noWrap: true, bounds: boundsTiles });
    mapLayers['Detailed'] = L.tileLayer('assets/maps/detailed/{z}/{x}_{y}.jpg', { noWrap: true, bounds: boundsTiles});
    mapLayers['Dark'] = L.tileLayer('assets/maps/darkmode/{z}/{x}_{y}.jpg', { noWrap: true, bounds: boundsTiles});

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        radius: 1.5,
        maxOpacity: .5,
        minOpacity: .1,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": false,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count',
        gradient: { 0.25: "rgb(125, 125, 125)", 0.55: "rgb(48, 25, 52)", 1.0: "rgb(255, 42, 32)" }


    };
    heatmapLayer = new HeatmapOverlay(cfg);

    map = L.map('map', {
        preferCanvas: true,
        minZoom: MapBase.minZoom,
        maxZoom: MapBase.maxZoom,
        zoomControl: false,
        crs: L.CRS.Simple,
        layers: [mapLayers[Cookies.get('map-layer')], heatmapLayer]
    }).setView([-70, 111.75], 3);

    var baseMaps = {
        "Default": mapLayers['Default'],
        "Detailed": mapLayers['Detailed'],
        "Dark": mapLayers['Dark']
    };

    L.control.zoom({
        position:'bottomright'
    }).addTo(map);

    L.control.layers(baseMaps).addTo(map);

    map.on('click', function (e)
    {
        MapBase.addCoordsOnMap(e);
    });

    map.on('baselayerchange', function (e)
    {
        setMapBackground(e.name);
    });

    var southWest = L.latLng(-170.712, -25.227),
        northEast = L.latLng(10.774, 200.125),
        bounds = L.latLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);

    MapBase.loadMarkers();
};

MapBase.loadMarkers = function()
{
    $.getJSON(`data/items.json?nocache=${nocache}`)
        .done(function(data)
        {
            $.each(enabledTypes, function (eKey, eValue)
            {
                if(subCategories.includes(eValue))
                {
                    $.each(data['plants'][eValue], function(mKey, mValue)
                    {
                        markers.push({icon: 'plants', sub_data: eValue, lat: mValue.lat, lng: mValue.lng, count: mValue.count});
                    });
                }
                else
                {
                    if(eValue == 'plants') return;

                    $.each(data[eValue], function (mKey, mValue)
                    {
                        markers.push({ icon: eValue, lat: mValue.lat, lng: mValue.lng });
                    });
                }
            });

            markers = markers.sort(function (a, b) {
                return b.lat - a.lat;
            });

            MapBase.addMarkers();
        });
};
var finalText = '';

MapBase.addMarkers = function()
{
    ciLayer.addTo(map);
    ciLayer.clearLayers();

    ciMarkers = [];
    //markers = markers.sort((a ,b) => (a.lat > b.lat) ? 1 : ((b.lat > a.lat) ? -1 : 0));
    finalText  = '';

    $.each(markers, function (key, value)
    {
        if(enabledTypes.includes(value.icon))
        {
            if(value.sub_data != null) {
                if(!enabledTypes.includes(value.sub_data))
                    return;
            }
            if (searchTerms.length > 0)
            {
                $.each(searchTerms, function (id, term)
                {
                    var tempName = (value.sub_data == null) ? Language.get('menu.'+value.icon) : Language.get('menu.plant.'+value.sub_data);
                    if (tempName.toLowerCase().indexOf(term.toLowerCase()) !== -1)
                    {
                        if (visibleMarkers[value.text] !== null)
                        {
                            MapBase.addMarkerOnMap(value);
                        }
                    }
                });
            }
            else
            {
                MapBase.addMarkerOnMap(value);
            }
        }
    });

    if(ciMarkers.length > 0)
        ciLayer.addLayers(ciMarkers);

    Menu.refreshMenu(firstLoad);
    firstLoad = false;
};

MapBase.populate = function (max = 10000)
{

    ciLayer.clearLayers();
    ciMarkers = [];


    var icon = L.icon({
        iconUrl: `assets/images/markers/random.png`,
        iconSize: [42, 42],
        iconAnchor: [42 / 2, 42],
        popupAnchor: [0, -40]
    });
    for(var i = 0; i < max; i++) {
        var tempMarker = L.marker([MapBase.getRandom(-120.75, -15.25), MapBase.getRandom(-5.25, 187.5)],
            {
                icon: icon
            });

        tempMarker.bindPopup(`I'm marker ${i}`);
        visibleMarkers['random'] = tempMarker;
        ciMarkers.push(tempMarker);
    }

    ciLayer.addLayers(ciMarkers);
};
MapBase.getRandom = function (min, max)
{
    return Math.random() * (max - min) + min;
};

MapBase.addMarkerOnMap = function(value)
{
    var icon = L.icon({
        iconUrl: `assets/images/markers/${value.icon}.png`,
        iconSize:[31.5,42],
        iconAnchor:[31.5/2,42],
        popupAnchor:[0,-38]
    });

    var tempMarker = L.marker([value.lat, value.lng],
        {
            icon: icon
        });


    var popupTitle = (value.sub_data != null) ? Language.get('menu.plant.'+value.sub_data) : Language.get('menu.'+value.icon);
    var popupContent = (value.count != null) ? Language.get('map.plant.count').replace('{count}', value.count).replace('{plant}', Language.get('menu.plant.'+value.sub_data)) : '';
    popupContent = (popupContent == null) ? '' : popupContent;
    tempMarker.bindPopup(
        `<h1 class="popup-title">${popupTitle}</h1>
        <div class="popup-content">
        ${popupContent}
        </div>`
    );
    visibleMarkers[value.text] = tempMarker;
    ciMarkers.push(tempMarker);

};

MapBase.removeCollectedMarkers = function()
{
    $.each(markers, function (key, value)
    {
        if(visibleMarkers[value.text] != null)
        {
            if (disableMarkers.includes(value.text.toString()))
            {
                $(visibleMarkers[value.text]._icon).css('opacity', '.35');
            }
            else
            {
                $(visibleMarkers[value.text]._icon).css('opacity', '1');
            }
        }
    });
};

MapBase.removeItemFromMap = function(value) {
    if(enabledTypes.includes(value)) {
        enabledTypes = $.grep(enabledTypes, function(data) {
            return data != value;
        });
    }
    else {
        enabledTypes.push(value);
    }

    MapBase.addMarkers();
};

MapBase.debugMarker = function (lat, long)
{
    var icon = L.icon({
        iconUrl: `assets/images/markers/random.png`,
        iconSize:[42,42],
        iconAnchor:[42/2,42],
        popupAnchor:[0,-40]
    });
    var marker = L.marker([lat, long], {
        icon: icon
    });

    marker.bindPopup(`<h1>Debug Marker</h1><p>  </p>`);
    ciLayer.addLayer(marker);
};

MapBase.setHeatmap = function(value, category)
{
    heatmapLayer.setData({min: 10, data: Heatmap.data[category][value].data});
};

MapBase.removeHeatmap = function ()
{
    heatmapLayer.setData({min: 10, data: []});
};

var testData = { max: 10, data: [] };
MapBase.addCoordsOnMap = function(coords)
{
    // Show clicked coordinates (like google maps)
    if (showCoordinates)
    {
        $('.lat-lng-container').css('display', 'block');

        $('.lat-lng-container p').html(`lat: ${coords.latlng.lat} <br> lng: ${coords.latlng.lng}`);

        $('#lat-lng-container-close-button').click(function() {
            $('.lat-lng-container').css('display', 'none');
        });
    }

    if(debug == 'addMarker')
    {
        console.log(`{"lat": "${coords.latlng.lat}", "lng": "${coords.latlng.lng}"},`);
    }
    if(debug == 'addPlant')
    {
        console.log(`{"count": "", "lat": "${coords.latlng.lat}", "lng": "${coords.latlng.lng}"},`);
    }
    if(debug == 'addHeatmap') {
        console.log(`{"lat":"${coords.latlng.lat}","lng":"${coords.latlng.lng}","count":"${heatmapCount}"},`);
        testData.data.push({lat: coords.latlng.lat, lng: coords.latlng.lng, count: heatmapCount});
        heatmapLayer.setData(testData);
    }
};
