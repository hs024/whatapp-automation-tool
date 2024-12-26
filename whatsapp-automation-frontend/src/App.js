import React from "react";
import Scheduler from "./components/Scheduler";
import Navbar from "./components/Navbar";
import BulkMessageSender from "./components/BulkMessageSender";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="App">
      <Navbar/>
      <BulkMessageSender />
      <Scheduler />
      <Footer/>
    </div>
  );
}

export default App;
