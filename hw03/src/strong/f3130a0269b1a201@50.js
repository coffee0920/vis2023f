function _1(md){return(
md`# HW 3 Strong baseline`
)}

function _userdata(FileAttachment){return(
FileAttachment("UserData.json").json()
)}

function _LivePlace_column(userdata){return(
userdata.map(row => row["LivingPlaceFirst"])
)}

function _LivePlace_uniqueValues(LivePlace_column){return(
[...new Set(LivePlace_column)].sort()
)}

function _LivePlace_counts(LivePlace_uniqueValues,LivePlace_column)
{
  const arr = LivePlace_uniqueValues.map(val => ({
    value: val,
    count: LivePlace_column.filter(v => v === val).length
  }));
  return arr.sort((a, b) => a.count - b.count);
}


function _scaleCount(LivePlace_uniqueValues,LivePlace_counts){return(
(county) => {
  if (!LivePlace_uniqueValues.includes(county)) return 0;
  return LivePlace_counts.findIndex(t => t.value === county) + 5;
}
)}

function _returnCount(LivePlace_uniqueValues,LivePlace_counts){return(
(county) => {
  if (!LivePlace_uniqueValues.includes(county)) return 0;
  return LivePlace_counts.find(t => t.value === county).count;
}
)}

function _tw(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/taiwan-atlas/towns-10t.json")
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _bgColor(Inputs){return(
Inputs.color({ label: "background color", value: "#7BB1D8" })
)}

function _strokeColor(Inputs){return(
Inputs.color({ label: "stroke color", value: "#2F0000" })
)}

function _strokeOpacity(Inputs){return(
Inputs.range([0, 1], {
  step: 0.01,
  label: "stroke opacity"
})
)}

function _chart(tw,d3,LivePlace_uniqueValues,topojson,DOM,bgColor,strokeColor,strokeOpacity,scaleCount,returnCount)
{
  // 處理台與臺的關係
  tw.objects.counties.geometries.forEach((element) => {
    if (element.properties.COUNTYNAME === "台東縣") {
      element.properties.COUNTYNAME = "臺東縣";
    } else if (element.properties.COUNTYNAME === "台中市") {
      element.properties.COUNTYNAME = "臺中市";
    } else if (element.properties.COUNTYNAME === "台北市") {
      element.properties.COUNTYNAME = "臺北市";
    } else if (element.properties.COUNTYNAME === "台南市") {
      element.properties.COUNTYNAME = "臺南市";
    }
  });
  
  const color = d3.scaleQuantize([0, LivePlace_uniqueValues.length + 10], ["#fcfbfd","#fcfbfd","#fbfafc","#fbfafc","#faf9fc","#faf9fc","#faf8fb","#f9f8fb","#f9f7fb","#f8f7fb","#f8f7fa","#f7f6fa","#f7f6fa","#f7f5fa","#f6f5f9","#f6f4f9","#f5f4f9","#f5f3f9","#f4f3f8","#f4f2f8","#f4f2f8","#f3f2f8","#f3f1f7","#f2f1f7","#f2f0f7","#f1f0f7","#f1eff6","#f0eff6","#f0eef6","#efeef5","#efedf5","#eeedf5","#eeecf5","#edecf4","#edebf4","#ecebf4","#ebeaf3","#ebe9f3","#eae9f3","#eae8f3","#e9e8f2","#e8e7f2","#e8e7f2","#e7e6f1","#e7e5f1","#e6e5f1","#e5e4f0","#e5e4f0","#e4e3f0","#e3e2ef","#e3e2ef","#e2e1ef","#e1e1ee","#e1e0ee","#e0dfee","#dfdfed","#dedeed","#dedded","#ddddec","#dcdcec","#dbdbec","#dbdaeb","#dadaeb","#d9d9ea","#d8d8ea","#d7d7ea","#d7d7e9","#d6d6e9","#d5d5e8","#d4d4e8","#d3d3e8","#d2d3e7","#d2d2e7","#d1d1e6","#d0d0e6","#cfcfe5","#cecee5","#cdcee5","#cccde4","#cbcce4","#cbcbe3","#cacae3","#c9c9e2","#c8c8e2","#c7c7e1","#c6c6e1","#c5c5e0","#c4c4e0","#c3c3df","#c2c3df","#c1c2de","#c0c1de","#bfc0dd","#bebfdd","#bebedc","#bdbddc","#bcbcdb","#bbbbda","#babada","#b9b9d9","#b8b8d9","#b7b7d8","#b6b5d8","#b5b4d7","#b4b3d6","#b3b2d6","#b2b1d5","#b1b0d5","#b0afd4","#afaed4","#aeadd3","#aeacd2","#adabd2","#acaad1","#aba9d1","#aaa8d0","#a9a7cf","#a8a6cf","#a7a5ce","#a6a4ce","#a5a3cd","#a4a2cd","#a3a1cc","#a2a0cb","#a19fcb","#a09eca","#9f9dca","#9e9cc9","#9e9ac9","#9d9ac8","#9c99c8","#9b98c7","#9a97c7","#9996c6","#9895c6","#9794c5","#9693c5","#9592c4","#9491c4","#9390c3","#928fc3","#918ec2","#908dc2","#908cc1","#8f8bc1","#8e8ac0","#8d89c0","#8c88bf","#8b87bf","#8a86be","#8985be","#8884bd","#8883bd","#8782bc","#8680bc","#857fbb","#847eba","#837dba","#827cb9","#827bb9","#817ab8","#8079b8","#7f77b7","#7e76b6","#7e75b6","#7d74b5","#7c73b4","#7b71b4","#7b70b3","#7a6fb3","#796eb2","#786cb1","#786bb1","#776ab0","#7668af","#7567af","#7566ae","#7465ad","#7363ad","#7362ac","#7261ab","#715fab","#705eaa","#705ca9","#6f5ba8","#6e5aa8","#6e58a7","#6d57a6","#6c56a6","#6c54a5","#6b53a4","#6a52a4","#6950a3","#694fa2","#684ea2","#674ca1","#674ba0","#664aa0","#65489f","#65479e","#64469e","#63449d","#63439c","#62429c","#61409b","#613f9a","#603e9a","#5f3c99","#5e3b99","#5e3a98","#5d3897","#5c3797","#5c3696","#5b3595","#5a3395","#5a3294","#593194","#582f93","#582e92","#572d92","#562b91","#562a91","#552990","#54288f","#54268f","#53258e","#52248e","#52238d","#51218c","#50208c","#501f8b","#4f1e8b","#4e1c8a","#4e1b8a","#4d1a89","#4c1988","#4c1788","#4b1687","#4a1587","#4a1486","#491286","#481185","#481084","#470f84","#460d83","#460c83","#450b82","#440a82","#440981","#430780","#420680","#42057f","#41047f","#40027e","#40017e","#3f007d"]);
  
  const width = 300;
  const height = 260;
  const offsetX = 0.25;
  const offsetY = -0.7;
  const scale = 3500;

  const bboxCenter = (bbox) => [
    (bbox[0] + bbox[2]) / 2 + offsetX,
    (bbox[1] + bbox[3]) / 2 + offsetY
  ];
  
  const projection = d3
    .geoMercator()
    .center(bboxCenter(topojson.bbox(tw)))
    .translate([width / 2, height / 2])
    .scale(scale);

  const path = d3.geoPath().projection(projection);

  const svg = d3
    .select(DOM.svg(width, height))
    .style("width", "100%")
    .style("height", "auto")
    .style("background-color", bgColor);

  const details = svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(tw, tw.objects.counties).features);

  svg
    .append("path")
    .datum(topojson.mesh(tw, tw.objects.counties, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", strokeColor)
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 0.5)
    .attr("opacity", strokeOpacity)
    .attr("d", path);

  details
    .enter()
    .append("path")
    .attr("fill", (d) => {
      return color(scaleCount(d.properties.COUNTYNAME));
    })
    .attr("d", path)
    .append("title")
    .text(d => d.properties.COUNTYNAME + ", " + `${returnCount(d.properties.COUNTYNAME)}`);

  svg.append("g");
  
  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["UserData.json", {url: new URL("./UserData.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("userdata")).define("userdata", ["FileAttachment"], _userdata);
  main.variable(observer("LivePlace_column")).define("LivePlace_column", ["userdata"], _LivePlace_column);
  main.variable(observer("LivePlace_uniqueValues")).define("LivePlace_uniqueValues", ["LivePlace_column"], _LivePlace_uniqueValues);
  main.variable(observer("LivePlace_counts")).define("LivePlace_counts", ["LivePlace_uniqueValues","LivePlace_column"], _LivePlace_counts);
  main.variable(observer("scaleCount")).define("scaleCount", ["LivePlace_uniqueValues","LivePlace_counts"], _scaleCount);
  main.variable(observer("returnCount")).define("returnCount", ["LivePlace_uniqueValues","LivePlace_counts"], _returnCount);
  main.variable(observer("tw")).define("tw", ["d3"], _tw);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("viewof bgColor")).define("viewof bgColor", ["Inputs"], _bgColor);
  main.variable(observer("bgColor")).define("bgColor", ["Generators", "viewof bgColor"], (G, _) => G.input(_));
  main.variable(observer("viewof strokeColor")).define("viewof strokeColor", ["Inputs"], _strokeColor);
  main.variable(observer("strokeColor")).define("strokeColor", ["Generators", "viewof strokeColor"], (G, _) => G.input(_));
  main.variable(observer("viewof strokeOpacity")).define("viewof strokeOpacity", ["Inputs"], _strokeOpacity);
  main.variable(observer("strokeOpacity")).define("strokeOpacity", ["Generators", "viewof strokeOpacity"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["tw","d3","LivePlace_uniqueValues","topojson","DOM","bgColor","strokeColor","strokeOpacity","scaleCount","returnCount"], _chart);
  return main;
}
