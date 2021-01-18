// set svg width and height
let svgWidth = 900;
let svgHeight = 400;

// set margin values
let margin = {
  top: 20,
  right: 20,
  bottom: 80,
  left: 50
};

// set chart width and height
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// create svg wrapper, append svg group to hold chart, shift the group by left and top margins
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed("chart", true)

// shift group by left and top margins
let scatterGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data and create function to modify
d3.csv("assets/data/data.csv").then(function(data) {

    // set variables and set as numbers
    data.forEach(function(data) {
      data.age = +data.age;
      data.obesity = +data.obesity;
    });

    // create scale functions
    let xLinearScale = d3.scaleLinear()
      .domain([30, d3.max(data, d => d.age)])
      .range([0, width]);

    let yLinearScale = d3.scaleLinear()
      .domain([18, d3.max(data, d => d.obesity)])
      .range([height, 0]);

    // set axis values
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // add axes to chart
    scatterGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    scatterGroup.append("g")
      .call(leftAxis);

    // create circles
    let circlesGroup = scatterGroup.selectAll("g circle")
    .data(data)
    .enter()
    .append("g")

    circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "10")
    .classed("stateCircle", true)

    // add abbreviation labels to circles
    circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d.age))
    .attr("dy", d => yLinearScale(d.obesity - .2))
    .attr("font-size", 10)
    .classed("stateText", true)

    // set tool tip and add to chart
    let toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([60, -60])
      .html(function(d) {
        return (`${d.state}<br>Age: ${d.age}<br>Obesity: ${d.obesity}%`);
      });

    scatterGroup.call(toolTip);

    // create mouseover and mouseout events
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // add axis labels
    scatterGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    scatterGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age (Median)");

  // console log any errors
  }).catch(function(error) {
    console.log(error);
  });

