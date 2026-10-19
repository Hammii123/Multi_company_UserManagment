import "dotenv/config";
import app from "./app.js";
import {connectDB} from "./config/db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {

  try{
      await connectDB();

      app.listen(PORT,()=>{
        console.log(`server running on port http://localhost:${PORT}`);
      });
  } catch(error){
    console.log("Failed to start application: ", error.message);
    process.exitCode = 1 ;

  }
}

startServer();