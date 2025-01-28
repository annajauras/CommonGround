Installation Instructions

Prerequisites
Before starting, ensure the following are installed on your system:

i. Node.js: https://nodejs.org/en
    Verify node and npm installations with:
       node -v
       npm -v
ii. Git: (Optional) For cloning the repository.
    Download and install Git from git-scm.com
    Verify git installation with:
       git --version


Steps to Install Common Ground:
1. Clone Repository or Download Zip
   Choose one of the following options.
   a. git clone https://github.com/username/CommonGround.git
or b. download zip file
      Go to the repository page and click "Code" > "Download ZIP".
      Extract the zip file to your desired location.
2.Install Dependencies
   a. Navigate to CommonGround/server
     cd server
   b. Install server dependencies
     npm install
   c. Navigate to CommonGround/client
     cd ../client
   d. Install client dependencies
     npm install

3. Configure Environment Variables
   a. In the server folder, create a .env
   b. Add necessary environment variables. The current default is:
      PORT=3001
      CLIENT_URL=http://localhost:3000 
4. Start the Backend Server
     a. Navigate to CommonGround/server
       cd ../server
     b Start the backend server
       npm start
5. Start the Frontend Server
     a. Navigate to CommonGround/client
       cd ../client
     b. Start the React development server
       npm start
6. Test in Browser
   Open your browser and navigate to the frontend URL (current default: http://localhost:3000). 


   
