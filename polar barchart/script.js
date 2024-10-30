// URLs of the 17 SDG goals
const urls = [
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_6eTuiDt7w41730300611600.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_wwfEscscuF1730300612925.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_5LYSpPMXqm1730300614135.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_H3KwnjTh4F1730300615237.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_G6K9mCBfsG1730300616338.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_QVbU3nvQUP1730300617606.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_rbjuM5192u1730300618880.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_dJvv2wgJUz1730300619911.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_cVvw0Zmim91730300620934.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_onC2lrH4Vu1730300622049.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_L7Hw8EZuYi1730300623309.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_rDgruN9F6P1730300624485.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_GGi7tPItpI1730300625552.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_2sM7kJxsFj1730300626590.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_U8nHr06ZJy1730300627901.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_uMjGbyZsLh1730300629136.json",
    "https://megatron.headai.com/analysis/ModifyKnowledgeGraph/ModifyKnowledgeGraph_LHJZdgG6zo1730300630153.json"
];

// Colors and titles
const categories = [
    { color: "#E5243B", fullName: "No poverty" },
    { color: "#DDA63A", fullName: "Zero hunger" },
    { color: "#4C9F38", fullName: "Good health and well-being" },
    { color: "#C5192D", fullName: "Quality education" },
    { color: "#FF3A21", fullName: "Gender equality" },
    { color: "#26BDE2", fullName: "Clean water and sanitation" },
    { color: "#FCC30B", fullName: "Affordable and clean energy" },
    { color: "#A21942", fullName: "Decent work and economic growth" },
    { color: "#FD6925", fullName: "Industry, innovation and infrastructure" },
    { color: "#DD1367", fullName: "Reduced inequalities" },
    { color: "#FD9D24", fullName: "Sustainable cities and communities" },
    { color: "#BF8B2E", fullName: "Responsible consumption and production" },
    { color: "#3F7E44", fullName: "Climate action" },
    { color: "#0A97D9", fullName: "Life below water" },
    { color: "#56C02B", fullName: "Life on land" },
    { color: "#00689D", fullName: "Peace, justice and strong institutions" },
    { color: "#19486A", fullName: "Partnerships for the goals" }
];

// Function to fetch all data and save it in a variable
const fetchAllData = async () => {
    try {
        const dataResponses = await Promise.all(urls.map(async (url) => {
            const response = await fetch(url);
            const jsonData = await response.json();
            return jsonData.data;
        }));

        // Store all data responses in a variable
        const allData = dataResponses;

        return allData;

    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Call the function to fetch data
fetchAllData().then((allData) => {
    // Create arrays to store scores and mathing & missing concepts
    const scores = [];
    const match = [];
    const gap = [];
    allData.forEach((data, index) => {
        // Store scores and mathing & missing concepts
        const score = Math.round(data.scores.full_score_normalized * 100 * 100) / 100;
        scores.push(score);
        match.push(data.scores.important_topics_found)
        gap.push(data.scores.important_topics_missing)

    });

    // Create chart
    const chartDiv = d3.select("body")
    .append("div")
    .attr("id", "chart");

    // Define dimensions
    const width = 600, height = 600;
    const innerRadius = 50;  // Inner radius for the bars (white sphere in the center)
    const outerRadiusScale = d3.scaleLinear().domain([0, 100]).range([100, 250]); // Scale for outer radius based on scores

    // Create SVG
    const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create info box on the right side of the screen
    const infoBox = d3.select("body").append("div")
    .attr("class", "info-box")
    .style("position", "absolute")
    .style("right", "160px")
    .style("top", "140px")
    .style("width", "600px")
    .style("padding", "10px")
    .style("background-color", "#f9f9f9")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("display", "none"); // Hidden by default

    let sdg1LabelRadius; // Initialize variable to store SDG 1 label radius (this will be necessary to prevent overlap)

    // Create bars
    svg.selectAll("bar")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "bar")
    .each(function(d, i) {
        const angle = (360 / categories.length) * i - 90 - (360 / categories.length) / 2; // Shifted to left for mid-axis at -90 degrees (-90 is at 12 o'clock in polar barchart)
        const nextAngle = angle + (360 / categories.length); // Angle for the next bar
        const score = scores[i];
        const outerRadius = outerRadiusScale(score); // Scale the outer radius based on the score

        // Check if this is SDG 1 and save its radius
        if (i === 0) {
            sdg1LabelRadius = outerRadius + 20; // 20 is the offset for the label position
        }

        // Create the path for the bar
        const path = d3.path();
        path.moveTo(innerRadius * Math.cos((angle * Math.PI) / 180), innerRadius * Math.sin((angle * Math.PI) / 180));
        path.lineTo(outerRadius * Math.cos((angle * Math.PI) / 180), outerRadius * Math.sin((angle * Math.PI) / 180));
        path.arc(0, 0, outerRadius, (angle * Math.PI) / 180, (nextAngle * Math.PI) / 180);
        path.lineTo(innerRadius * Math.cos((nextAngle * Math.PI) / 180), innerRadius * Math.sin((nextAngle * Math.PI) / 180));
        path.arc(0, 0, innerRadius, (nextAngle * Math.PI) / 180, (angle * Math.PI) / 180);
        path.closePath();

        // Append the path to the SVG
        svg.append("path")
            .attr("d", path)
            .attr("fill", categories[i].color)
            // Display the tooltip
            .on("mouseover", function(event) {
                d3.select(".tooltip")
                    .style("opacity", 1)
                    .html(`SDG ${i + 1}: ${categories[i].fullName}<br>Score: ${score.toFixed(2)}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 30) + "px");
            })
            // Hide the tooltip
            .on("mouseout", function() {
                d3.select(".tooltip").style("opacity", 0);
            })
            // Display additional information
            .on("click", function() {
                // Create the image element
                const imgElement = `<img src="images/SDG_${i + 1}.png" alt="SDG ${i + 1} logo" style="width: 100px; height: auto; float: left; margin-right: 10px;">`;
                
                // Process the matching and missing topics content
                const matchTopics = match[i].map(topic => topic.replace(/_/g, ' ')).join(", ");
                const gapTopics = gap[i].map(topic => topic.replace(/_/g, ' ')).join(", ");

                // Set the content of the info box
                infoBox.style("display", "block")
                    .html(`${imgElement}
                        <h3>SDG ${i + 1}: ${categories[i].fullName}</h3>
                        <br>
                        <br>
                        <p><strong>Important topics found:</strong><br> ${matchTopics || "None"}</p>
                        <p><strong>Important topics missing:</strong><br> ${gapTopics || "None"}</p>`);
            });

        // Calculate the mid-angle for label placement
        const midAngle = angle + (360 / categories.length) / 2;

        // Position labels at the mid-axis of the bars
        svg.append("text")
            .attr("x", (outerRadius + 20) * Math.cos(midAngle * Math.PI / 180))
            .attr("y", (outerRadius + 20) * Math.sin(midAngle * Math.PI / 180))
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("fill", "#333") 
            .attr("font-size", "10px")
            .text(`SDG ${i + 1}`);
    });

   // Create gridlines on top of bars and add values as text
    const gridlineScale = d3.scaleLinear().domain([0, 100]).range([innerRadius, outerRadiusScale(100)]); // Scale for gridlines

    for (let i = 0; i <= 100; i += 10) {
        const radius = gridlineScale(i);
        svg.append("circle")
            .attr("r", radius)
            .attr("fill", "none")
            .attr("stroke", "lightgray")
            .attr("stroke-width", 0.5)
            .attr("stroke-dasharray", "4,2");

        // Calculate position for the gridline label
        const labelX = radius * Math.cos(-90 * Math.PI / 180);
        const labelY = radius * Math.sin(-90 * Math.PI / 180) - 5; // Slightly above the line

        // Add text labels for the gridline values only if they do not overlap with the SDG 1 label
        if (Math.abs(sdg1LabelRadius - radius) >= 10) { // Adjust the tolerance as needed
            svg.append("text")
                .attr("x", labelX)
                .attr("y", labelY)
                .attr("text-anchor", "middle")
                .attr("fill", "#333")
                .attr("font-size", "10px")
                .text(i);
        }
    }

    // Add the tooltip
    d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // Center white circle
    svg.append("circle")
    .attr("r", innerRadius)
    .attr("fill", "white")
    .attr("stroke", "none");


}).catch((error) => console.error("Error:", error));


