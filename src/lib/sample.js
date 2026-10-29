export const SAMPLE_CODE = `// Example: order lookup with a few problems to find
var apiKey = "sk_live_8f2b91c4d7e6";

function loadOrder(orderId) {
  var query = "SELECT * FROM orders WHERE id = " + orderId;
  console.log("running", query);

  if (orderId == null) {
    return null;
  }

  fetch("/api/orders?id=" + orderId)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("order").innerHTML = html;
    })
    .catch(() => {});

  return query;
}

// TODO: rate limit this endpoint
function renderReport(source) {
  eval(source);
}
`;
