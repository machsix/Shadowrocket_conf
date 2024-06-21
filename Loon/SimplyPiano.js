
function replaceFalseWithTrue(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        replaceFalseWithTrue(obj[key]);
      } else if (obj[key] === false) {
        obj[key] = true;
      }
    }
  }
}

function findMembershipInfoAndPath(obj, param = "membershipInfo") {
  // Initialize an empty array to hold the path
  const path = [];

  // Define a recursive function to search the object
  function search(target, currentPath) {
    // Ensure the target is an object and not null
    if (typeof target === "object" && target !== null) {
      // Iterate over each key in the current object
      for (let key in target) {
        // Check if the current key is "membershipInfo"
        if (key === param) {
          // If found, return the path and the value of "membershipInfo"
          return {
            path: [...currentPath, key],
            value: target[key],
          };
        }

        // Recursively search the value of the current key
        const result = search(target[key], [...currentPath, key]);

        // If the result is found, return it
        if (result) {
          return result;
        }
      }
    }

    // Return null if "membershipInfo" is not found at this level
    return null;
  }

  // Start the search from the root object with an empty path
  return search(obj, path);
}

function replaceValues(original, replacements) {
  for (let key in original) {
    if (replacements.hasOwnProperty(key)) {
      original[key] = replacements[key]; // Replace value if key exists in replacements
    }
  }
}

function getDaysThisYear() {
  // Get the current date
  const today = new Date();
  const year = today.getFullYear();

  // Get the first date of the current year (January 1st)
  const firstDayOfYear = new Date(year, 0, 1); // Month is 0-based, so 0 represents January

  // Calculate the difference in milliseconds
  const diffInMilliseconds = today - firstDayOfYear;

  // Convert the difference from milliseconds to days
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Hours * Minutes * Seconds * Milliseconds
  const daysPassed = Math.floor(diffInMilliseconds / millisecondsPerDay);
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // Get the total number of days in the current year
  const totalDaysInYear = isLeapYear ? 366 : 365;

  // Calculate the remaining days in the year
  const remainingDays = totalDaysInYear - daysPassed;

  return { daysPassed, remainingDays };
}

function setPremiumTrue(obj) {
  // Iterate over each key in the object
  for (let key in obj) {
    // Check if the current key is "isPremium" or "isFamily"
    if (key === "isPremium" || key === "isFamily") {
      // Replace the value with true
      obj[key] = true;
    }
    // If the current value is an object, recursively call replaceValues
    else if (typeof obj[key] === "object" && obj[key] !== null) {
      setPremiumTrue(obj[key]);
    }
  }
}

var body = JSON.parse($response.body);

var membershipInfo = findMembershipInfoAndPath(body);

if (membershipInfo) {
  const today = new Date();
  const year = today.getFullYear();
  const tmp = getDaysThisYear();
  const daysPassed = tmp.daysPassed;
  const daysRemainingThisYear = tmp.remainingDays + 1;
  const premium_membership = {
    membershipType: "JOYTUNESBUNDLE",
    profilesAccess: "FAMILY",
    dateStarted: `${year}-01-01`,
    daysPassed: daysPassed,
    daysRemaining: daysRemainingThisYear,
    autoRenewable: 1,
    isTrialPeriod: 0,
    planDuration: "oneyear",
    currentIapID:
      "com.joytunes.asla.oneyearpremiummembership_trial_180_mpma_fp_5profiles_bundle",
    upgradeIapID: null,
    membershipDescription: "Premium",
    familyIapID:
      "com.joytunes.asla.oneyearpremiummembership_trial_180_mpma_fp_5profiles_bundle_family",
    membershipTier: "premium_home",
  };
  replaceValues(membershipInfo.value, premium_membership);
}

setPremiumTrue(body);

$done({ 'body': JSON.stringify(body) });
