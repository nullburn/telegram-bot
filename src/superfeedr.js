/* A (simpistic) library to send requests to Superfeedr */
var superfeedr = {
  // Subscribes to a feed. Uses the chatID to build the callback url so that we know were each feed notification needs to be sent
  subscribe: function(feed, chatID, callback) {
    var data = querystring.stringify({
      'hub.mode': 'subscribe',
      'hub.topic': feed,
      'hub.callback': lambda + "?chat_id=" + chatID,
      'format': 'json'
    });
    var auth = 'Basic ' + new Buffer(superfeedrCredentials.login + ':' + superfeedrCredentials.token).toString('base64');
    var req = https.request({
      method: 'POST',
      host: 'push.superfeedr.com',
      port: 443,
      path: '/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
        'Authorization': auth
      }
    }, function(res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        callback(null);
      });
    });
    req.on('error', callback);
    req.write(data);
    req.end();
  },
  // Unsubscribes from a feed. Uses the chatID to build the callback url so that we know were each feed notification needs to be sent
  unsubscribe: function(feed, chatID, callback) {
    var data = querystring.stringify({
      'hub.mode': 'unsubscribe',
      'hub.topic': feed,
      'hub.callback': lambda + "?chat_id=" + chatID,
      'format': 'json'
    });
    var auth = 'Basic ' + new Buffer(superfeedrCredentials.login + ':' + superfeedrCredentials.token).toString('base64');
    var req = https.request({
      method: 'POST',
      host: 'push.superfeedr.com',
      port: 443,
      path: '/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
        'Authorization': auth
      }
    }, function(res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        callback(null);
      });
    });
    req.on('error', callback);
    req.write(data);
    req.end();
  },
  // lists all subscriptions with the chatID, by page. Starts at page 1.
  list: function(page, chatID, callback) {
    var data = querystring.stringify({
      'hub.mode': 'list',
      'page': page,
      'detailed': true,
      'search[endpoint.url]': lambda + "?chat_id=" + chatID
    });
    var auth = 'Basic ' + new Buffer(superfeedrCredentials.login + ':' + superfeedrCredentials.token).toString('base64');
    var req = https.request({
      method: 'GET',
      host: 'push.superfeedr.com',
      port: 443,
      path: '/?' + data,
      headers: {
        'Authorization': auth
      }
    }, function(res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        callback(null, JSON.parse(body));
      });
    });
    req.on('error', function(response) {
      callback(response, null);
    });
    req.write(data);
    req.end();
  }
};