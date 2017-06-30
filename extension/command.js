const command = decodeURIComponent(document.location.hash);
if (command.startsWith('#query:')) {
  const query = command.replace(/^#query:web\+youtube:\/\//, '');
  document.location = 'https://www.youtube.com/results?search_query=' + query;
}
