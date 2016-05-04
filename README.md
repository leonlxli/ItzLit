# YOUber
HELPING UBER DRIVERS MAXIMIZE THEIR SUCCESS

####Heuristics:
- Discoverability/Signifiers:
When the user first opens our web application they are prompted with a landing page that provides a short description and a button to “Get Started”. From there users will select the type of uber they are currently driving, which is clearly highlighted in the navigation bar. The information of the best regions they should go to are displayed automatically right below and the different regions on the map will become be colored corresponding on the type of Uber the user chooses.
- Learnability:
Users are easily able to use the app because of simple instructions such as “Click on a car to select your type of uber” and “Click on a region to explore why”. Our app is also straightforward and does not require a lot of clicks in order for a user to find the information they want, therefore users do not have a lot on their memory loads. In addition when a user clicks outside of the outlined region, there is an infoWindow that appears telling the user to click in the outlined area. 
- Feedback:
Clickable items will change to let the users know that they are clickable or selected. For example, depending on the type of Uber the user selects, the selected button will become highlighted indicating which “mode” they are currently in and possibly can select. In addition to that, regions of the map will become bolded when the user hovers over them or selects it. A popup with data corresponding to that region also has an arrow pointing downwards towards the selected region.
- Natural Mapping/Mental Metaphors:
We utilize language throughout our application that is familiar to our target audience. We utilize different car models to indicate the different types of Ubers users can choose to drive, something Uber drivers should know. Stating the top 10 regions also tells the user which regions they should drive in to put themselves in a place of high demand and gain the most profit. This is also displayed on the map using typical colors meaning good/go (green) and bad/don’t go (red). The map itself lets users see for themselves exactly where they should go directionally in the physical world.
- Constraints:
Users can only choose one type of Uber at a time. When users are first on the application, the settings are defaulted to “Uber X” in order to provide initial data. The data we provide is also constrained to the San Diego area. When users click “Center Map”, we limit their scope to the San Diego region. We also limit the user's ability to zoom in and out of the map so that they do not lose sight of the outlined region, which contains all the data. Users can only click on regions to enable the data popup.
- Error Prevention/Recovery:
Users are prevented from making errors and being confused because our app was made to be straightforward and simple with clear instructions and constraints. The app is a one-paged app; going to non-existing pages displays error message and automatically redirects. As for the map, when a user selects a region outside of the outlined area on the map, a message appears prompting the user to click in the outlined region to view data. In case a user pans too far on the map and cannot find the outlined region, we provided a “center map” button to reposition the map so the outlined region is within sight. If users want to explore regions, they simple can click on different ones easily and close the popup if they open one they don’t want to see.

####Design justifications:
- Bootstrap:
Built in one page website design - landing page that allows scrolling, first section introduces and explains the app to our users and the bottom section gives them the information they want to see in a compacted area.
Basic css already implemented so we just had to tweak a bit of the colors to match our liking.
We felt that by using bootstrap, we could keep our application consistent throughout.
- Google maps API:
Google Maps is widely used, so it is likely to be familiar to most users. Furthermore, in case we needed help, Google maps would also have a lot of support online. Presents the information to users visually in an intuitive way, since Uber drivers are probably familiar with maps. This also allows us to implement colors directly on the map to help users visualize the data
- jQuery:
For familiarity and ease with implementing how things are displayed and responsive. For example, we implemented the highlighting of buttons and appended rankings with jQuery. The primary use/purpose of d3 is to create charts and graphs rather to build a web app. For the sake of readability and helping people differentiate between the various APIs we were using, we decided to only use d3 for creating the graphs and http requests and Jquery for site manipulation.

####Work distribution:
Alexandra:
- Worked on red-green gradient of map and increased thickness of lines on hover
- Added default map coloring for UberX info
- Design ideas

Carolyn:
- Worked on implementing the infoWindow that pops up when clicking specified regions on the map. 
- Implemented the D3 graph to appear inside the infoWindow
- Added functionality to make infoWindow appear on click of sidebar items
- Contributed the README file

Justin:
- Map -- added geoJSON region, infoWindow, and center window functionality
- Changed map styling
- D3 - used D3 to create bar chart inside infoWindow
- Front end/CSS styling

Leon:
- App skeleton
- Backend: working with database and getting information, calculating rankings for each region based on database info. 
- d3
- Front end debugging
- Added map functionality

John:
- Preliminary app layout structure
- CSS styling/frontend
- Preliminary color appearance on map
- Top 10 sidebar implementation and making it correspond with the map

Crystal:
- Prototype design and continuous design ideas/critiques throughout
- Designing and implementing graphics on the app
- CSS styling/frontend
- UberX default state rendering
- README
