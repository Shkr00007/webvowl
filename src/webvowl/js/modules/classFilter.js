var elementTools = require("../util/elementTools")();
var filterTools = require("../util/filterTools")();

module.exports = function (){
  var filter = {},
    nodes,
    properties,
    enabled = false,
    filteredNodes,
    filteredProperties;

  filter.filter = function ( untouchedNodes, untouchedProperties ){
    nodes = untouchedNodes;
    properties = untouchedProperties;

    if ( this.enabled() ) {
      removeClasses();
    }

    filteredNodes = nodes;
    filteredProperties = properties;
  };

  function removeClasses(){
    var filteredData = filterTools.filterNodesAndTidy(nodes, properties, isNoClassNode);
    nodes = filteredData.nodes;
    properties = filteredData.properties;
  }

  function isNoClassNode( node ){
    return elementTools.isDatatype(node);
  }

  filter.enabled = function ( p ){
    if ( !arguments.length ) return enabled;
    enabled = p;
    return filter;
  };

  filter.filteredNodes = function (){
    return filteredNodes;
  };

  filter.filteredProperties = function (){
    return filteredProperties;
  };

  return filter;
};
