document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://cloud.umami.is/script.js";
    script.setAttribute("data-website-id", "ce625abf-956a-4572-9c80-f5e651eb789d");
    document.head.appendChild(script);
  })();

  var text = document.title;
  var index = 0;

  function transform() {
    if (index <= text.length) {
      document.title = text.substring(0, index);
      index++;
      setTimeout(transform, 200);
    } else {
      index = 0;
      setTimeout(transform, 1000);
    }
  }

  transform();
});
