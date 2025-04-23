import Home from "./components/Home";
import LoveStory from "./components/LoveStory";
import Navigation from "./components/Nav";
import Travel from "./components/Travel";
import Events from "./components/Events";
import { Routes, Route } from "react-router-dom";
import HonoredGuests from "./components/honored-guests/HonoredGuests";
import Gifts from "./components/Gifts";
import RSVP from "./components/RSVP";
import Attire from "./components/attire/Attire";
import FAQs from "./components/FAQS/FAQs";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navigation></Navigation>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/travel" element={<Travel />}></Route>
        <Route exact path="/love-story" element={<LoveStory />}></Route>
        <Route exact path="/events" element={<Events />}></Route>
        <Route exact path="/attire" element={<Attire />}></Route>
        <Route exact path="/honored-guests" element={<HonoredGuests />}></Route>
        <Route exact path="/gifts" element={<Gifts />}></Route>
        <Route exact path="/FAQ" element={<FAQs />}></Route>
        <Route exact path="/rsvp" element={<RSVP />}></Route>
      </Routes>
    </div>
  );
}

export default App;
