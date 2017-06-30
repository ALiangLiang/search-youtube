const btn = document.getElementById('request-permission');
btn.onclick = () => {
  navigator.registerProtocolHandler('web+youtube',
    chrome.runtime.getURL('command.html#query:%s'),
    chrome.runtime.getManifest().name);
};
