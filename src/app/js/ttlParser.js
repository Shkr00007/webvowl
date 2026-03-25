module.exports = function (){
  function shortLabel( iri ){
    if ( !iri ) return undefined;
    var hashIndex = iri.lastIndexOf("#");
    if ( hashIndex >= 0 && hashIndex < iri.length - 1 ) {
      return iri.substring(hashIndex + 1);
    }
    var slashIndex = iri.lastIndexOf("/");
    if ( slashIndex >= 0 && slashIndex < iri.length - 1 ) {
      return iri.substring(slashIndex + 1);
    }
    return iri;
  }

  function getBaseIri( iri ){
    if ( !iri ) return undefined;
    var hashIndex = iri.lastIndexOf("#");
    if ( hashIndex >= 0 ) return iri.substring(0, hashIndex + 1);
    var slashIndex = iri.lastIndexOf("/");
    if ( slashIndex >= 0 ) return iri.substring(0, slashIndex + 1);
    return iri;
  }

  function ensureClass( classMap, iri, type ){
    if ( !iri || classMap[iri] ) return;
    classMap[iri] = {
      id: iri,
      type: type || "owl:Class"
    };
  }

  function ensureProperty( propertyMap, iri, type ){
    if ( !iri ) return;
    if ( !propertyMap[iri] ) {
      propertyMap[iri] = {
        id: iri,
        type: type || "owl:ObjectProperty",
        domain: undefined,
        range: undefined
      };
    } else if ( type ) {
      propertyMap[iri].type = type;
    }
  }

  function convertPrefixedToIri( value, prefixMap ){
    if ( value === "a" ) {
      return "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    }
    if ( value.indexOf("<") === 0 && value.lastIndexOf(">") === value.length - 1 ) {
      return value.slice(1, -1);
    }
    var index = value.indexOf(":");
    if ( index > 0 ) {
      var prefix = value.slice(0, index);
      var local = value.slice(index + 1);
      if ( prefixMap[prefix] ) {
        return prefixMap[prefix] + local;
      }
    }
    return value;
  }

  function tokenizeTripleLine( line ){
    var literalMatch = line.match(/^(\S+)\s+(\S+)\s+\"(.+)\"\s*\.$/);
    if ( literalMatch ) {
      return [literalMatch[1], literalMatch[2], "\"" + literalMatch[3] + "\""];
    }
    var iriMatch = line.match(/^(\S+)\s+(\S+)\s+(\S+)\s*\.$/);
    if ( iriMatch ) {
      return [iriMatch[1], iriMatch[2], iriMatch[3]];
    }
    return null;
  }

  function convertTurtleToVowl( turtleText, filename ){
    return new Promise(function ( resolve, reject ){
      var classMap = {};
      var propertyMap = {};
      var prefixMap = {};
      var labelMap = {};

      var RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
      var RDFS_CLASS = "http://www.w3.org/2000/01/rdf-schema#Class";
      var OWL_CLASS = "http://www.w3.org/2002/07/owl#Class";
      var OWL_OBJECT_PROPERTY = "http://www.w3.org/2002/07/owl#ObjectProperty";
      var OWL_DATATYPE_PROPERTY = "http://www.w3.org/2002/07/owl#DatatypeProperty";
      var RDF_PROPERTY = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property";
      var RDFS_DOMAIN = "http://www.w3.org/2000/01/rdf-schema#domain";
      var RDFS_RANGE = "http://www.w3.org/2000/01/rdf-schema#range";
      var RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label";

      var lines = turtleText.split(/\r?\n/);
      for ( var i = 0; i < lines.length; i++ ) {
        var line = lines[i].trim();
        if ( line.length === 0 || line.indexOf("#") === 0 ) {
          continue;
        }

        var prefixMatch = line.match(/^@prefix\s+([a-zA-Z0-9_-]*):\s*<([^>]+)>\s*\.$/);
        if ( prefixMatch ) {
          prefixMap[prefixMatch[1]] = prefixMatch[2];
          continue;
        }

        var triple = tokenizeTripleLine(line);
        if ( !triple ) {
          continue;
        }

        var subject = convertPrefixedToIri(triple[0], prefixMap);
        var predicate = convertPrefixedToIri(triple[1], prefixMap);
        var rawObject = triple[2];
        var isLiteral = rawObject[0] === "\"";
        var objectValue = isLiteral ? rawObject.slice(1, -1) : convertPrefixedToIri(rawObject, prefixMap);

        if ( predicate === RDFS_LABEL && subject && isLiteral ) {
          labelMap[subject] = objectValue;
          continue;
        }

        if ( predicate === RDF_TYPE && subject && !isLiteral ) {
          if ( objectValue === OWL_CLASS || objectValue === RDFS_CLASS ) {
            ensureClass(classMap, subject, "owl:Class");
            continue;
          }
          if ( objectValue === OWL_OBJECT_PROPERTY ) {
            ensureProperty(propertyMap, subject, "owl:ObjectProperty");
            continue;
          }
          if ( objectValue === OWL_DATATYPE_PROPERTY ) {
            ensureProperty(propertyMap, subject, "owl:DatatypeProperty");
            continue;
          }
          if ( objectValue === RDF_PROPERTY ) {
            ensureProperty(propertyMap, subject, "owl:ObjectProperty");
            continue;
          }
        }

        if ( predicate === RDFS_DOMAIN && subject && !isLiteral ) {
          ensureProperty(propertyMap, subject);
          ensureClass(classMap, objectValue, "owl:Class");
          propertyMap[subject].domain = objectValue;
          continue;
        }

        if ( predicate === RDFS_RANGE && subject && !isLiteral ) {
          ensureProperty(propertyMap, subject);
          ensureClass(classMap, objectValue, "owl:Class");
          propertyMap[subject].range = objectValue;
          continue;
        }

        if ( subject && predicate ) {
          ensureClass(classMap, subject, "owl:Class");
          ensureProperty(propertyMap, predicate);
          propertyMap[predicate].domain = propertyMap[predicate].domain || subject;

          if ( isLiteral ) {
            propertyMap[predicate].type = "owl:DatatypeProperty";
            var literalNodeId = "http://www.w3.org/2000/01/rdf-schema#Literal";
            ensureClass(classMap, literalNodeId, "rdfs:Literal");
            propertyMap[predicate].range = propertyMap[predicate].range || literalNodeId;
          } else {
            ensureClass(classMap, objectValue, "owl:Class");
            propertyMap[predicate].range = propertyMap[predicate].range || objectValue;
          }
        }
      }

      var classList = Object.keys(classMap).map(function ( iri ){
        return classMap[iri];
      });

      if ( classList.length === 0 ) {
        reject(new Error("No classes could be parsed from turtle content"));
        return;
      }

      var classAttributes = classList.map(function ( classObj ){
        var iri = classObj.id;
        var label = labelMap[iri] || shortLabel(iri);
        return {
          id: iri,
          iri: iri,
          baseIri: getBaseIri(iri),
          label: { en: label }
        };
      });

      var propertyList = Object.keys(propertyMap)
        .map(function ( iri ){
          return propertyMap[iri];
        })
        .filter(function ( prop ){
          return prop.domain && prop.range;
        });

      var propertyAttributes = propertyList.map(function ( prop ){
        var label = labelMap[prop.id] || shortLabel(prop.id);
        return {
          id: prop.id,
          iri: prop.id,
          baseIri: getBaseIri(prop.id),
          label: { en: label }
        };
      });

      resolve({
        _comment: "Generated from Turtle in browser",
        header: {
          languages: ["en"],
          title: { en: filename || "Imported Turtle Ontology" },
          iri: "",
          description: { en: "Converted from Turtle directly in browser." },
          prefixList: prefixMap
        },
        namespace: [],
        class: classList,
        classAttribute: classAttributes,
        property: propertyList.map(function ( prop ){
          return {
            id: prop.id,
            type: prop.type || "owl:ObjectProperty",
            domain: prop.domain,
            range: prop.range
          };
        }),
        propertyAttribute: propertyAttributes,
        metrics: {
          classCount: classList.length,
          datatypeCount: 0,
          objectPropertyCount: propertyList.filter(function ( p ){ return p.type !== "owl:DatatypeProperty"; }).length,
          datatypePropertyCount: propertyList.filter(function ( p ){ return p.type === "owl:DatatypeProperty"; }).length,
          propertyCount: propertyList.length,
          nodeCount: classList.length,
          individualCount: 0
        }
      });
    });
  }

  return {
    convertTurtleToVowl: convertTurtleToVowl
  };
};
