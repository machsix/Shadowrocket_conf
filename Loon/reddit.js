const config = {
  debug: $argument.debug,
  quit_experiment: $argument.quit_experiment,
  no_nsfw: $argument.no_nsfw,
};

function cleanArray(obj, walk) {
  if (Array.isArray(obj)) {
    // Step 1: Filter the array based on the conditions
    const filteredArray = obj.filter((element) => {
      // Check if the element is an object
      if (typeof element === "object" && element !== null && element.node) {
        // Condition 1: node has a non-null adPayload (only if adPayload exists)
        if (element.node.hasOwnProperty("adPayload") && element.node.adPayload !== null) {
          if (config.debug) {
            console.log(`Remove ${JSON.stringify(element.node)}`);
          }
          return false; // Remove element
        }

        // Condition 2: node has a 'cells' array, and one of its elements has __typename as 'AdBrandSurveyCell' or 'AdMetadataCell'
        if (Array.isArray(element.node.cells)) {
          const hasAdCell = element.node.cells.some(
            (cell) =>
              cell &&
              (cell.__typename === "AdBrandSurveyCell" ||
                cell.__typename === "AdMetadataCell")
          );
          if (hasAdCell) {
            if (config.debug) {
              console.log(`Remove ${JSON.stringify(element.node)}`);
            }
            return false; // Remove element
          }
        }
      }
      return true; // Keep element
    });

    // Step 2: Run the walk function (cleanObj) on each remaining element
    return filteredArray.map(walk);
  }
  return obj; // If obj is not an array, return it as is
}

function cleanObj(obj) {
  if (typeof obj === "object" && obj !== null) {
    if (config.no_nsfw) {
      // Modify isNsfw, isNsfwMediaBlocked, isNsfwContentShown
      if (obj.hasOwnProperty("isNsfw") && obj.isNsfw === true) {
        obj.isNsfw = false;
      }
      if (obj.hasOwnProperty("isNsfwMediaBlocked") && obj.isNsfwMediaBlocked === true) {
        obj.isNsfwMediaBlocked = false;
      }
      if (obj.hasOwnProperty("isNsfwContentShown") && obj.isNsfwContentShown === false) {
        obj.isNsfwContentShown = true;
      }
    }

    // Modify commentsPageAds if it's an array
    if (Array.isArray(obj.commentsPageAds)) {
      if (config.debug) {
        console.log(`Remove ${JSON.stringify(obj.commentsPageAds)}`);
      }
      obj.commentsPageAds = [];
    }
  }
  return obj;
}

function processObj(obj) {
  if (typeof obj === "object" && obj !== null) {
    // If obj is an array, call cleanArray
    if (Array.isArray(obj)) {
      return cleanArray(obj, cleanObj);
    } else {
      // If obj is an object, apply cleanObj and recurse
      obj = cleanObj(obj);
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = processObj(obj[key]); // Recurse into nested properties
        }
      }
      return obj;
    }
  }
  return obj; // Return primitive values as is
}

function sanitizeObject(res) {
  // Quit any experiments
  if (config.quit_experiment && res.data && res.data.experimentVariants) {
    res.data.experimentVariants = [];
    return res;
  }
  return processObj(res);
}

const body = $response.body;
let obj = JSON.parse(body);
obj = sanitizeObject(obj);
$done({
  body: JSON.stringify(obj),
});