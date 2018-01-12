# Uniqey-Frontend

This is the frontend client for the Uniqey Web Application.

It is created using React, in order to render html elements. It uses Sass for styling, which allows for more compact, tree-like CSS coding. The Sass file is converted on the go using Gulp, by running the gulp file attached to the project, within a terminal. 

The application makes use of the Google API in order to access information that is valuable in order to send the necessary data for UID generation to the server. It authenticates the user, asks them for permissions regarding the use of Google Drive, as well as public account information from Google+, such as email, and display name.

Using a module called Axios, it sends POST, and GET requests to the server.

For optimal work, the server should also be running.

There are two 'pages' available for the users. The first page is the generation page, where users can generate UIDs. It is called Home, since this is viewed as the main feature of the application. The other one is My Keys, and it's were both old and new users can check their generated keys. The navigation is done using the react-router-dom module.

This is a demo for the actual application.
