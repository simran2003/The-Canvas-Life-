# The-Canvas-Life-
Online Art Community web app that allows users to create accounts, view and interact with artwork, and upload their own creations.

Program description:
- allows user to sign up and login
- user can switch between patron and artist account
- if artist user can add artwork and workshops
- user can search for artwork on the database and follow other artists - user can edit their following and their likes on their profile page
- user can enroll into workshops
Src files: gallery.json
package.json headers.pug add- artwork.pug artwork.pug artworks.pug following.pug home.pug reviews.pug search.pug user- profile.pug workshop.pug enroll.js following.js like.js modify-user.js unlike.js user- signup.js database- intializer.js gallery- router.js GalleryModel.js UserModel.js server.js
Compilation instructions: npm install node
database-initializer.js node server.js
Video links: https://youtu.be/Tx2p6Zn-mBA URL/Pattern: / or /home
HTTP Method: GET
Description:
Retrieves account login or link to sign up page
Expected Request Body Data:
None
Supported Response Data Types:
● text/HTML
Expected Response (Success):
●Status code 200
● Displays page to create new log in or link to add new account
URL/Pattern:
HTTP Method: POST
Description:
Logs user into account using user input
Expected Request Body Data:
JSON string containing username, and password for the user Supported Response Data Types:
● application/json Expected Response (Success):
● Status code 200
● JSON string representing the account
URL/Pattern:
HTTP Method: POST
Description:
Creates new account using user input
Expected Request Body Data:
JSON string containing username, and password for the user Supported Response Data Types:
● application/json Expected Response (Success):
● Status code 200
● JSON string representing the new account
URL/Pattern: /logout HTTP Method: GET
Description:
Logs user out of their account
Expected Request Body Data:
None
Supported Response Data Types:
text/HTML
Expected Response (Success):
● Status code 200
● Displays home page
/login
/signup

URL/Pattern: /user
HTTP Method: GET Description:
Retrieves user info
Expected Request Body Data: None
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● Shows user page and option to see their reviews, follows, and option to become an artist
● If it’s an artist account the user can add artwork or workshops which appear on the page when they are created
URL/Pattern: /user
HTTP Method: PUT
Description:
Updates user info to become an artist if the account exists Expected Request Body Data:
none
Supported Response Data Types:
● text/HTML
● application/json
Expected Response (Success):
● Status code 200
● Renders user page
URL/Pattern: /addArt
HTTP Method: GET
Description:
Allows user to fill in artwork information to add art
Expected Request Body Data:
None
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● HTML page to add art
URL/Pattern: /addArt 
HTTP Method: POST
Description:
Allows user to fill in artwork information to add art
Expected Request Body Data:
JSON object of artwork information
Supported Response Data Types:
● application/json
Expected Response (Success):
● Status code 200
● Adds artwork to the gallery database
● Displays user page
URL/Pattern: /addWorkshop 
HTTP Method: GET
Description:
Allows user to fill in workshop information to add workshop
Expected Request Body Data:
None
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● HTML page to add workshop
URL/Pattern: /addWorkshop 
HTTP Method: POST
Description:
Allows user to fill in workshop information to add workshop Expected Request Body Data: JSON string of workshop information Supported Response Data Types:
● application/json
Expected Response (Success):
● Status code 200
● Adds workshop to the user database
● Displays user page
URL/Pattern: /searchArtwork 
HTTP Method: GET
Description:
Allows user to fill in name, artist, and category information to find artwork
Expected Request Body Data:
None
Supported Response Data Types:
●text/HTML 
Expected Response (Success):
● Status code 200
● HTML page to search for artwork
URL/Pattern: /artworks
HTTP Method: GET
Description:
Finds all artwork associated with user input
Expected Request Body Data:
JSON string of artwork information
Supported Response Data Types:
● application/json Expected Response (Success):
● Status code 200
● Displays artwork underneath search page
URL/Pattern: /artist/:artist 
HTTP Method: GET
Description:
Retrieves artist with account name if they exist
Expected Request Body Data:
None
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● ●
URL/Pattern:
HTTP Method: POST
Description:
Enrolls user to artist workshop Expected Request Body Data: none
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● Alerts user they have enrolled
URL/Pattern: /following
HTTP Method: PUT Description:
Status code 200 HTML page of artist
/enroll

Updates user info to add artist into their following array Expected Request Body Data: JSON string of artist name
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● Renders artist page
URL/Pattern: /following HTTP Method: GET
Description:
Retrieves list of artist the user follows
Expected Request Body Data:
None
Supported Response Data Types:
● HTML
Expected Response (Success):
● Status code 200
● HTML page of who user follows
URL/Pattern: /artpiece/:name HTTP Method: GET
Description:
Retrieves specific artwork from database
Expected Request Body Data:
JSON string of name
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● Displays HTML page of artwork info
URL/Pattern: /likes
HTTP Method: PUT
Description:
Updates user info to add or remove artist into their likes array Expected Request Body Data:
JSON string of artwork name Supported Response Data Types:
● text/HTML
Expected Response (Success):
●

● Status code 200
Renders artwork page URL/Pattern: /reviews
HTTP Method: GET
Description:
Shows artist’s like that can be removed
Expected Request Body Data:
None
Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● Displays the artworks the artist likes
URL/Pattern: /unlike
HTTP Method: PUT Description:
Removes artwork from user’s likes array
Expected Request Body Data:
JSON string of artwork name Supported Response Data Types:
● text/HTML
Expected Response (Success):
● Status code 200
● Displays html page of the user’s reviews
