let filePath = "./trails-topojson-simplified/"
let trails = ["north-country-trail.json", "pacific-crest-trail.json", "appalachian-trail.json", "continental-divide-trail.json", 
              "arizona-national-scenic-trail.json", "batona-trail.json", "benton-mackaye-trail.json", 
              "colorado-trail.json",  "laurel-highlands-hiking-trail.json", "long-path.json", "long-trail.json",
              "new-england-trail.json", "northville-placid-trail.json", "john-muir-trail.json", "big-SEKI-loop.json",
              "pinhoti-trail.json", "tahoe-rim-trail.json", "tuscarora-trail.json", "wonderland-trail.json"];

let trailNames = ["North Country National Scenic Trail", "Pacific Crest Trail", "The Appalachian Trail", "Continental Divide National Scenic Trail",
                  "Arizona National Scenic Trail", "Batona Trail", "Benton-MacKaye Trail", "Colorado Trail", "Laurel Highlands Hiking Trail",
                  "Long Path Trail", "The Long Trail", "New England Trail", "Northville Placid Trail", "John Muir Trail", "Big SEKI Loop",
                  "Pinhoti Trail", "Tahoe Rim Trail", "Tuscarora Trail", "The Wonderland Trail"];

var color = d3.scaleOrdinal(d3.schemeCategory20);
// map names to colors
let nameToColor = {};
for(let i in trailNames){
    nameToColor[trailNames[i]] = color(trailNames[i])
};

// VARIABLES RELATED TO THE MAP
// this code was taken from a StackOverflow response
// which can be found here https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
d3.select("div#map")
    .append("div")
    .classed("svg-container", true) 
    .append("svg")
    .attr("id", "map")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1020 960")
    .classed("svg-content-responsive", true)

var mapSvg = d3.select("svg#map");
var mapWidth = $("svg#map").parent().width();

let projection = d3.geoAlbersUsa()
                    .scale(1400)
                    .translate([mapWidth / 2.25, mapWidth / 2.65]);

let path = d3.geoPath()
                .pointRadius(0)
                .projection(projection);

var mapZoom = d3.zoom()
    .scaleExtent([1, 12])
    .translateExtent([[-90, -25], [mapWidth + 90, mapWidth - 40]])
    .on("zoom", mapZoomed);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "mapTooltip")
    .style("opacity", 0);

// ACTUALLY DRAWING THE MAP
d3.json("./USA.json", function(error, us){
    if(error) throw error;
    mapSvg.append("g")
        .attr("class", "USA")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.units).features)
        .enter().append("path")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("fill", "none")
        .attr("d", path);
});

// ACTUALLY DRAWING THE TRAILS
for(let i in trails){
    d3.json(filePath + trails[i], function(error, trail){
        if(error) throw error;
        mapSvg.append("g")
            .attr("class", "trail")
            .selectAll("path")
            .data(topojson.feature(trail, trail.objects.trail).features)
            .enter().append("path")
            .attr("stroke", color(trail.name))
            .attr("d", path)
            .on("mouseover", function(d){
                tooltip.style("opacity", 1)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 20) + "px");
                tooltip.html(trail.name + "<br>" + "Total Distance: " + trail.distance + " Miles<br>" + "Max Elevation: " + trail.maxElev + " Meters");
                }
            )
            .on("mouseout", function(d){
                tooltip.style("opacity", 0);
            });
    })
}

mapSvg.call(mapZoom);
function mapZoomed(){
    mapSvg.selectAll(".USA").attr("transform", d3.event.transform);
    mapSvg.selectAll(".trail").attr("transform", d3.event.transform);
}