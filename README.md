Last updated 17/05/2017

# Football Transfer Window Dashboard

## Overview

### What is this site for?
The aim of the dashboard is to allow an interactive look at football transfer data with various ways of filtering the chart data.

### What does it do?
The charts are fully interactive - selecting a club will display the data only applicable for that club. This allows a detailed look 
at a clubs transfer spending history. 

### How does it work?
The site uses Flask to retrieve data from a MongoDB and through use of D3.js, DC.js and crossfilter.js the data is filtered into dynamic and interactive charts.
  Bootstrap is used to give the site a responsive layout with routing done using Python.

### Features
- About page
- Trends page
- Charts - pie chart, line graph, row charts, menu selectors and number displays

### Tech Used
- **Python** - The programming language used for routing.
- **MongoDB** - The database used to store the Football Transfers Data.
- **Flask** - Used to retrieve the data from the database and return it to the browser.
- **D3.JS** - Used in the front end to display the data.
- **DC.JS** & **crossfilter.js** - Used to filter and sort the data and allow interactivity.
- **introjs** - The tour tool used existing introjs code.
- **Bootstrap** - To give the site a responsive layout.

### Testing
The site has been tested using Chrome, Firefox and Edge browsers.
The site has been tested using iOS and Android devices. 