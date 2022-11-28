let filePath = "./trails-geojson/"
let trails = ["appalachian-trail.json", "arizona-national-scenic-trail.json", "batona-trail.json", "benton-mackaye-trail.json", "big-SEKI-loop.json",
              "colorado-trail.json", "continental-divide-trail.json", "john-muir-trail.json", "laurel-highlands-hiking-trail.json", "long-path.json",
              "long-trail.json", "new-england-trail.json", "north-country-trail.json", "northville-placid-trail.json", "pacific-crest-trail.json",
              "pinhoti-trail.json", "tahoe-rim-trail.json", "tuscarora-trail.json", "wonderland-trail.json"];

var color = d3.scaleOrdinal(d3.schemeCategory20);

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

let projection = d3.geoAlbersUsa()
                    .scale(1300)
                    .translate([width / 2, height / 3.2]);

let geoGenerator = d3.geoPath()
                        .pointRadius(0)
                        .projection(projection);

let path = d3.geoPath();

var zoom = d3.zoom().on("zoom", zoomed);

var tooltip = d3.select("body").append("div")
    .attr("class", "mapTooltip")
    .style("opacity", 0);

// draw us map
d3.queue()
    .defer(d3.json, "./us-10m.json")
    .await(drawUS);

function drawUS(error, us){
    if(error) throw error;
    // draw counties
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", geoGenerator);

    // draw states
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", geoGenerator);
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
        .data(trail.features)
        .enter().append("path")
        .attr("stroke", color(trail.id))
        .attr("d", geoGenerator)
        .on("mouseover", function(d){
                            tooltip.style("opacity", 1)
                                    .style("left", (d3.event.pageX + 10) + "px")
                                    .style("top", (d3.event.pageY - 20) + "px");
                            tooltip.html(trail.name + "<br>" + "Total Distance: " + trail.distance + " Meters<br>" + "Max Elevation: " + trail.maxElevation + " Meters");
                        }
            )
        .on("mouseout", function(d) {tooltip.style("opacity", 0);});
}

svg.call(zoom);
function zoomed(){
    svg.selectAll(".counties").attr("transform", d3.event.transform);
    svg.selectAll(".states").attr("transform", d3.event.transform);
    svg.selectAll(".trail").attr("transform", d3.event.transform);
}