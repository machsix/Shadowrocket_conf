let body = $response.body;
let obj = JSON.parse(body);
const url = $request.url;
if (url.includes("ios_validate_receipt")) {
  obj = {
    'products': [{
      'product_id': "com.adguard.lifetimePurchase",
      'premium_status': "ACTIVE"
    }]
  };
} else {
  obj.status = "PREMIUM";
  obj.countryCode = "US";
  obj.lifetime = "True";
}
body = JSON.stringify(obj);
$done({
  'body': body
});