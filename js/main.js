document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://cloud.umami.is/script.js";
    script.setAttribute("data-website-id", "ce625abf-956a-4572-9c80-f5e651eb789d");
    document.head.appendChild(script);
  })();

  const i18nextScript = document.createElement("script");
  i18nextScript.src = "https://cdn.jsdelivr.net/npm/i18next/dist/umd/i18next.min.js";

  i18nextScript.onload = function () {
    const i18nScript = document.createElement("script");
    i18nScript.src = "js/i18n.js";
    i18nScript.onload = function () {
      startTitleAnimation();
    };

    document.head.appendChild(i18nScript);
  };

  document.head.appendChild(i18nextScript);

  function startTitleAnimation() {
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
  }
});
