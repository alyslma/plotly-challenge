// Define variable demoInfo
var demoInfo = d3.select("#sample-metadata");

// Function to initialize page upon load
function init() {
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        // Prepare dropdown menu items
        var dropdownIds = data.names;
        for (var i = 0; i < dropdownIds.length; i++){
            d3.select("#selDataset")
                .append("option").text(dropdownIds[i]);
        }

        // Populate demographic info box with first ID
        var id = dropdownIds[0];
        console.log(id);
        var idSubjectData = data.metadata.filter(d => d.id.toString() === id)[0];

        Object.entries(idSubjectData).forEach((info) => {
            demoInfo.append("p").text(`${info[0].toUpperCase()}: ${info[1]}`);
        });

        // Build bar graph with first ID
        var otuData = data.samples.filter(d => d.id === id)[0];
        var sampleValuesAll = otuData.sample_values;
        var sampleValues = sampleValuesAll.slice(0, 10).reverse();
        var otuIdsAll = otuData.otu_ids;
        var otuIds = otuIdsAll.slice(0, 10).reverse().map(otu => "OTU "+otu);
        var otuLabelsAll = otuData.otu_labels;
        var otuLabels = otuLabelsAll.slice(0, 10).reverse();

        var data = [{
            type: 'bar',
            x: sampleValues,
            y: otuIds,
            text: otuLabels,
            orientation: 'h'
        }];

        var layout = {
            title: "Top OTUs Found in Test Subject",
            margin: {
                t: 50,
                b: 20
            }
        }
            
        Plotly.newPlot('bar', data, layout);
        
        // Build bubble chart with first ID
        var bubbleData = [{
            x: otuIdsAll,
            y: sampleValuesAll,
            text: otuLabelsAll,
            mode: 'markers',
            
            marker: {
                color: otuIdsAll,
                size: sampleValuesAll,
                colorscale: 'Portland',
            }
        }];

        var layout = {
            title: 'Present OTUs Sized by Prevalence',
            xaxis: {
                title: { text: "OTU ID"}
            },
            showlegend: false,
            height: 600,
            width: 1100
        };

        Plotly.newPlot('bubble', bubbleData, layout);

        // Build gauge chart with first ID
        var wfreq = idSubjectData.wfreq;

        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                dtick: "tick0",
                axis: { range: [0, 9] },
                bar: { color: "#0E1A14" },
                borderwidth: 1,
                bordercolor: "#070D0A",
                steps: [
                    { range: [0, 1], color: "#F6FAEF" },
                    { range: [1, 2], color: "#E5F0D0" },
                    { range: [2, 3], color: "#D4E7B1" },
                    { range: [3, 4], color: "#C3DD92" },
                    { range: [4, 5], color: "#B2D373" },
                    { range: [5, 6], color: "#A0C954" },
                    { range: [6, 7], color: "#98C445" },
                    { range: [7, 8], color: "#8DBA3B" },
                    { range: [8, 9], color: "#82AB36" }
                ],
            },
        }];

        var layout = {
            height: 500,
            width: 500,
        };

        Plotly.newPlot('gauge', data, layout);
    });
}

// Upon subject change, modify demographic info and graphs
function optionChanged(id) {
    d3.json("data/samples.json").then(function(data) {
        // Find data for new id
        var idSubjectData = data.metadata.filter(d => d.id.toString() === id)[0];
        console.log(idSubjectData);

        // Clear out previous data
        demoInfo.html("");

        // Add new data with <p>
        Object.entries(idSubjectData).forEach((info) => {
            demoInfo.append("p").text(`${info[0].toUpperCase()}: ${info[1]}`);
        });

        // Horizontal bar of top 10 OTUs found in that individual
        otuData = data.samples.filter(d => d.id === id)[0];
        sampleValuesAll = otuData.sample_values;
        sampleValues = sampleValuesAll.slice(0, 10).reverse(); // reverse for bar chart
        otuIdsAll = otuData.otu_ids;
        otuIds = otuIdsAll.slice(0, 10).reverse().map(otu => "OTU "+otu);
        otuLabelsAll = otuData.otu_labels;
        otuLabels = otuLabelsAll.slice(0, 10).reverse();
    
        // Restyle bar chart with new values
        Plotly.restyle('bar', 'x', [sampleValues]);
        Plotly.restyle('bar', 'y', [otuIds]);
        Plotly.restyle('bar', 'text', [otuLabels]);
        
        // Restyle bubble chart with new values
        Plotly.restyle('bubble', 'x', [otuIdsAll]);
        Plotly.restyle('bubble', 'y', [sampleValuesAll]);
        Plotly.restyle('bubble', 'text', [otuLabelsAll]);
        Plotly.restyle('bubble', 'marker', [{color: otuIdsAll, size: sampleValuesAll}]);

        // Restyle gauge with new values
        wfreq = idSubjectData.wfreq;
        Plotly.restyle('gauge', 'value', wfreq);
    });
}

// Initialize page
init();