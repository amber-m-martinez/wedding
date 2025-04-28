import Home from "./components/Home";
import LoveStory from "./components/LoveStory";
import Nav from "./components/Nav";
import Travel from "./components/Travel";
import Events from "./components/Events";
import { Routes, Route, Navigate } from "react-router-dom";
import HonoredGuests from "./components/honored-guests/HonoredGuests";
import Gifts from "./components/Gifts";
// import RSVP from "./components/RSVP";
import Attire from "./components/attire/Attire";
import FAQs from "./components/FAQS/FAQs";
import "./App.css";
import BridalParty from "./components/BridalParty";
// import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Nav></Nav>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/travel" element={<Travel />}></Route>
        <Route exact path="/love-story" element={<LoveStory />}></Route>
        <Route exact path="/events" element={<Events />}></Route>
        <Route exact path="/attire" element={<Attire />}></Route>
        <Route exact path="/honored-guests" element={<HonoredGuests />}></Route>
        <Route exact path="/gifts" element={<Gifts />}></Route>
        <Route exact path="/FAQ" element={<FAQs />}></Route>
        {/* <Route exact path="/rsvp" element={<RSVP />}></Route> */}
        <Route exact path="/bridal-party" element={<BridalParty />}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;
