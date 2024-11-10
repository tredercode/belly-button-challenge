// Build the metadata panel
function buildMetadata(sample) {
  // This line defines a new function named buildMetadata that takes a single parameter called sample. This parameter is expected to be the ID of the sample whose metadata you want to build.
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  // Here, the function makes an asynchronous call to fetch JSON data from the provided URL using D3's json method. The .then((data) => { ... }) part is a promise that executes the callback function once the data is successfully retrieved. The retrieved data is passed as the argument data.

    // get the metadata field
    metadata = data.metadata;
    
    // This line extracts the metadata property from the retrieved data. The metadata variable now holds the array of metadata objects.

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(meta => meta.id == sample)[0];
    // console.log(typeof meta.id);
    // console.log(typeof sample);
    // This line filters the metadata array to find the object where the id matches the sample parameter.

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");
    // This line selects the HTML element with the ID sample-metadata using D3's select method. The selected element is stored in the panel variable.

    // Use `.html("") to clear any existing metadata
    panel.html("");
    // This line clears any existing content inside the panel element by setting its HTML to an empty string.

    // Inside a loop, you will need to use d3 to append new tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
    // This line converts the result object into an array of key-value pairs using Object.entries(). The forEach method iterates over each key-value pair, where key represents the metadata property name and value represents its corresponding value.
    panel.append("h6").text(`${key}: ${value}`);
    //   Inside the loop, this line appends a new <h6> element to the panel for each key-value pair. The text method sets the text content of the <h6> element to display the key and its value in the format key: value.
    });
    
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    const bubbleData = [bubbleTrace];

    const bubbleLayout = {
      title: 'Bubble Chart of OTUs',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' },
      showlegend: false,
      height: 600,
      width: 1200
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    const barData = [barTrace];

    const barLayout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' },
      height: 400,
      width: 600
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
