# LabelTech

![teamlogo](https://github.com/SergejsZ/LabelTech/assets/93885587/c0bfda70-fa8b-4335-ba7c-5f6cbcbd47a8)

# Application

LabelTech is a web app used to spot manufacturing label issues due to human error. It uses a camera and smart image analysis system to scan for incorrect labels of various products. The app provides admins and users to spot incorrectly labeled products by comparing the human input data label to the correct data in the database. Our goal is to correct human error and finds ways to allow for a more seamless factory line system. Our software system is planning to provide the best quality assurance of on-the-shelf goods and items for manufacturers.

# Database

1. Download XAMPP for free online at "https://www.apachefriends.org/"
2. Once downloaded and installed, open and click start on MySQL and apache.
3. Once done, open "localhost" on your web browser and open the phpmyadmin.
4. Once here, create a new database called "labeltech".
5. Open the new database and select the import option.
6. Download the labeltech.sql file in the server folder and select it inside the import option.
7. Once done you should have a new database set up for the project.

# To Use

1. Download Visual studio code
2. Open a new project/folder
3. Go to git bash in terminal
4. Type in “git clone -b main "https://github.com/SergejsZ/LabelTech.git"
5. Open two powershell terminal tabs in visual studio code.
6. Run npm install @google-cloud/storage in one terminal
7. Cd into the Labeltech folder for frontend. E.g “cd ./labeltech” and "./server"
8. Run “npm install” in both terminals
9. In the server powershell, run "npm start" and in the frontend, run "npm run dev"
10. Open localhost:3000 in your preferred browser
