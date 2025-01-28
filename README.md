Installation Instructions

Prerequisites:
Before starting, ensure the following are installed on your system:

1. Node.js: https://nodejs.org.
    Verify node and npm installations with:
       node -v
       npm -v
2. Git: (Optional) For cloning the repository.
    Download and install Git from git-scm.com.
    Verify git installation with:
       git --version


Steps to Install Common Ground:
1. Clone Repository or Download Zip.
   Choose one of the following options.
   1. Clone
      1. git clone https://github.com/annajauras/CommonGround.git
   2. Download zip file
      1. Go to the repository page and click "Code" > "Download ZIP".
      2. Extract the zip file to your desired location.
2. Install Dependencies
   1. Navigate to CommonGround/server:
     cd server
   2. Install server dependencies:
     npm install
   3. Navigate to CommonGround/client:
     cd ../client
   4. Install client dependencies:
     npm install

3. Configure Environment Variables
   1. In the server folder, create a .env
   2. Add necessary environment variables. The current default is:
      PORT=3001
      CLIENT_URL=http://localhost:3000 
4. Start the Backend Server
     1. Navigate to CommonGround/server:
       cd ../server
     2. Start the backend server:
       npm start
5. Start the Frontend Server
     1. Navigate to CommonGround/client:
       cd ../client
     2. Start the React development server:
       npm start
6. Test in Browser
   Open your browser and navigate to the frontend URL (current default: http://localhost:3000). 

   
