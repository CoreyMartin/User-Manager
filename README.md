# User Manager
    
To use the manager simply navigate to index.html in a web browser. You're directed to the main users page where you'll see a list of users imported from a JSON file. You can navigate to the groups page in the upper right corner and edit individual groups from that page.

To add a user click the 'Add user' button, fill out any of the fields, and click "Done" on the left side of the row.

To add a user to a group go to the 'Groups' page, click 'Edit' for any group, click 'Add user', select an existing user from the dropdown, and click 'Done'.

For development first clone the directory locally and run `npm install`.

If you'd like to use the development bundle just edit the script in index.html to use 'http://localhost:8080/dev.js' instead of 'dist/prod.js' and start the webpack-dev-server by running `npm run dev`

If you'd like to run the unit tests just run `npm test`.