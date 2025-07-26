import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollToHeader } from "./rsvp-utils";

function GuestLookup({ guestList, setStep, setGuestSelected }) {
  const [query, setQuery] = useState("");
  const [matchingNames, setMatchingNames] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useScrollToHeader(60);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setMatchingNames(null);
    setHasSearched(false);
  };

  const onSearchNameClick = () => {
    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery.length === 0) {
      setMatchingNames([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);

    const queryTokens = normalizedQuery.split(/\s+/);

    const matches = guestList.filter((entry) => {
      const individuals = entry.name.toLowerCase().split(/\s*(?:&|and|,)\s*/);

      return individuals.some((person) => {
        const personTokens = person.split(/\s+/);
        for (
          let start = 0;
          start <= personTokens.length - queryTokens.length;
          start++
        ) {
          let allMatch = true;
          for (let i = 0; i < queryTokens.length; i++) {
            if (!personTokens[start + i]?.startsWith(queryTokens[i])) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) return true;
        }

        return false;
      });
    });

    if (queryTokens.length === 1 && matches.length > 1) {
      setMatchingNames([]);
      return;
    }

    setMatchingNames(matches.slice(0, 3));
  };

  function onNameClick(guestName) {
    setStep("Guests attending");
    setGuestSelected(guestName);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-container rsvp">
        <h4 style={{ fontWeight: 600, textAlign: "center", marginBottom: 10 }}>
          Enter your full name
        </h4>
        <p style={{ textAlign: "center" }}>
          You will be able to RSVP for other members of your party as well.
        </p>

        <div
          style={{
            position: "relative",
            width: 300,
            marginTop: 10,
          }}
        >
          {/* Input Wrapper */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="Ex. Amber Martinez"
              style={{
                width: "100%",
                padding: "8px 36px 8px 10px",
                fontSize: 19,
                fontWeight: 500,
                boxSizing: "border-box",
                lineHeight: "normal",
                height: 40,
                display: "block",
              }}
              onChange={handleInputChange}
              value={query}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchNameClick();
              }}
              onBlur={onSearchNameClick}
            />

            <img
              src="/images/arrow-enter.png"
              alt="Enter"
              style={{
                height: 18,
                width: 18,
                display: "inline-block",
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={onSearchNameClick}
            />
          </div>

          {/* Results or No Match */}
          <AnimatePresence initial={false}>
            {hasSearched && matchingNames?.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginTop: 8,
                  fontStyle: "italic",
                  fontSize: 16,
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  textAlign: "left",
                  padding: "4px 8px",
                }}
              >
                No results. Please try again with your full name as indicated on
                your invitation.
              </motion.p>
            )}

            {matchingNames?.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  padding: 0,
                  listStyle: "none",
                  borderRadius: 4,
                  overflowY: "auto",
                  zIndex: 1000,
                  background: "#fff",
                }}
              >
                {matchingNames.map((entry) => (
                  <motion.li
                    key={entry.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: "6px 8px",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: 19,
                    }}
                    className="dropdown"
                    onClick={() => {
                      onNameClick(entry.name);
                      setMatchingNames([]);
                    }}
                  >
                    {entry.name}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default GuestLookup;
