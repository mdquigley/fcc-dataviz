const scatterplot = () => {
  const w = 900;
  const h = 600;
  const padding = 50;
  let data;
  let yScale;
  let xScale;
  let xAxisScale;
  let yAxisScale;
  let xAxis;
  let yAxis;
  let noDopeColor = "#3c98e8";
  let dopeColor = "#e87b3c";
  let timeFormat = d3.timeFormat("%M:%S");

  const svg = d3.select("#scatterplot").attr("width", w).attr("height", h);
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding)
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .text("Doping in Professional Bicycle Racing");
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding + 20)
    .attr("id", "subtitle")
    .attr("text-anchor", "middle")
    .text("35 Fastest times up Alpe d'Huez");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -100)
    .attr("y", padding + 20 + "px")
    .text("Time in Minutes");
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", w / 2)
    .attr("y", h - 6)
    .text("Year");

  let legend = svg.append("g").attr("id", "legend");

  legend
    .append("text")
    .text("No doping allegations")
    .style("font-size", "10px")
    .attr("x", w - 200)
    .attr("y", h / 3);

  legend
    .append("rect")
    .attr("x", w - 100)
    .attr("y", h / 3 - 13)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", noDopeColor);

  legend
    .append("text")
    .text("Doping allegations")
    .style("font-size", "10px")
    .attr("x", w - 186)
    .attr("y", h / 3 + 30);

  legend
    .append("rect")
    .attr("x", w - 100)
    .attr("y", h / 3 - 13 + 30)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", dopeColor);

  const drawCanvas = () => {};

  const generateScales = () => {
    yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (item) => item.Time))
      .range([padding, h - padding]);

    xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (item) => item.Year - 1),
        d3.max(data, (item) => item.Year + 1),
      ])
      .range([padding, w - padding]);

    let datesArray = data.map((item) => {
      return new Date(item.Year);
    });

    xAxisScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (item) => item.Year - 1),
        d3.max(data, (item) => item.Year + 1),
      ])
      .range([padding, w - padding]);

    yAxisScale = d3
      .scaleTime()
      .domain(d3.extent(data, (item) => item.Time))
      .range([padding, h - padding]);
  };

  const drawDots = () => {
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .style("stroke", "gray")
      .style("fill", (item) => (item.Doping ? dopeColor : noDopeColor))
      .attr("class", "dot")
      .attr("r", 6)
      .attr("cx", (item, index) => xScale(item.Year))
      .attr("cy", (item) => yScale(item.Time))
      .attr("data-xvalue", (item) => item.Year)
      .attr("data-yvalue", (item) => item.Time)
      .on("mouseover", (event, item) => {
        tooltip.transition().style("opacity", 1);
        tooltip.html(
          `${item.Name}, ${item.Nationality}<br />Year: ${
            item.Year
          }<br />Time:  ${item.Time.getMinutes()}:${
            item.Time.getSeconds() < 10
              ? "0" + item.Time.getSeconds()
              : item.Time.getSeconds()
          }<br />${item.Doping ? `<br />Summary: ` + item.Doping : ""}`
        );
        tooltip
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY - 20 + "px")
          .attr("data-year", event.toElement.dataset.xvalue);
      })
      .on("mouseout", (event, item) => {
        tooltip.transition().style("opacity", 0);
      });
  };

  const generateAxes = () => {
    xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));

    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (h - padding) + ")");

    yAxis = d3.axisLeft(yAxisScale).tickFormat(timeFormat);

    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ", 0)");
  };

  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((json) => {
      data = json;
      data.forEach((item) => {
        let parsedTime = item.Time.split(":");
        item.Time = new Date(1990, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });
      drawCanvas();
      generateScales();
      generateAxes();
      drawDots();
    });
};

scatterplot();
