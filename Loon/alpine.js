if ($response.status == 304) {
  console.log("304");
  $done({});
}

let body = $response.body;
let obj = JSON.parse(body);
console.log(obj);
let trail = {
    pass_expiration: 2043273600,
    pass_ranges: [{
        auto_renewing: "on",
        end:  2043273600,
        is_trial_period: true,
        start: 1727740800,
        subscription_origin: "apple",
    }]
};

Object.assign(obj, trail);
console.log(obj);
body = JSON.stringify(obj);
$done({
  'body': body
});