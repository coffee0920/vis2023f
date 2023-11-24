function _1(md){return(
md`# HW04 Strong baseline`
)}

function _artist(FileAttachment){return(
FileAttachment("artist-1.csv").csv()
)}

function _3(__query,artist,invalidation){return(
__query(artist,{from:{table:"artist"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation,"artist")
)}

function _innerCircleQuestion(artist){return(
Object.keys(artist[0])[1]
)}

function _outerCircleQuestion(artist){return(
Object.keys(artist[0])[15]
)}

function _data(artist,innerCircleQuestion,outerCircleQuestion,buildHierarchy)
{
  // 提取內外圈問題的答案
  var innerCircleAnswer = artist.map(row => row[innerCircleQuestion]);
  var outerCircleAnswer = artist.map(row => row[outerCircleQuestion]);

  // 將內外圈答案結合，形成新的答案陣列
  var combinedAnswers = innerCircleAnswer.map((innerAns, index) => innerAns + '-' + outerCircleAnswer[index]);

  // 重新格式化答案，將其轉換為符合特定模式的陣列
  var reformattedAnswers = combinedAnswers.map(item => {
    const [prefix, values] = item.split('-');
    const splitValues = values.split(';').map(value => value.trim());
    return splitValues.map(value => `${prefix}-${value}`);
  }).reduce((acc, curr) => acc.concat(curr), []);

  // 計算每個重新格式化答案的出現次數
  var answerCounts = {};
  reformattedAnswers.forEach(reformattedAns => {
    answerCounts[reformattedAns] = (answerCounts[reformattedAns] || 0) + 1;
  });

  // 轉換為CSV格式的數據
  var csvData = Object.entries(answerCounts).map(([answer, count]) => [answer, String(count)]);
  
  // 建立包含層次結構的數據
  return buildHierarchy(csvData);
}


function _breadcrumb(d3,breadcrumbWidth,breadcrumbHeight,sunburst,breadcrumbPoints,color)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${breadcrumbWidth * 10} ${breadcrumbHeight}`)
    .style("font", "12px sans-serif")
    .style("margin", "5px");

  const g = svg
    .selectAll("g")
    .data(sunburst.sequence)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

    g.append("polygon")
      .attr("points", breadcrumbPoints)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "white");

    g.append("text")
      .attr("x", (breadcrumbWidth + 10) / 2)
      .attr("y", 15)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => {
        if(d.data.name === "有，以行動或計畫進行") {
          return "有";
        }
        else if(d.data.name === "有，制定藝術永續推動章程") {
          return "有";
        }
        else if(d.data.name === "有，設置專門的永續部門處理") {
          return "有";
        }
        else if(d.data.name.length > 6)
        {
          return "其他答案";
        }
        return d.data.name;
      });

  svg
    .append("text")
    .text(sunburst.percentage > 0 ? sunburst.percentage + "%" : "")
    .attr("x", (sunburst.sequence.length + 0.5) * breadcrumbWidth)
    .attr("y", breadcrumbHeight / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle");

  return svg.node();
}


function _sunburst(partition,data,d3,radius,innerCircleQuestion,outerCircleQuestion,width,color,arc,mousearc)
{
  const root = partition(data);
  const svg = d3.create("svg");
  // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
  const element = svg.node();
  element.value = { sequence: [], percentage: 0.0 };

  // 使用foreignObject插入HTML
  const fo = svg
    .append("foreignObject")
    .attr("x", `${radius+50}px`)
    .attr("y", -10)
    .attr("width", radius*2)
    .attr("height", 350);
  
  const div = fo
    .append("xhtml:div")
    .style("color","#555")
    .style("font-size", "25px")
    .style("font-family", "Arial");

  d3.selectAll("div.tooltip").remove(); // clear tooltips from before
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", `tooltip`)
    .style("position", "absolute")
    .style("opacity", 0)

  const label = svg
    .append("text")
    .attr("text-anchor", "middle");
    //.style("visibility", "hidden");

  label//內圈問題
    .append("tspan")
    .attr("class", "question1")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-6em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(innerCircleQuestion);

  label//外圈問題
    .append("tspan")
    .attr("class", "question2")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-4em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(outerCircleQuestion);

  label//答案
    .append("tspan")
    .attr("class", "sequence")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-1em")
    .attr("font-size", "2.5em")
    .text("");

  label//占比%數
    .append("tspan")
    .attr("class", "percentage")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "0em")
    .attr("font-size", "5em")
    .attr("fill", "#555")
    .text("");

  label//數量
    .append("tspan")
    .attr("class", "dataValue")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "2em")
    .attr("font-size", "2em")
    .attr("fill", "#555")
    .text("");

  svg
    .attr("viewBox", `${-radius} ${-radius} ${width*2.2} ${width}`)
    .style("max-width", `${width*2}px`)
    .style("font", "12px sans-serif");

  const path = svg
    .append("g")
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseleave", () => {
      path.attr("fill-opacity", 1);
      //tooltip.text("");
      //label.style("visibility", null);
      // Update the value of this view
      element.value = { sequence: [], percentage: 0.0 };
      element.dispatchEvent(new CustomEvent("input"));
    })
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("d", mousearc)
    .on("mouseover", (_evt, d) => {
      if(d.data.name === "有，以行動或計畫進行") {
        tooltip
        .style("opacity", 1)
        .html(`有，以行動或計畫進行<br><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- 綠色空心圈圈 -->
  <circle cx="50" cy="50" r="40" fill="none" stroke="#2ecc71" stroke-width="8" />
</svg>
`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "沒有") {
        tooltip
        .style("opacity", 1)
        .html(`沒有<br><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- 紅色叉叉 -->
  <line x1="10" y1="10" x2="90" y2="90" stroke="#e74c3c" stroke-width="8" />
  <line x1="90" y1="10" x2="10" y2="90" stroke="#e74c3c" stroke-width="8" />
</svg>
`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "有，制定藝術永續推動章程") {
        tooltip
        .style("opacity", 1)
        .html(`有，制定藝術永續推動章程<br><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- 綠色空心圈圈 -->
  <circle cx="50" cy="50" r="40" fill="none" stroke="#2ecc71" stroke-width="8" />
</svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "有，設置專門的永續部門處理") {
        tooltip
        .style("opacity", 1)
        .html(`有，設置專門的永續部門處理<br><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- 綠色空心圈圈 -->
  <circle cx="50" cy="50" r="40" fill="none" stroke="#2ecc71" stroke-width="8" />
</svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "不清楚") {
        tooltip
        .style("opacity", 1)
        .html(`不清楚<br><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- 橘色空心三角形 -->
  <polygon points="50,10 90,90 10,90" fill="none" stroke="#e67e22" stroke-width="8" />
</svg>`)
        .style("border-color", color(d.data.name));
      }
      else
      {
        tooltip
        .style("opacity", 1)
        .html(`${d.data.name}`)
        .style("border-color", color(d.data.name));
      }
    })
    .on("mousemove", (evt, d) => {
      tooltip
        .style("top", evt.pageY - 10 + "px")
        .style("left", evt.pageX + 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    })
    .on("mouseenter", (event, d) => {
      // Get the ancestors of the current segment, minus the root

      //introduce
      if(d.data.name === "工作室")
      {
        div
          .html("<ul><li>定義：藝術家創作藝術品的私人空間。它可以是一個房間、一棟建築或任何專為藝術製作而設的場所。</li><li>功能：用於藝術家進行創作，例如繪畫、雕塑或任何其他形式的藝術。</li><li>特色：它是一個私密的空間，藝術家可以在這裡自由地實驗、嘗試並發展他們的技巧和創意。</li></ul>");
      }
      else if(d.data.name === "替代空間")
      {
        div
          .html("<ul><li>定義：非傳統和非商業的展示空間。可以是臨時或長期的存在，但不同於傳統的美術館和畫廊。</li><li>功能：提供一個展示非主流、實驗性或邊緣藝術的場所。這些空間通常更加開放、靈活，能夠接受更多風格和形式的藝術品。</li><li>特色：是藝術家、策展人或社群自組、自發的，對於藝術家來說，這樣的空間提供了更多的自由和可能性。</li></ul>");
      }
      else if(d.data.name === "美術館")
      {
        div
          .html("<ul><li>定義：為了展示、保護和研究藝術品而設立的公共或私人機構。</li><li>功能：除了展示藝術品，美術館也負責藝術品的保護、修復、研究和教育等功能。</li><li>特色：通常有較為正式和嚴謹的運作模式。它們可能有長期或特定主題的展覽，且會對藝術品有一定的選擇和評價標準。</li></ul>");
      }
      else
      {
        div.html("");
      }
      
      //dataValue
      label
        .style("visibility", null)
        .select(".dataValue")
        .text("計數："+d.value);
      
      //question
      if(d.depth-1 === 0)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#000");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#BBB");
      }
      else if(d.depth-1 === 1)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#BBB");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#000");
      }
      
      const sequence = d
        .ancestors()
        .reverse()
        .slice(1);
      // Highlight the ancestors
      path.attr("fill-opacity", node =>
        sequence.indexOf(node) >= 0 ? 1.0 : 0.3
      );
      label
        .style("visibility", null)
        .select(".sequence")
        //.style("visibility", "visible")
        .attr("fill", sequence => color(d.data.name))
        .text(d.data.name);
      const percentage = ((100 * d.value) / root.value).toPrecision(3);
      label
        .style("visibility", null)
        .select(".percentage")
        .text(percentage + "%");

      /*tooltip
        .text(d.data.name);*/
      
      // Update the value of this view with the currently hovered sequence and percentage
      element.value = { sequence, percentage };
      element.dispatchEvent(new CustomEvent("input"));
    });     

  return element;
}


function _9(md){return(
md`<h2>結論</h2>
<h3>從上圖中，我們可以看出：
  <ul>
    <li>大部分藝術工作場所都有在推動永續事務</li>
    <li>沒有推動永續事務的工作室較其他場所來的多，如果要輔導可以先從工作室開始著手</li>
    <li>部分校院不清楚永續事務，有的校院甚至沒有推動永續事務，教育部需要注意我們的教育單位在這方面的作為</li>
    <li>這個問題的答案需要被重新再處理後，統計數字才會有意義，否則很多單位都有在推動，因為答案的不一致而沒有計入有的部分，對於計算比例不是很好</li>
  </ul>
</h3>`
)}

function _10(md){return(
md`<h2>參數、函數</h2>`
)}

function _buildHierarchy(){return(
function buildHierarchy(csv) {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = { name: "root", children: [] };
  for (let i = 0; i < csv.length; i++) {
    const sequence = csv[i][0];
    const size = +csv[i][1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    const parts = sequence.split("-");
    let currentNode = root;
    for (let j = 0; j < parts.length; j++) {
      const children = currentNode["children"];
      const nodeName = parts[j];
      let childNode = null;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (let k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, value: size };
        children.push(childNode);
      }
    }
  }
  return root;
}
)}

function _width(){return(
640
)}

function _radius(width){return(
width / 2
)}

function _partition(d3,radius){return(
data =>
  d3.partition().size([2 * Math.PI, radius * radius])(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  )
)}

function _mousearc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(radius)
)}

function _color(d3){return(
d3
  .scaleOrdinal()
  .domain(["沒有", "不清楚", "美術館", "非營利組織/藝術團體", "工作室","有，以行動或計畫進行","替代空間","有，制定藝術永續推動章程","有，設置專門的永續部門處理"])
  //.range(d3.schemePaired)
  .range(["#E60000","#f9a52c","#efdf48","#B399FF","#FF7F50","#8bd346","#9b5fe0","#8bd346","#8bd346"])
  .unknown("#D3D3D3")
)}

function _breadcrumbWidth(){return(
75
)}

function _breadcrumbPoints(breadcrumbWidth,breadcrumbHeight){return(
function breadcrumbPoints(d, i) {
  const tipWidth = 10;
  const points = [];
  points.push("0,0");
  points.push(`${breadcrumbWidth},0`);
  points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
  points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
  points.push(`0,${breadcrumbHeight}`);
  if (i > 0) {
    // Leftmost breadcrumb; don't include 6th vertex.
    points.push(`${tipWidth},${breadcrumbHeight / 2}`);
  }
  return points.join(" ");
}
)}

function _breadcrumbHeight(){return(
30
)}

function _arc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(1 / radius)
  .padRadius(radius)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(d => Math.sqrt(d.y1) - 1)
)}

function _21(htl){return(
htl.html`<style>
.tooltip {
  padding: 8px 12px;
  color: white;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.2);
  pointer-events: none;
  transform: translate(-50%, -100%);
  font-family: "Helvetica", sans-serif;
  background: rgba(20,10,30,0.6);
  transition: 0.2s opacity ease-out, 0.1s border-color ease-out;
}
</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artist-1.csv", {url: new URL("./artist.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artist")).define("artist", ["FileAttachment"], _artist);
  main.variable(observer()).define(["__query","artist","invalidation"], _3);
  main.variable(observer("innerCircleQuestion")).define("innerCircleQuestion", ["artist"], _innerCircleQuestion);
  main.variable(observer("outerCircleQuestion")).define("outerCircleQuestion", ["artist"], _outerCircleQuestion);
  main.variable(observer("data")).define("data", ["artist","innerCircleQuestion","outerCircleQuestion","buildHierarchy"], _data);
  main.variable(observer("breadcrumb")).define("breadcrumb", ["d3","breadcrumbWidth","breadcrumbHeight","sunburst","breadcrumbPoints","color"], _breadcrumb);
  main.variable(observer("viewof sunburst")).define("viewof sunburst", ["partition","data","d3","radius","innerCircleQuestion","outerCircleQuestion","width","color","arc","mousearc"], _sunburst);
  main.variable(observer("sunburst")).define("sunburst", ["Generators", "viewof sunburst"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("buildHierarchy")).define("buildHierarchy", _buildHierarchy);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("partition")).define("partition", ["d3","radius"], _partition);
  main.variable(observer("mousearc")).define("mousearc", ["d3","radius"], _mousearc);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("breadcrumbWidth")).define("breadcrumbWidth", _breadcrumbWidth);
  main.variable(observer("breadcrumbPoints")).define("breadcrumbPoints", ["breadcrumbWidth","breadcrumbHeight"], _breadcrumbPoints);
  main.variable(observer("breadcrumbHeight")).define("breadcrumbHeight", _breadcrumbHeight);
  main.variable(observer("arc")).define("arc", ["d3","radius"], _arc);
  main.variable(observer()).define(["htl"], _21);
  return main;
}
