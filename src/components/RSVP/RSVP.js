import { motion } from "framer-motion";
import GuestLookup from "./GuestLookup";
import guestList from "../../api/guest-list.json";
import GuestsAttending from "./GuestsAttending";
import { useState } from "react";
import MealPreferences from "./MealPreferences";
import CompleteRSVP from "./CompleteRSVP";
import ConfirmationPage from "./ConfirmationPage";

function RSVP() {
  const [step, setStep] = useState("Guest lookup");
  const [guestSelected, setGuestSelected] = useState(null);
  const [guestRSVP, setGuestRSVP] = useState({});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        width: "100vw",
        marginTop: -5,
      }}
    >
      {step === "Guest lookup" && (
        <GuestLookup
          guestList={guestList}
          setStep={setStep}
          step={step}
          setGuestSelected={setGuestSelected}
        />
      )}
      {step === "Guests attending" && (
        <GuestsAttending
          guestList={guestList}
          setStep={setStep}
          guestSelected={guestSelected}
          setGuestSelected={setGuestSelected}
          setGuestRSVP={setGuestRSVP}
        />
      )}
      {step === "Meal preferences" && (
        <MealPreferences
          // guestList={guestList}
          setStep={setStep}
          // step={step}
          // guestSelected={guestSelected}
          // setGuestSelected={setGuestSelected}
          guestRSVP={guestRSVP}
          setGuestRSVP={setGuestRSVP}
        />
      )}
      {step === "Confirmation page" && (
        <ConfirmationPage setStep={setStep} guestRSVP={guestRSVP} />
      )}
      {step === "Complete RSVP" && (
        <CompleteRSVP setStep={setStep} guestRSVP={guestRSVP} />
      )}
    </motion.div>
  );
}

export default RSVP;
