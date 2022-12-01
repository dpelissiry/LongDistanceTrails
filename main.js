//let filePath = "./trails-topojson-detailed/"
let filePath = "./trails-topojson-simplified/"
let trails = ["north-country-trail.json", "pacific-crest-trail.json", "appalachian-trail.json", "continental-divide-trail.json", 
              "arizona-national-scenic-trail.json", "batona-trail.json", "benton-mackaye-trail.json", 
              "colorado-trail.json",  "laurel-highlands-hiking-trail.json", "long-path.json", "long-trail.json",
              "new-england-trail.json", "northville-placid-trail.json", "john-muir-trail.json", "big-SEKI-loop.json",
              "pinhoti-trail.json", "tahoe-rim-trail.json", "tuscarora-trail.json", "wonderland-trail.json"];

var color = d3.scaleOrdinal(d3.schemeCategory20);

// this code was taken from a StackOverflow response
// which can be found here https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
d3.select("div#map")
    .append("div")
    .classed("svg-container", true) 
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1020 960")
    .classed("svg-content-responsive", true)

var svg = d3.select("svg");
var width = $("svg").parent().width();

let projection = d3.geoAlbersUsa()
                    .scale(1400)
                    .translate([width / 2.25, width / 2.65]);

let path = d3.geoPath()
                .pointRadius(0)
                .projection(projection);

var zoom = d3.zoom()
    .scaleExtent([1, 12])
    .translateExtent([[-90, -25], [width + 90, width - 40]])
    .on("zoom", zoomed);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "mapTooltip")
    .style("opacity", 0);

// draw us map
d3.queue()
    .defer(d3.json, "./USA.json")
    .await(drawUS);

function drawUS(error, us){
    if(error) throw error;
    svg.append("g")
        .attr("class", "USA")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.units).features)
        .enter().append("path")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("fill", "none")
        .attr("d", path);
}

for(let i in trails){
    // draw trail
    d3.queue()
        .defer(d3.json, filePath + trails[i])
        .await(drawTrail);
}

function drawTrail(error, trail){
    if(error) throw error;

    svg.append("g")
        .attr("class", "trail")
        .selectAll("path")
        .data(topojson.feature(trail, trail.objects.trail).features)
        .enter().append("path")
        .attr("stroke", color(trail.id))
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
}

svg.call(zoom);
function zoomed(){
    svg.selectAll(".USA").attr("transform", d3.event.transform);
    svg.selectAll(".trail").attr("transform", d3.event.transform);
}
