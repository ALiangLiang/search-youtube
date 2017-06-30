// chrome.omnibox.setDefaultSuggestion({
//   description: '<dim>\u003c\u8f38\u5165\u641c\u5c0b\u5b57\u8a5e\u003e</dim>'
// })

// chrome.omnibox.onInputStarted.addListener(function() {
//   console.log('start');
// })

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
        const regex = new RegExp(text, 'ig');
        const title = result.snippet.title.replace(regex, (match) =>
          `<match>${match}</match>`);
        return {
          content: '\u25b6 ' + result.snippet.title + ' '.repeat(10) + '|' + result.id.videoId,
          description: `<dim>\u25b6</dim> ${title}    <url>https://youtu.be/${result.id.videoId}</url>`
        }
      });
      suggest(suggestResults);
    });
});

chrome.omnibox.onInputEntered.addListener(function(text) {
  // open video page.
  if (text === '')
    chrome.tabs.create({
      url: 'https://www.youtube.com/'
    });
  else if (text.startsWith('\u25b6 '))
    chrome.tabs.create({
      url: `https://youtu.be/${text.replace(/^\u25b6.*\|/, '')}`
    });
  // open search page with keyword.
  else
    chrome.tabs.create({
      url: `https://www.youtube.com/results?search_query=${text}`
    });
});

// chrome.omnibox.onInputCancelled.addListener(function() {
//   console.log('cancel');
// });
