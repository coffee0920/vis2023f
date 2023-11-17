function _1(md){return(
md`# HW2 Strong baseline`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _constellations(){return(
[ "牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座" ]
)}

function _barChartData(){return(
[]
)}

function _5(barChartData,data,constellations)
{
  barChartData.length = 0;
  data.forEach ( x => {
    let constellation = constellations[x.Constellation];
    let engGender = x.Gender === "男" ? "male" : "female"
    let index = barChartData.findIndex((printRow) => printRow.Constellation === constellation && printRow.Gender === engGender);
    if (index == -1) {
      let printRow = {
        ConstellationNumber: x.Constellation,
        Constellation: constellation,
        Gender: engGender,
        Count: 1
      };
      barChartData.push(printRow);
    } else {
      barChartData[index].Count += 1;
    }
  });
  return barChartData;
}


function _plot2(Inputs){return(
Inputs.form({
	mt:  Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr:  Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb:  Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml:  Inputs.range([0, 100], {label: "marginLeft", step: 1}),
})
)}

function _7(Plot,plot2,barChartData){return(
Plot.plot({
  marginTop: plot2.mt,
  marginRight: plot2.mr,
  marginBottom: plot2.mb,
  marginLeft: plot2.ml,
  
  grid: true,
  color: {legend: true, domain: ["male", "female"], range: ["lightblue", "lightpink"]},
  y: {label: "Count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(barChartData, {
      x: "Constellation",
      y: "Count",
      fill: "Gender",
      channels: {
        ConstellationNumber: "ConstellationNumber",
      },
      tip: {
        format: {
          y: (d) => `: ${d}`,
          x: (d) => `: ${d}`,
          fill: (d) => `: ${d}`,
          ConstellationNumber: false
        }
      },
      sort: {x: "ConstellationNumber"}
    }),
  ]
})
)}

function _histogramData(){return(
[]
)}

function _9(histogramData,data,constellations)
{
  histogramData.length = 0;
  data.forEach ( x => {
    let constellation = constellations[x.Constellation];
    let printRow = {
      ConstellationNumber: x.Constellation,
      Constellation: constellation,
      Gender: x.Gender,
    };
    histogramData.push(printRow);
  });
  return histogramData;
}


function _10(Plot,plot2,constellations,histogramData){return(
Plot.plot({
  marginTop: plot2.mt,
  marginRight: plot2.mr,
  marginBottom: plot2.mb,
  marginLeft: plot2.ml,

  color: {legend: true , scheme : "Category10"},
  x: {grid: true, label: "Constellation →", ticks: 10, tickFormat: (d) => constellations[d]},
  y: {grid: true, label: "Count"},
  marks: [
    Plot.rectY(histogramData,
      Plot.binX(
        {y: "Count"},
        {
          x: "ConstellationNumber",
          fill: "Gender",
          title: (data) => `Constellation: ${data.Constellation}\nGender: ${data.Gender}`,
          interval: 1,
          tip: true,
        },
      ),
    ),    
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("constellations")).define("constellations", _constellations);
  main.variable(observer("barChartData")).define("barChartData", _barChartData);
  main.variable(observer()).define(["barChartData","data","constellations"], _5);
  main.variable(observer("viewof plot2")).define("viewof plot2", ["Inputs"], _plot2);
  main.variable(observer("plot2")).define("plot2", ["Generators", "viewof plot2"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot2","barChartData"], _7);
  main.variable(observer("histogramData")).define("histogramData", _histogramData);
  main.variable(observer()).define(["histogramData","data","constellations"], _9);
  main.variable(observer()).define(["Plot","plot2","constellations","histogramData"], _10);
  return main;
}
