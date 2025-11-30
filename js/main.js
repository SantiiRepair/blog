document.addEventListener("DOMContentLoaded", function () {
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