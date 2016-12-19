# LinkBoarder
Make sharing great again . 

####This is a hack built for productivity hackathon held in Microsoft for the Office 365 Team. The idea behind the hack is to make sharing links to multiple groups a seamless process through auto generated search terms. 

We have made a really nice video , please see the video for better understanding of our hack https://www.youtube.com/watch?v=XT0V9_njvsE

[![ScreenShot](http://img.youtube.com/vi/XT0V9_njvsE/0.jpg)](https://www.youtube.com/watch?v=XT0V9_njvsE)


The following technologies were used
* Chrome Application Framework for the plugin
2. Node JS for the backend
3. Mysql for teh cache to avoid hitting Watson (We could have used Redis)
4. Elastic Search for the recommendations
5. Bootstrap for the styling


This is really a good idea if you are building ahack on productivity or just learn javascriot and Node. Since it was built in a hackathon , the code is far from ideal. But feel free to go ahead and plagiarise it :) 
####Please "Star" the repo if you find it useful. 


<p align="center">
  <img src="https://s27.postimg.org/uupdvcd5v/Picture1.png" alt="LinkBoard logo"/>
</p>

Some of the screenshots from the app are 

This is the login page for connecting with office 365. 

<p align="center">
  <img src="http://oi64.tinypic.com/1hqohl.jpg" alt="LinkBoard logo"/>
</p>

This is the chrome plugin when you are about to share an article 

<p align="center">
  <img src="https://s29.postimg.org/fjt1feevr/Screen_Shot_2016_12_19_at_9_17_33_PM.png" alt="LinkBoard logo"/>
</p>


Some more pictures of the chrome plugin. 
<p align="center">
  <img src="https://s29.postimg.org/fgzp9p2xz/Screen_Shot_2016_12_19_at_9_22_12_PM.png" alt="LinkBoard logo"/>
</p>


This is a Nodejs Express project . Setting up is farely simple. 

* Clone the repo
2. npm install
3. create a db called linkboard
4. Changed the db details in /sql/sequelize.js 
5. The elastic search is currently hosted at heroku .Please change the url @ recommendationHelper.js
6. File names are self explanatory. 

We Use the Office 365 Graph API to get all the User details including his groups. Then we use Watson's Alchemy Language API to get the document topics, concepts , keywords and then index it in Elastic Search. Also to avoid exhausting watson's limits we store it in a cache which is in mysql. We use Office Graph APis to post to groups. The Emails have special formatting that make it searchable on tags without revealing them.













