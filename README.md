ItzLit

CAROLYN THIO, LUOXIAO LI, JUSTIN LEE, CRYSTAL NGUYEN, JOHN GAMBOA, ALEXANDRA HUANG


EXECUTIVE SUMMARY


KEY PROBLEMS ADDRESSED

Itz Lit strives to minimize your worries by maximizing your safety on your commutes after dark. We display information about how “lit” a route will be for users and display current crimes that may have happened on each given route, so the user has the ability to decide which route they would feel the safest going home on. 


2.    DESIGN IDEAS

Originally we wanted to expand on the same idea we proposed for Assignment 2; YOUber was an app for Uber drivers that would allow Uber drivers to maximize their profits by viewing information about demographics, income, etc. of the people in the different regions of San Diego and thus make an informed decision about the probabilities of making a profit in these regions. We thought that it would be beneficial to start working from an existing project rather than having to start completely from scratch. However, through feedback from our TA we decided that it may be best to go in a different direction so that we can further explore the data that is given to us. 

The idea that we pitched was BIZWIZ. The problem we tried to solve was finding the optimal location for a business to be opened in order to get the best Yelp ratings and reviews and succeed in that area. However, this idea was more common than expected. We realized that two other groups had chosen to do this same topic. From the feedback we received from our peers that week and from the advice of the TAs, we decided to shift gears once again. 

After a couple topic changes, we decided to tackle the problem of safety. Through user interviews, we realized the need to raise awareness of one’s surroundings, especially during the dark hours of the day; many of the people we interviewed had a problem with feeling safe when traveling after sunset, since they either had poor night vision, which prevented them from driving, or they just did not feel comfortable with not being able to see potential threats or obstacles around them. Many people commute to and from their home whether it be to go to school or to work. Itz Lit tackles the problem of attaining the maximum sense of safety and security by finding the most well-lit routes and areas to stay in.


3. IMPLEMENTATION

We gathered data from Spot Crime to get the most recent crime data in the San Diego area, data from The City of San Diego to get streetlight data, and incorporated Delphi data to visualize our data. We utilized OAuth to give users an easy way to login to their Facebook accounts. This provided a more secure network of users when posting information on our application.Socket.io was used to implement our chat system. This chat system was turned into a section for live updates so users can post messages about events happening in their surrounding areas. 
Instead of constantly pulling from the Delphi database, we decided to store this information into mongodb. In addition mongodb helps to store the messages in our live updates sections so users can scroll through and view past information as well as those of the present. Bootstrap helped enhance user usability and experience. In addition it helps with the aesthetics of the overall application. To better help visualize our street light data to users, the Google Maps API allowed us to display alternate routes, crime data, lighting heatmap.


4. FEATURES 

We utilize Facebook to allow users to easily login to our application. By having our users sign into Facebook, we allow them to interact with one another through our “Live Updates” section. The purpose of this section is to keep users up to date on what may be happening around the area. Users will write a message and input the location of where they are. 

On the first page users are prompted to enter their starting point, their ending point, and mode of transportation. Once users have inputted this information, different routes will appear under the “My Routes” section of the application. If there are different routes to the destination, users have the ability to choose which one they would like to take. Under each route, information is given to help users make decisions of which one they would like to take. This information includes how long the route would take, the distance of the routes, directions, how lit the route is, how many crimes have occurred on that route, and the distance and the duration of each of the routes.

Our map provides a visual representation of the street light data and crimes in the area. In addition we show nearby “safety zones” so that if needed, users will be able to easily reach one of these destinations. On the upper left hand corner, users can choose to toggle the map by showing or hiding the street light data. We also provide a legend that displays what kinds of crimes are happening on the given route.

The more information sections displays D3 graphs on the different kinds of crimes and how much of it has occurred based on the hour of the day. For the line graph users have the ability to decide which crimes they would like to visualize and how frequently it had occurred over time. We also provide a pie chart that displays a breakdown of the various crimes that occur over time. The bar graph displays the quantity of all crimes by hours of the day. Through these various visualizations users are able to analyze when crimes are occurring most around San Diego. 


5. EVALUATION

Realizing that hindsight is twenty-twenty, we believe that we created a usable application that provided a viable solution to a very apparent problem. We realize now that we would have altered certain aspects of our development process, like allotting more time towards styling and user feedback. If we had obtained feedback much earlier in the development process, we could have been more efficient in implementing features that the user would have valued. 

Additionally, we wish we had a dataset that was more representative of lighting in San Diego. As mentioned in our presentation, the lighting dataset fails to accurately portray lighting throughout UCSD’s campus. On the other hand, our application provides users with live crime and helpful tips via crowdsourcing methodologies. Consequently, although loading the 50,000+ data points for our map seems lengthy, we refactored our code to load data in as little time as possible. Also, we visualize crime data in a meaningful and digestible manner. In the end, we found that loading speeds, aesthetics, information architecture, and purpose should be highly prioritized when creating any type of application.


6. FUTURE DIRECTIONS

Expand our application to cover more cities and areas based on the users’ proximities
Add additional features for the social media aspect of the application - Implementing most used routes and user reviews of routes
Further improve the ‘Live Updates’ section by tailoring it to users’ observations that updates the map as well
Optimize for mobile
Directions that update in real time, i.e. users get alerts as soon as they happen and can also view tips from other users who have used the routes before
Figuring out how to best visualize the map and relevant icons on a much smaller screen
Visualize lights on the mobile app, 3D street view
Companion option that would involve having another person aware of one’s location or current situation and to be ready to respond or call the police in case anything goes wrong on one’s commute; commuter carpooling options (allowing people to find other people to travel with in order to feel safer as well as possibly reduce pollution from cars)
Tailoring light data to be more accurate via crowdsourcing methodologies 



















PROJECT REPORT

1. INTRODUCTION 

After cycling through many ideas to find one that is unique, but still a real problem that lacks an adequate solution, we thought about issues that people face locally and realized that safety at night was still an issue. Thus, we ended up with the concept for Itz Lit. The goal of our project was to create an application that would allow users to feel safer on their commutes to different destinations, especially at night. We do so by providing information about the different routes users can take in order for them to make the best decision on how they would like to travel to their given destination. We maximize the functionality and usefulness of our application by formulating lighting data, crime data, and directions specific to each route and destination. We also create a sense of community by having a live updates chat box where users can leave travel tips to others in specific areas of San Diego. Overall, these features cater to a resourceful and unique application that helps San Diego travelers safely get from point A to point B.

In the second section of our paper, we will discuss the motivation and background behind why we chose to tackle this problem. Here, we will discuss the people problem we are trying to solve and then technical problems that currently exist.  Our main focus was about the safety of people, since we wanted our app to help others feel safer in situations that they may not feel safe in currently. Although current solutions try and tackle this problem, there are several elements missing; ItzLit fills in the gap by covering several different aspects of features that make people feel safe and raise people’s awareness about how to find safety and safer routes to travel on..  

In section three, we will discuss the design process that we traveled along in order to get to our final product. Initially, we had come up with a couple of different ideas, but quickly changed topics and continued to refine our product as we gained more feedback and insights on a weekly basis in our in-class presentations. As we continued to gain more feedback from our peers and TAs we would continuously shift gears and redesign the features that people did not like or did not think were entirely necessary.

In the next section, section four, we will discuss the technical aspects behind how we implemented our application. This will include the application’s architecture, technologies used, and the different features of our application. We utilize three main datasets including Spot Crime, UCSD Delphi, and data from the San Diego Regional Data Library.  

In section five, we will then discuss various HCI principles and how we implemented these principles throughout our application. We wanted to build an application that would make it easy for the users to not only understand the purpose of our application, but to also easily navigate around, and the design principles provided a solid guideline for us to follow, since these principles are crucial for the fundamental aspects of usability and creating a smooth user experience. 

Testing and evaluation of our system will be discussed in section six. We utilized several different testing methodologies to optimize the usefulness of our application and improve the overall user experience. Despite finding the weekly feedback from the class to be extremely helpful, we conducted our own user interviews and alpha/beta testing to create a well-rounded, intuitive, and easy to use application. With every test, we gained valuable insight that helped us to continually improve our app.

Section seven is where we will discuss the roles of each member in our group, and how he or she contributed to the overall progress of the team. Our team had a strong dynamic, and together, we were able to produce a product that we all worked hard on and can say we are proud of. 

Finally we will conclude with a reflection on the work we have done and what work could be done in the future to further improve and expand upon our application. Given the short time frame of five weeks, there are many other features, such as mobile-friendliness, that could be implemented if allotted more time. Although our application currently accomplishes what we strived to complete throughout the quarter, the added features would only help make our application that much better and convenient for our target users to use. 


2. MOTIVATION AND BACKGROUND

Through user interviews conducted, 75% of the people we interviewed (30 people) stated that they do not feel safe commuting at night. 80% of the people who did not feel safe at night stated that they didn’t mind commuting during the day. 90% of the people we interviewed said that they would feel safer commuting if it was brighter outside rather than when it is dark. This raised the need for a way to make people feel more safe when they are forced to commute at night. 

Currently people want to be able to feel safe when they have to travel from one location to another, especially when it is dark outside. Safety is a major concern and it is desired by most, if not all, people in this world. We wanted to create an application that would give users information to allow them to feel safe on their routes back. By displaying data we feel would be useful -- in our case streetlight data, crimes, and safety zones -- users will be able to make an educated decision of which route they feel most comfortable taking home. 

Current Solutions include the following: Companion, an application that allows someone to track you as you travel from one destination to another; Safe Trek, an application that allows users to easily call emergency numbers when they are in danger; Rudder, an application that displays light data on a given route. 

However, these applications do not display information for the user to decide which route to take would optimize safety and a sense of security. This problem does not have a trivial solution because all these different sources of information -- directions to destination, safety rates, crime rates -- are not usually combined into one application. 


3. DESIGN

Our original idea was to build off our “Youber” application in assignment 2, but then we decided to revamp it with a new idea although using a similar layout. This idea was BizWiz- to find the best location for a business to be opened and successful. Both of these previous ideas were based on visualizations on a map so we decided to stick with something that utilized a map since we were already familiar with using it. We created our paper prototypes and Balsamiq mockups for Youber/Bizwiz, but made our high-fidelity prototypes on Invision for Itz Lit. The timeline progression of our project goes as follows: Youber → BizWiz → Itz Lit.



For our initial paper prototype for YOUber, we originally planned to clean up our existing functionality from Assignment 2 and to add new types of data visualizations that the users (Uber drivers) could interact with and figure out information on the people and areas they may want to go to in order to get more customers. We wished to implement a user built feedback area filled with ratings and tips that would engage users and allowed for interaction and invitation to come back to our app.



For our second paper prototype with our second idea of BizWiz, we followed the same structure as YOUber by using Google Maps still in order to show users the best locations for their businesses in a visually intuitive way, and we also wanted to use the same idea from YOUber where the users would be able to view more data visualizations such as pie charts that show information about the locations on the map just by clicking on those locations on the map. We also kept the sidebar layout with the top recommendations on locations to start a business in order to get the best Yelp ratings.


Our Basalmiq mockups were implemented for BizWiz. We created them to be reflective of what our paper prototypes were, but just more detailed, thus making it even easier to imagine what the screens would look like on the web.

Depicted by the pictures of our low-fidelity mockups, we placed a lot of emphasis on having a map as the main visualization, which was then accompanied by additional popups with more information. We continued to use the relatively same layout from our low-fidelity mockups to build our high-fidelity mockups although our app idea shifted. The structure was essentially the same: landing page, pages for the users to enter in information, then a resulting page.




Our first design of Itz Lit is pictured above. The landing page introduced users to our app and allowed them to navigate to the next page with “Get started”. The next two pages asked users for their starting and ending points. We originally decided to split those two points into separate pages to not confuse the user as well as give them a sense of progress (with the Page 1 out of 2 at the bottom). We imagined that users might want to use their current location so we put that in the page to enter the starting point. The resulting maps page consisted of a sidebar with information similar to our low-fidelity prototypes. However, this sidebar would now be filled with information relevant to the user’s safest trip. We thought that start time might be relevant to our users and effective in displaying data due to change in events happening correlated to time of day. Users would have the option to toggle visualizations on the crimes and heatmap of light data, since the most important information to them would be their route and directions. Our original prototypes addressed the baseline functions we imagined our app would do- thus instead of having the live updates like we have now, we imagined there to be a companion finding option for users as our social media aspect and instead of giving directions to only one route, we now give users multiple routes to choose from so that they have more freedom to meet their needs.

We cannot compare our prototypes too much since they were meant for different app ideas, but throughout the weeks of building the app, we have progressed from what we imagined the app to originally look like. The multiple pages to enter information has been reduced to one since the information users would have to enter now was not a lot. One page gives the users results right away as compared to spreading out the information in multiple pages. We also moved from displaying one safest trip to displaying multiple routes for users to choose from. This way, users were able to choose the route best fit after their own ratings of importance (from percentage lit, crimes, distance, and time). For example, if a user was pressed on time, they could take a route that is faster but not as lit.

Instead of having pop ups on the map visualizations (which we thought would have been convenient for users), the nature of the information we had to display other than what was already on the map resulted in a “More information” section at the bottom of the map. The data in this section is more about correlations with crimes and times of day, not live data. Users who first come to the app would be more focused on information more relevant to their trip, therefore we relocated the data to be in a place where users can further explore.

To make our app more engaging and give users a reason to return, we decided that having some sort of social media or user engagement was necessary. However we were not sure exactly what to implement/what we could even implement at first. We ended up with a “forum” in which users could post anything they wanted if they were logged in. We imagined it to be open and filled with user-led discussions about routes, buddy finding possibilities, and updates. We realized from peer feedback that “Forum” was too vague and that its location at the bottom of the page (essentially a new page) made it not necessarily useful or intuitive. We decided to move to be next to the map and instead of making this a general Forum, we renamed this to be “Live Updates” of what is happening around the different locations. By moving this chat system by the map, it became more relevant, accessible, as well as useful. The con of this is that it become more narrow of a function compared to the general forum we had where people could converse about different things.

The design of the gradient was also something we tried many times to get right. It was difficult choosing a gradient that would appear nicely against the black background, portrayed the concentration of street lights accurately, and represented streetlights. By default, the red to green gradient portrayed the the concentration of lights well enough, but it didn’t look like streetlights, which was a point of confusion for the users. Ultimately, we decided to go with a bright yellow with different opacities, since yellow seems to accurately represent actual streetlights and would thus be an intuitive representation of the concentration of lights for the users.

Overall, it was the constant feedback we got from our peers each week that allowed us to tremendously progress our app to what it currently is. It especially helped that we had the opportunity to present the questions to the audience, based on what we wanted feedback on. Peers pointed out issues with the look and feel of our app as well as the functionality. We were enlightened to what we should focus our energies on developing and changing. For example, we separated our legend into separate components (a crime legend and a light meter) because the audience was confused when it was all on one legend. Additionally, the feedback helped formulate the purpose of our online forum. We ended up using the forum to crowdsource tips for certain locations around San Diego, rather than using the forum in a more social, conversational way. We also were given ideas about the visualizations- like the lightbulb to display the “litness” percentage. Without peer feedback, our app might not be as helpful as we thought it could be as well as not as aesthetic.



This is our final design of the landing page and destinations page where users simply have to enter in their starting and ending points (easily with autocomplete or even using their current location), then pick their mode of transportation (defaulted to driving, but also includes walking, public transit, and biking).



Our resulting maps page features a navbar, informative sidebar that includes two different tabs. The first and default tab show the users the possible routes and information on how each route. The second tab allows the user to view/post live updates about the road conditions. This section also features a map that visualizes all the data. The user can also click on the many markers on the map to display more information about the various different crimes, such as the type of crime and the time that the crime occurred.



The bottom of the page is the more information section which has a carousel of three different D3 visualizations. These visualizations include statistical visualization of the types of crimes and their trend over time, a pie chart of how common each crime is, and how much a certain type of crime occurs in relation to time and the other types of crimes. Users can choose to explore all these different graphs and dig deeper through separated crimes and see more information by hovering over the graph elements, which would then display more information through tooltips.


4. SYSTEM DEVELOPMENT


We ended up using the MVC architecture to build our web application. 

Backend

For our Model portion, we initially used Postgres SQL to grab crime data from Delphi, however, we realized that writing queries to get data from Delphi was slow and inefficient. Since the data is static then, we made a one time query and saved it to our own MongoDB database for a more reliable data storage. We also decided to store the streetlight data in our mongo database as well. We would make API calls to spotcrime each time our app loaded due our app getting the most current crime data on top of past ones from 2012.

Mongo Models:
Users
Street lights
Past Crimes
Posts


Front End

For our view portion of our MVC architecture, we utilized Bootstrap and D3.js to make our application visually appealing. We made Ajax calls to get the data generated by our backend (Streetlights, Crimes, current crimes and past crime statistics). We also used Google’s map API to generate a map and visualize polylines on our map as well. For each route that google maps generates for us, we’d pass a google map route object into our backend, which would calculate how lit and how many crimes each location would have. We also used D3 to make backend calls for our charts.

Frameworks/etc

For the controllers portion of MVC, we utilized the Express framework and the Node framework. We used Express to help communicate between our backend and front end.

Other Libraries used:
Passport
Socket.io
Dateformat
Request
cookie-parser

Technologies Used:

Google Maps API

As stated previously, we utilized the Google Maps API to present necessary routes, lighting, and crime data to our San Diegan users. This was a very crucial part of our app to use, since we heavily relied on providing multiple routes to get a user from a starting destination to an ending destination as well as displaying the heat map of lights and crime data visually.

SpotCrime API

Using SpotCrime, we were able to pull live and recent crimes to visualize on our map. Users are able to differentiate the different types of crimes, such as assault, vandalism, arrests, and more. Without the SpotCrime API, we would only have past crime data from DELPHI which we felt was not sufficient to present to our users.

DELPHI (crime) 

We used DELPHI primarily to visualize past San Diego crime, portrayed in our D3 visualizations. Being that most are older dated crimes, we wanted to present this to users so they could get a better idea of when and how crimes have happened historically.

City of San Diego (Streetlights)

Pulling streetlight data was extremely crucial to our app, thanks to the City of San Diego. We were able to find exact latitude and longitude coordinates of the majority of streetlights throughout San Diego. This dataset is represented as a heatmap on our map.

Features:

Facebook Login


We make users login with their Facebook (done with OAuth) so that we can create a more secure network of users. This also will allow users to post live updates and bring in the social media aspect to our application. 

Destinations


Our destinations page features two fields of user input- each has an autocomplete option implemented. Users can also use the “Use current location” to have their current location be the starting point; implemented by reverse geolocation. All our features were made possible by using Google’s APIs. Essentially we were collecting information of what the user wanted and passed it to Google Maps to create the routes for the users (hence the starting point, ending point, and mode of transportation).



Routes 




Because we’re concerned with providing users the best route, we display several different routes that the user may take. Each route displays the amount of crimes and light as well as duration and length of the route so the user can choose which fits his or her needs. We created an algorithm based on the user’s planned route to count the amount of light and crimes on that route. We used google’s geometry API, to create polylines, and we would count how many lights or crimes landed on or close to each of the routes. Using the percentage of “litness” calculated, we were able to create visualizations of that information in the form of a lightbulb using if statements and graphics. To accompany each route, we featured the directions for the user which was pulled from Google. Furthermore, we also displayed how long the route was and how much time it would take to go through each route. So that the user can take everything into consideration.

Live Updates




We provide a section for users to post live updates about what is occurring on their route and surroundings. This allows users to get the most up to date events and notifications. We take information that the user enters in the form (text and location- which also has autocomplete) and push it to MongoDB. The form also features popup modals that contain error messages if the post is invalid (empty) or a confirmation message to make sure users are posting exactly what they want. With Socket.IO, updates to the feed happens instantaneously and users are notified if there happens to be any new posts.

Heat Map



We utilized the Google Maps API to create our heatmap. We were able to pull the coordinates from the San Diego Streetlight database and plot those onto the map as points of light. To improve the representation of lights, we used a bright yellow with different opacities to show the concentration of the lights rather than a red/green heatmap. Also, we used a dark gray/black color scheme to portray a nighttime scene to complete the whole look and feel of our app.

Crime Data / Safe Zones


Because so much of the peer feedback involved suggestions about including “safety zones” like police stations, we added markers to all of the police related facilities in San Diego to our accompany the other crime markers on the map. The crime markers are created based off of live data being pulled from the Spot Crime API. If you click on the markers, users are able to see what kind of crime each marker represents. Additionally, we have the map crime legend to better differentiate each crime.

D3 Data Visualizations



For the “More Information” section, we decided to implement a carousel so that users can navigate through the different types of data visualizations that we provide to them easily without overcrowding a single page; using the carousel also means that we did not have to have a long, single-scroll page with many visualizations that would be hard to compare, since the user would have to go through the hassle of scrolling up and down, and instead can cycle through them in the carousel. The three types of D3 data visualizations are (a) the line graphs that are filtered by the type of crime that has occurred in San Diego, (b) the donut chart with tooltips that shows the breakdown of the different types of crimes that have happened in San Diego at every hour of the day, showing the number and percentage of the crimes that are accounted for by each type of crime, and (c) the stacked bar chart that shows the relative amounts of the types of crimes that have occurred at each hour of the day. These visualizations show possible trends that may indicate what types of crimes have occurred most often at what times of day; for example, the line graph for DUIs shows that more DUIs have historically occurred at night time, from around midnight to early morning (before dawn), which would make sense, because many people tend to drink at night time for parties or social drinking events that may occur at bars or with co-workers, and thus they end up driving after drinking at late hours.


5. HCI PRINCIPLES AND THEIR APPLICATIONS

The goal of our app was to make the user interface as straightforward and informative as possible so that users had ease navigating and finding the information that they were looking for. A lot of the resulting interface was due to useful peer feedback which expressed where people preferred things in terms of the placement of different features on the page and what was unnecessary or hard to find. Thus our simple, single destinations page had features like autocomplete as well as “Use current location.” Choices were made clear to the users. This is also evident in our resulting maps page. The different routes are displayed on the right and are interactive if users hover or click on them. Feedback also resulted in us implementing “Live Updates” right next to the map rather than a forum at the bottom of the page. Our interface gave users the information they wanted most first and then allowed for further exploration to possibly find other information that could be useful (“Live Updates”, “More information”).

6 design principles:

Discoverability/Signifiers

On our map, we highlight the exact route that corresponds to the route that was chosen on the left hand side with a bright blue color that users can easily identify. 

Learnability 

Our app gives directions before each point of interaction users can make such as “Click here to log in and get started” or “Please enter your destinations here” or “Write a new post”. Text boxes/field of inputs also display value holders that help users figure out exactly what they are supposed to input. For the same reason, inputs for locations are also implemented with autocomplete.

At first users may not realize that they can click the routes on the left sidebar of our application. However, when the user hovers over the box, they learn that it is clickable with the outline of the box changing colors. The map will also respond to the clicks so users know that they are related.

Feedback

By highlighting buttons and sidebar tabs when the user hovers their mouse over it, give the user feedback that what they are on is a button and can be clicked. In addition, inputs and text boxes are highlighted when focused to give user feedback that what they are on is the current input or textbox they will use to type in information.Users are also aware that the maps page may still be loading due to the spinner.

When users create a new post, it will also automatically update the newsfeed. When someone else posts a new posts, Socket.IO will create a notification on the feed that there are new posts to be loaded so everything is updated during real time.

Natural Mapping/Mental Metaphors

Other than providing users with redirects from page to page, we have a familiar navigation bar that allows users to go to navigate to previous pages or other sections of the current page. We also have a back to top button for when users scroll down to the more information page. The use of Google Maps on the main section of our application is also intuitive for most users because of the fact that the majority of people are familiar with maps and how maps represent and depict real places and roads.

Constraints

Our application naturally redirects the user from page to page. On the “Destinations” page where the user enters their desired starting and ending location, there are constraints placed on the locations that a user can find a route between, since the app is currently limited to San Diego (an error message will be displayed if they try to search for a location outside of San Diego). Once the user gets to final map/visualization page, the natural vertical scroll helps guide users. In the “more information” section where our D3 visualizations are, we have a visible carousel that users can navigate through. Additionally, we have a back to top button for users who wish to quickly scroll back to the top of the page. 

Error Prevention/Recovery

Once users sign into our web application with their Facebook Login, they will be prompted with a destinations page. If no starting or no ending destination was inputted, the user will not be able to move on and an error message will appear. If the users didn’t enter the correct destinations they can simply go back to the destinations page with “Change trip”.

Currently the data gathered is limited to the San Diego area. On the page where users enter their starting and ending points, if a user enters a location outside of the San Diego area, an error message appears prompting the user to change their destinations. 

Users can also experience popup modals when they try to create a post in the “Live Updates”. Modals will let the users know if they cannot post something due to an error (like an empty post) or will confirm with the user if they really wanted to post something. 

Features:

App overall: 

We are using language that people are already familiar with (match between system and the real world). We kept the same color scheme throughout the entire application. In addition we kept the same theme to keep everything consistent. Common phrases are also utilized throughout the application. By stating that an area is “lit” means that there is more light in the area (consistency and standards)

Landing page with facebook login: 

Facebook button is clear for the user to see, and is minimalist in a way that the user naturally recognizes that it is a login button and knows what action to take and what the expected action of clicking the button will be.

Destinations page: 

The page contains only the necessary elements to get the information needed from the user to route them. We continue to use terms that the user is familiar with like starting and ending points and modes of transportation, similar to what users would expect from a mapping/routing application. There are also constraints implemented since the app is limited to the area of San Diego. Users can only continue to the next page if the destinations input are filled out and are valid areas, otherwise error messages will appear until the user has fixed them. This avoids having confused users on the resulting maps page if they entered in an address outside San Diego and see no data. Autocomplete in the field inputs also allow users to recognize addresses and minimize their memory loads for remembering specific addresses.

Maps page:

While everything is loading, a spinner appears letting the user know that something is still loading, rather than assuming it is complete (visibility of system status). For the routes, we use natural mapping and metaphors in that the visualization in map form should be familiar to most users, since many people have used maps before, whether  it is in paper or electronic form. The color of the heat map visualizations and placements of individual lights replicate streetlights in real life, placed on the map to show users where they would be along their actual routes. The routes include a lightbulb which is naturally what people expect to represent the amount of litness, but to help users understand better we also included the percentage and label on top. The routes are also highlighted in corresponding colors so users are better aware of which is selected.

Live updates: 

Before posting an update, the user has to verify whether or not s/he wants to post. User is allowed to cancel the post and go back and edit changes, or proceed with posting the update. This allows user to prevent posting something they don’t want to post, and recover from it by cancelling.

More information:

The graphs show data to users in ways that are intuitive and clearly represent the breakdown of different types of crimes, and most users are likely to be familiar with donut charts, line graphs, and bar charts. The carousel is also obvious with the arrows at the sides and users will know which slide they are on due to the reactive dots at the bottom of the carousel- here, users can easily explore the data and navigate back and forth easily if they make a mistake. The visualizations also have tooltips that will appear if the users hovers over it.

Fixed navbar:

The navigational bar is easy access, labeled accordingly so that it is intuitive for users (match between system and the real world). Users have the freedom to navigate to different sections and pages of the application easily with the navigation bar at the top (fuser control and freedom). If for example the user wants to change their starting or ending destination, by clicking the “Change Trip” button, we allow the user to do just that.


6. TESTING AND EVALUATION

We allowed other users to walk through our application. Throughout the development life cycle, we observed prospective users interacting with our application. By observing and taking notes while we observed, we were able to see which components worked intuitively. Also, we asked the users to verbalize any type of thoughts they had while navigating through the website. Whether it was dealing with the low fidelity prototype, the high fidelity prototypes, or our herokuapp, all of this user testing was extremely crucial in creating an intuitive, resourceful application.

Besides getting feedback from the class, we conducted user research and interviews to create a better app. We asked questions surrounding the ideas of preserving a sense of security at night. Several of our users suggested that knowing where police stations are or having some type of communication with other users would preserve that security. Additionally, we asked users what helpful features would be key in making Itz Lit a useful app. By providing live crime and crowdsourcing tips, users can surely use this app time and time again. 

In regards to A/B Testing, initially, we used paper mockups and low fidelity prototypes to see how users would naturally navigate through our application. This was especially important in developing our app because we wanted to get a better idea of what felt intuitive to users. For example, we found that focusing on the map meant making it the largest feature on the map screen. However, we needed to create a sidebar of the map that displayed relevant information that accompanied routes, crime, and lighting data. Once we solidified the foundation of our layout, we created high fidelity mockups that focused on more detailed aesthetics. Specifically, when we had a beta version of our app on Heroku, we asked for color scheme ideas especially regarding our map heatmap gradient. Users found the red to green gradient to be misrepresentative of lights, which is why we decided to stick to a bright yellow, the natural color that comes to mind when people think of light. Overall, the testing process of Itz Lit catered to the refinement and quality of our finalized product.

Our system successfully answers the problem we were trying to tackle described at the beginning of this report. Our motivation was to increase user awareness and safety on their routes back home, and we provide relevant information for users who are forced to commute from one destination to another. The combination of street light data and crime data allow users to analyze different routes home and determine which they feel is the safest. Itz Lit does not necessarily choose the “safest route” because we feel that each individual may view this differently and do not want to make decisions for others. 

An overwhelming majority of the users we tested our application on stated that they would prefer a more representative gradient over our original green and red heatmap. Of the 30 people interviewed, 95% stated that they like the yellow gradient better than the prior. In addition we asked our users whether or not they felt the initial forum section we had was necessary. 42% stated that it was not necessary whereas the remaining liked this additional feature. As a group we felt that many may not have liked the forum because the design was a bit out of place. Once we moved the forum to the same page as the map and asked the same question of whether or not people felt the forum was necessary, 73% said it was. 


7. COLLABORATION

Carolyn Thio: 
Worked mainly on implementing the social media aspect of the application. Implemented OAuth to allow users to easily login with their Facebook accounts, and integrated the ‘Live Updates’ section into the application to allow users to post about what is happening in various locations. 

Justin Lee: 
Worked on implementing the Google Maps and Heat Map for the application. Worked on finding a proper gradient for the heatmaps and an accompanying light meter via Photoshop. Also created crime markers and legend. Implemented safety zones on map and loading spinner wheel.

Leon Li:
Primarily worked on the backend and gathering data through Spot Crime and Delphi. Created the algorithm to calculate how lit each route was, and made displayed the information on the sidebar. Also created the skeleton for the application. Worked heavily on optimization and reducing load time and the potential bugs of javascript’s asynchronous calls. 

Crystal Nguyen: 
Focused on most of the design aspects starting with the prototypes especially. While not building and tweaking the styling on each of the pages, created the graphics necessary for the app (such as the lightbulb and transportation options. Also worked on implementing the responsive navbar, functions on the the destinations page (like autocomplete and getting the user’s current location), depicting “litness” in lightbulbs for routes, and modals for posting in the live updates. 

John Gamboa: 
Mainly worked on the side bar and destination page functionalities, including getting starting and ending destinations, as well as method of transportation, displaying step-by-step text directions as well as allowing user to view and select multiple routes that they could choose from. Also, worked on styling and page templates and corresponding front-end form functionality that allows app to make calls to back-end.

Alexandra Huang: 
Implemented the D3 visualizations and the Bootstrap carousel in the “More Information” section, which consists of the making the individual bar graphs for each of the crimes--that Leon converted to line graphs--that can be selected from the dropdown and creating the donut chart with the tooltips that show the type of crime, number of occurrences of the type of crime, and the percentage of all the crimes that each crime accounts for. 

All: 
Together we brainstormed to decide on a final idea to implement for this project. Through the feedback gained, we continued to modify the design of the application, and we all gave our inputs to continue to improve the project as a whole.


8. CONCLUSION AND FUTURE WORK

Our system will allow individuals to discover the safest route to their destination. Through the extensive research we have done about the current solutions out in the market, we feel that our application combines the best of all of them. We provide a way for users to analyze information in one application and strive to make the user choose the route where they feel the safest. 

Our application will be used to keep users feeling safe on their routes home. It will be useful especially during the darker hours of the day, since users could analyze which paths are the “most lit” and giving a better sense of security as the go to their desired destination. Currently our application is limited to the San Diego area. In the future we would like to expand to other major cities, and eventually allow users to gain all of this information based on their current proximity. 

In addition, we would expand on the social media aspect in our application. We would like to give users the ability to save the routes that they travel to most frequently so that they do not have to constantly input their starting and ending destinations, so each user would have their own history of traveled routes and saved routes. Our current “Live Updates” section is not categorized in any way. As we continue to gain a larger user base, it would be useful to separate the forum into different regions of the city so that the feed that users see will contain relevant information. We would also like to tailor the live updates feed to reporting things in separate categories such as crimes, traffic, animals, police, or any other observations possible, so there would be, for example, an individual feed or thread that would be specifically dedicated to crowdsourced crime reports.

In order to make our application more practical, we would want to optimize it on a mobile platform. By moving it to a mobile platform, users will be able to reference the application as they walk on their route. This will allow them to reference the live updates section if something has changed or decide to take a different route for any given reason. Users will get alerts as soon as they happen and utilize that information to their benefit. In addition they will be able to see exactly where crimes have happened on the map or where the safe zones are located. Not only that, we would like to enable the users to see the directions of their route in real time so that users are prevented from getting lost and don’t have to check back and forth between different apps.

To further provide information for our users we could add additional data visualizations of lights on the application. We can also continue to improve the visualizations of our applications by including an option of users to view a three-dimensional or satellite street view. 

One of our stretch goals was to add a companion option. Many of the people we interviewed felt that they would feel safer with someone by their side or knowing that someone was looking out for them. Similar to one of our competitors we could add an additional feature to “Walk with a companion” or “drive with a companion” so that individuals can have a better sense of security. This problem may also be solved with a commuter carpooling option which would allow people to find other people to travel with in order to feel safer as well as possibly reduce pollution from cars. 

Branching off the idea of being around more people, if we were to include population data users will be able to see how popular one route is compared to another. We could display information about how many people are typically located in one area or how many other users chose one route over another. 

Allowing users to rate different routes could also help to improve the user experience of our application. It is always nice to hear what other people experienced, and by incorporating this feature we could further expand the social element of the application. 

Currently our application also shows the lightness of each route, but the user might find it helpful to learn what section of their route is the most dark or what section of their route has a crime, so that they know to be extra careful.

Furthermore, our application relies heavily on 3rd party libraries and databases, which means that if something goes wrong on the side of the third party, it could cause tremendous problems with our application. The most notable one is Spot Crime’s api, which can have bugs at times. Ideally we could pull the current crime data from a more updated and reliable source.
