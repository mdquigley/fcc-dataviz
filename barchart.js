const barchart = () => {
  const w = 900;
  const h = 600;
  const padding = 50;
  let data;
  let values = [];
  let heightScale;
  let xScale;
  let xAxisScale;
  let yAxisScale;
  let xAxis;
  let yAxis;

  const svg = d3.select("#barchart").attr("width", w).attr("height", h);
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding)
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .text("United States GDP");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -100)
    .attr("y", padding + 20 + "px")
    .text("Billion USD");
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", w / 2)
    .attr("y", h - 6)
    .text("Year");
  svg
    .append("text")
    .attr("class", "info-label")
    .attr("text-anchor", "end")
    .attr("x", w - 6)
    .attr("y", h - 6)
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

  const drawCanvas = () => {};

  const generateScales = () => {
    heightScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(values, (item) => {
          return item[1];
        }),
      ])
      .range([0, h - padding * 2]);
    xScale = d3
      .scaleLinear()
      .domain([0, values.length - 1])
      .range([padding, w - padding]);

    let datesArray = values.map((item) => {
      return new Date(item[0]);
    });

    xAxisScale = d3
      .scaleTime()
      .domain([d3.min(datesArray), d3.max(datesArray)])
      .range([padding, w - padding]);

    yAxisScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(values, (item) => {
          return item[1];
        }),
      ])
      .range([h - padding, padding]);
  };

  const drawBars = () => {
    let formattedDate = (date) => {
      let quarter;
      switch (date.slice(5, 7)) {
        case "01":
          quarter = "Q1";
          break;
        case "04":
          quarter = "Q2";
          break;
        case "07":
          quarter = "Q3";
          break;
        case "10":
          quarter = "Q4";
          break;
      }
      return `${date.slice(0, 4)} ${quarter}`;
    };

    let tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", (w - padding * 2) / values.length)
      .attr("data-date", (item) => {
        return item[0];
      })
      .attr("data-gdp", (item) => {
        return item[1];
      })
      .attr("height", (item) => {
        return heightScale(item[1]);
      })
      .attr("x", (item, index) => {
        return xScale(index);
      })
      .attr("y", (item) => {
        return h - padding - heightScale(item[1]);
      })
      .on("mouseover", (event, item) => {
        tooltip.transition().style("opacity", 1);
        tooltip.html(`Date: ${formattedDate(item[0])}<br />GDP: $${item[1]}`);
        tooltip
          .style("left", event.pageX + 20 + "px")
          .style("top", event.pageY - 20 + "px")
          .attr("data-date", event.toElement.dataset.date);
      })
      .on("mouseout", (item) => {
        tooltip.transition().style("opacity", 0);
      });
  };

  const generateAxes = () => {
    xAxis = d3.axisBottom(xAxisScale);

    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (h - padding) + ")");

    yAxis = d3.axisLeft(yAxisScale);

    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ", 0)");
  };

  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((json) => {
      data = json;
      values = json.data;
      drawCanvas();
      generateScales();
      drawBars();
      generateAxes();
    });
};

barchart();
