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
      const flexContainer = document.querySelector('.flex-container');
      if (!flexContainer) {
        return;
      }

      let cboxContainer = document.querySelector('.sidebar-right');

      if (!cboxContainer) {
        cboxContainer = document.createElement('aside');
        cboxContainer.className = 'sidebar sidebar-right';
        cboxContainer.id = 'cbox-container';

        const mainContent = document.querySelector('.main-content');
        if (mainContent && mainContent.nextSibling) {
          flexContainer.insertBefore(cboxContainer, mainContent.nextSibling);
        } else {
          flexContainer.appendChild(cboxContainer);
        }
      }

      const iframe = document.createElement('iframe');
      iframe.title = i18next && i18next.t ? i18next.t('chat_title') : 'Chat';
      iframe.src = 'https://www3.cbox.ws/box/?boxid=3550520&boxtag=1VI7sn';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.allowtransparency = 'yes';
      iframe.allow = 'autoplay';
      iframe.frameBorder = '0';
      iframe.scrolling = 'auto';
      iframe.style.border = 'none';
      iframe.style.minHeight = '400px';

      cboxContainer.innerHTML = '';
      cboxContainer.appendChild(iframe);
    };

    document.head.appendChild(i18nScript);
    startTitleAnimation();
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