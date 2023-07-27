Simple basic-auth secured NodeJS API server for exposure MS SQL views based on logged-in SQL user`s permissions.

<h4>How it works?</h4>

Application connects to the MS SQL server given in the configuration file <code>config.js</code> and retrieves views available for the logged-in user.</br>
Data from the views can be then retrieved by a simple GET request to <code>host:port/:viewName</code>, or using POST method, if view contains column named <code>API_FilterDate</code> - in such case, a where clause is used in SQL query, to filter results by the date range sent in the request body.

<h4>How to use it?</h4>

Complete <code>config.js</code> file with necessary configuration data, such as MS SQL database connection parameters, server ports, path to SQL certificate, and users who will be authorized by <code>express-basic-auth</code>.

By default, the server starts in <code>development</code> mode - to run it with production parameters from <code>conifg.js</code>, the <code>NODE_ENV</code> environment variable must be set to <code>production</code>.

Send GET request with <code>'Basic Auth'</code> header to <code>host:port/</code> to get all available views for the logged-in SQL user in response.</br>
Then you can use the names of returned views in a GET or POST request.

<code>'Basic Auth'</code> authorization header example:</br>
<code> Authorization: Basic {credentials}</code> - where credentials is the Base64 encoding of login and password joined by a single colon ':'.

POST request body structure:</br>
<code>{From: {Date}, To: {Date}}</code>

Build and run package using <code>npm install & start</code>, or Dockerize it by following <https://nodejs.org/en/docs/guides/nodejs-docker-webapp>