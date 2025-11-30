document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://cloud.umami.is/script.js";
    script.setAttribute("data-website-id", "ce625abf-956a-4572-9c80-f5e651eb789d");
    document.head.appendChild(script);
  })();

  var titleText = document.querySelector("title").text;
  var repeat = true;
  var index = 0;

  function scrollTitle() {
    if (index <= titleText.length) {
      document.title = titleText.substring(0, index);
      index++;
      setTimeout(scrollTitle, 200);
    } else {
      index = 0;
      if (repeat) setTimeout(scrollTitle, 1000);
    }
  }

  scrollTitle();
});
