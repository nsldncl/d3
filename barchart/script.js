let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const xhr = new XMLHttpRequest();

let data;
let values;

let yScale;
let xScale;
let yAxisScale;
let xAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");

let drawCanvas = () => {
    svg.attr("height", height)
    svg.attr("width", width)
}

let generateScales = () => {
    xScale = d3.scaleLinear()
               .domain([0, values.length - 1])
               .range([padding, width - padding])
    
    yScale = d3.scaleLinear()
               .domain([0, d3.max(values, (d) => d[1])])
               .range([0, height - (2*padding)])

    let dates = values.map((d) => new Date(d[0])
    )

    console.log(dates)

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(dates), d3.max(dates)])
                   .range([padding, width - padding])
    
    yAxisScale = d3.scaleLinear()
                   .domain([0, d3.max(values, (d) => d[1])])
                   .range([height - padding, padding])
}

let drawBars = () => {

    let tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("visibility", "hidden")
                    .style("width", "auto")
                    .style("height", "auto")

    svg.selectAll("rect")
       .data(values)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("width", (width-(2*padding))/values.length)
       .attr("data-date", (d) => d[0])
       .attr("data-gdp", (d) => d[1])
       .attr("height", (d) => yScale(d[1]))
       .attr("x", (d, i) => xScale(i))
       .attr("y", (d) => (height - padding) - yScale(d[1]))
       .on("mouseover", (d) => {
        tooltip.transition()
               .style("visibility", "visible")
        tooltip.text(d[0])
        document.querySelector("#tooltip").setAttribute("data-date", d[0])
       })
       .on("mouseout", (d) => {
        tooltip.transition()
               .style("visibility", "hidden")
       })
}

let generateAxes = () => {
    
    svg.append("g")
       .attr("id", "x-axis")
       .call(d3.axisBottom(xAxisScale))
       .attr("transform", "translate(0," + (height-padding) + ")")

    svg.append("g")
       .attr("id", "y-axis")
       .call(d3.axisLeft(yAxisScale))
       .attr("transform", "translate(" + padding + ",0)")
}

xhr.open("GET", url, true);

xhr.onload = () => {
    data = JSON.parse(xhr.responseText)
    values = data["data"]
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}

xhr.send()
