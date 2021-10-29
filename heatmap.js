const heatmap = () => {
  const w = 1200;
  const h = 700;
  const padding = 100;
  let data;
  let yScale;
  let xScale;
  let xAxisScale;
  let yAxisScale;
  let xAxis;
  let yAxis;

  const svg = d3.select("#heatmap").attr("width", w).attr("height", h);
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding / 2)
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .text("Monthly Global Land-Surface Temperature");
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding / 2 + 20)
    .attr("id", "description")
    .attr("text-anchor", "middle")
    .text("1753 - 2015: base temperature 8.66℃");

  const drawCanvas = () => {};

  const drawCells = () => {
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    let colors = [
      "#102c52",
      "#033270",
      "#1368aa",
      "#4091c9",
      "#9dcee2",
      "#b1d4e0",
      "#f7ebe6",
      "#fedfd4",
      "#f29479",
      "#f26a4f",
      "#ef3c2d",
      "#cb1b16",
      "#65010c",
    ];

    svg
      .selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (item) => item.month - 1)
      .attr("data-year", (item) => item.year)
      .attr("data-temp", (item) => item.variance + data.baseTemperature)
      .style("fill", (item) => {
        let temp = item.variance + data.baseTemperature;
        switch (true) {
          case temp > 1.5 && temp <= 2.5:
            return colors[0];
          case temp > 2.5 && temp <= 3.5:
            return colors[1];
          case temp > 3.5 && temp <= 4.5:
            return colors[2];
          case temp > 4.5 && temp <= 5.5:
            return colors[3];
          case temp > 5.5 && temp <= 6.5:
            return colors[4];
          case temp > 6.5 && temp <= 7.5:
            return colors[5];
          case temp > 7.5 && temp <= 8.5:
            return colors[6];
          case temp > 8.5 && temp <= 9.5:
            return colors[7];
          case temp > 9.5 && temp <= 10.5:
            return colors[8];
          case temp > 10.5 && temp <= 11.5:
            return colors[9];
          case temp > 11.5 && temp <= 12.5:
            return colors[10];
          case temp > 12.5 && temp <= 13.5:
            return colors[11];
          case temp > 13.5:
            return colors[12];
        }
      })
      .attr("x", (item) => xScale(item.year))
      .attr("y", (item) => yScale(item.month))
      .attr("width", (item) => {
        let cellWidth =
          d3.max(values, (item) => item.year) -
          d3.min(values, (item) => item.year);
        return (w - padding * 2) / cellWidth;
      })
      .attr("height", (h - padding * 2) / 12)
      .on("mouseover", (event, item) => {
        tooltip.transition().style("opacity", 1);
        tooltip.html(() => {
          let formatMonth = d3.timeFormat("%b");
          let formatTemp = d3.format(".1f");
          let date = new Date(0);
          date.setUTCMonth(item.month);
          return `${formatMonth(date)} ${item.year}<br />${formatTemp(
            item.variance + data.baseTemperature
          )}℃`;
        });
        tooltip
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY - 20 + "px")
          .attr("data-year", event.toElement.dataset.year);
      })
      .on("mouseout", (event, item) => {
        tooltip.transition().style("opacity", "0");
      });

    let legend = svg.append("g").attr("id", "legend");
    legend
      .selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", (item, index) => w / 2 + index * 25)
      .attr("y", h - 50)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", (item, index) => colors[index]);

    legend
      .selectAll("text")
      .data(colors)
      .enter()
      .append("text")
      .attr("x", (item, index) => w / 2 + index * 25)
      .attr("y", h - 20)
      .text((item, index) => {
        let format = d3.format(".1f");
        return format(
          index +
            d3.min(data.monthlyVariance, (item) => item.variance) +
            data.baseTemperature
        );
      })
      .style("font-size", "10px");

    legend
      .append("text")
      .text("Temp in ℃")
      .attr("y", h - 20)
      .attr("x", w / 2 - 60)
      .style("font-size", "10px");
  };

  const generateScales = () => {
    xScale = d3
      .scaleLinear()
      .domain([
        d3.min(values, (item) => item.year - 1),
        d3.max(values, (item) => item.year + 1),
      ])
      .range([padding, w - padding]);

    yScale = d3
      .scaleBand()
      .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      .rangeRound([padding, h - padding]);
  };

  const generateAxes = () => {
    yAxis = d3
      .axisLeft(yScale)
      .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      .tickFormat((month) => {
        let date = new Date(0);
        date.setUTCMonth(month);
        let format = d3.timeFormat("%B");
        return format(date);
      });
    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ", 0)");

    xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (h - padding) + ")");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -300)
      .attr("y", 40)
      .text("Month");
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "end")
      .attr("x", w / 4)
      .attr("y", h - 40)
      .text("Year");
  };

  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((response) => response.json())
    .then((json) => {
      data = json;
      values = data.monthlyVariance;
      drawCanvas();
      generateScales();
      generateAxes();
      drawCells();
    });
};

heatmap();
