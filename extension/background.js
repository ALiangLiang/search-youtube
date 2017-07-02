// chrome.omnibox.setDefaultSuggestion({
//   description: '<dim>\u003c\u8f38\u5165\u641c\u5c0b\u5b57\u8a5e\u003e</dim>'
// });

// chrome.omnibox.onInputStarted.addListener(function() {
//   console.log('start');
// });

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  gapi.client
    .request({
      'method': 'get',
      'path': '/youtube/v3/search',
      'params': {
        key: 'AIzaSyAFPaXID5PM0wXq78MyVk2b35smv1dkONw',
        q: text,
        part: 'snippet',
        maxResults: '7',
        type: 'video',
        // order: 'viewCount'
      }
    })
    .execute(function(response) {
      const suggestResults = response.items.map((result) => {
        // highlight the keywords in video title.
        const regex = new RegExp(text, 'ig');
        const title = xmlEscape(result.snippet.title) // escape XML
          .replace(regex, (match) => `<match>${match}</match>`); // highlight
        // '\u25b6' === '▶'
        return {
          content: '\u25b6 ' + result.snippet.title + ' '.repeat(10) + '|' + result.id.videoId,
          description: `<dim>\u25b6</dim> ${title}    <url>https://youtu.be/${result.id.videoId}</url>`
        }
      });
      try {
        suggest(suggestResults);
      } catch (err) {
        console.error(err);
        console.info(suggestResults);
      }
    });
});

chrome.omnibox.onInputEntered.addListener(function(text) {
  const queryCondition = {
    active: true,
    highlighted: true,
    currentWindow: true,
  };
  chrome.tabs.query(queryCondition, (curTabs) => {
    // if current tab is newtab page, update these page.
    // otherwise, create a new tab.
    const curTab = curTabs[0];
    const params = []
    const isNewTab = curTab.url === 'chrome://newtab/';
    const open = (isNewTab) ?
      chrome.tabs.update :
      chrome.tabs.create;
    if (isNewTab)
      params.push(curTab.id)

    // open youtube main page.
    if (text === '') {
      _gaq.push(['_trackEvent', 'enter', 'empty']);
      params.push({
        url: 'https://www.youtube.com/'
      });
    }
    // open video page.
    else if (text.startsWith('\u25b6 ')) {
      const id = text.replace(/^\u25b6.*\|/, '');
      _gaq.push(['_trackEvent', 'enter', 'id', id]);
      params.push({
        url: `https://youtu.be/${id}`
      });
    }
    // open search page with keyword.
    else {
      _gaq.push(['_trackEvent', 'enter', 'keyword', text]);
      params.push({
        url: `https://www.youtube.com/results?search_query=${text}`
      });
    }

    open(...params);
  });
});

// chrome.omnibox.onInputCancelled.addListener(function() {
//   console.log('cancel');
// });
