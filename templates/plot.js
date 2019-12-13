function buildDemos(sample) {
  
  var demographics = d3.select("#sample-demos");
  var url = "data/samples.json/metadata/" + sample;
  d3.json(url).then(function(data) {
    console.log(data);
    $("#sample-demos").empty();
    Object.entries(data).forEach(([key, value]) => demographics.append("p").text(`${key}: ${value}`));
  });
}

function buildplots(sample) {
  var url3 = "data/samples.json/samples/" + sample;
  d3.json(url3).then(function(response) {
    console.log(response);
    var filtered_values = [];
    var filtered_otu_ids = [];
    var filtered_otu_labels = [];
    var len = response.sample_values.length;
    var indices = new Array(len);
    for (var i = 0; i < len; i++) {
      indices[i] = i;
      indices.sort(function (a, b) { return response.sample_values[a] < response.sample_values[b] ? 1 : response.sample_values[a] > response.sample_values[b] ? -1 : 0; });
    }    
    for (var i =0; i<10; i++){
      var j = indices[i];
      filtered_values.push(response.sample_values[j]);
      filtered_otu_ids.push(response.otu_ids[j]);
      filtered_otu_labels.push(response.otu_labels[j]);
    }
  
    var trace1 = [{
      type: "bar",
      x: filtered_values,
      y: filtered_otu_ids.map(String),
      text: filtered_otu_labels,
      orientation: 'h'
    }];
    console.log(trace1);
    var BAR = document.getElementById('bar');
    Plotly.newPlot(BAR, trace1);

    var trace2 = [{
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color:response.otu_ids,
        size: response.sample_values
      }
    }];
    var layout2 = {
      title: 'Bubble chart for each sample',
      showlegend: false,
      height: 600,
      width: 1400
    };
    console.log(trace2);
    Plotly.newPlot('bubble', trace2, layout2);
  });
}

function init() {
  
  var dropdown = d3.select("#Dropselect");
  
  var url2 = "data/samples.json/names"
  d3.json(url2).then((Names) => {
    Names.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    const firstSample = sampleNames[0];
    buildplots(firstSample);
    buildDemos(firstSample);
  });
}

function optionChanged(newSample) {
  
  buildplots(newSample);
  buildDemos(newSample);
}

$('select').on('change', function() {
  var Sample = d3.select("#Dropselect").property('value');
  console.log( Sample );
  optionChanged(Sample);
});


init();

