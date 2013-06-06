var seq = window.seq;
var seq2 = seq.toLowerCase();

var features = [];
features.push({
  startBase: 15,
  endBase: 200,
  type: 'note',
  id: 2
});
features.push({
  startBase: 10,
  endBase: 20,
  type: 'note',
  id: 1
});

var getFeatures = function(baseFrom, baseTo) {
  var output = [];
  _.each(features, function(v,i) {
    if(v.startBase <= baseTo && v.endBase >= baseFrom)  
      output.push(v);
  });
  return output;
}

var seq_array = seq.match(/.{1,10}/g);
var seq2_array = seq2.match(/.{1,10}/g);

var dna = $('<div id="container-dna"></div>');
var extras = $('<div id="container-extras"></div>');
$('#container').append(extras).append(dna);
// $('#container').append(dna).append(extras);

var featureStack = [-1];

_.each(seq_array, function(v,i) {
  var tag1, tag2;
  var range = [i*10, (i+1)*10-1]
  var features = getFeatures(range[0], range[1]);
  v = _.map(v, function(w, j){
    return "<i data-aa='"+w+"' data-base='"+(range[0]+j)+"'>"+w+"</i>";
  }).join('');
  tag1 = $('<div></div>').html(v).addClass('dna');

  v = _.map(seq2_array[i], function(w,j) {
    return "<i data-aa='"+w+"' data-base='"+(i*10+j)+"'>"+w+"</i>";
  })
  tag2 = $('<div></div>').html(v).addClass('extra'); 

  if(features.length > 0) {
    console.log(_.map(featureStack, function(w,j) { if(w != -1) return j; }));
    var maxStackIndex = 0;
    _.each(featureStack, function(w,j) { if(w != -1 && j > maxStackIndex) maxStackIndex = j; });
    console.log(featureStack, maxStackIndex);
    tag1.addClass('offsetTop-'+(maxStackIndex == -1 ? features.length : maxStackIndex+1));
    _.each(features, function(w,j) {
      var indexInStack = featureStack.indexOf(w.id);
      var feature_tag = $('<span></span>')
      if(indexInStack > -1 && indexInStack > features.length-1)
        feature_tag.addClass('feature-stack-pos-'+indexInStack);
      else if(indexInStack == -1) {
        var newPos;
        _.each(featureStack, function(x,k) {
          if(x == -1) {
            newPos = k;
            featureStack[k] = w.id;
          }
        });
        if(newPos === undefined) {
          featureStack.push(w.id);
          indexInStack = featureStack.length-1;
        }
      }
      feature_tag.addClass('feature feature-col-'+(indexInStack+1));
      if(w.startBase >= range[0]) 
        feature_tag.text(w.type);
      if(w.startBase > range[0]) 
        feature_tag.addClass('feature-offset-'+(w.startBase-range[0]))
      if(w.endBase > range[1])
        feature_tag.addClass('feature-continuing');
      if(w.endBase <= range[1]) 
        featureStack[indexInStack] = -1;
      feature_tag.addClass('feature-length-'+((w.startBase >= range[0] ) ? Math.min(w.endBase - w.startBase + 1, 10) : Math.min(w.endBase - range[0] + 1, 10)));

      tag2.prepend($('<br/>')).prepend(feature_tag);
    });
  }

  tag2.prepend($('<div></div>').addClass('grid-position').text(i*10+1));
  dna.append(tag1);
  extras.append(tag2);
});

$('#container-dna').on('mouseup', function() {
  if(window.getSelection())
    console.log(window.getSelection());

});



