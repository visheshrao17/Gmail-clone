import React, { useState } from 'react';
import inbox from "../images/inbox.png";
import send from "../images/send.png";
import snooze from "../images/snooze.png";
import star from "../images/star.png";
import pen from "../images/pen.png";
import Message from './Message';

function Leftpanel(props) {
  // State to track the selected item
  const [selectedItem, setSelectedItem] = useState("Inbox");
  const [hoveredItem, setHoveredItem] = useState(null);

  // Helper function to apply styles based on hover or selected state
  const getItemStyle = (itemName) => ({
    backgroundColor: hoveredItem === itemName || selectedItem === itemName ? "#f0f0f0" : "transparent",
    color: selectedItem === itemName ? "#0073e6" : "black",
    fontWeight: selectedItem === itemName ? "bold" : "400",
    borderRadius: "5px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  });

  return (
    <div style={{position: "fixed", backgroundColor: "#F9F9F9", minHeight: "100vh", width: "19.6vw"}}>
      <Message />
      
      {/* Inbox Item */}
      <div
        style={{
          marginTop: "1vw",
          marginLeft: "0.8vw",
          width: "12vw",
          display: "flex",
          alignItems: "center",
          ...getItemStyle("Inbox"), // Apply hover/selected styles
        }}
        onMouseEnter={() => setHoveredItem("Inbox")}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => {
          setSelectedItem("Inbox");
          props.setSubCollect("Inbox");
        }}
      >
        <img src={inbox} style={{ width: "1.2vw", marginLeft: "2vw" }} alt="Inbox" />
        <span style={{ marginLeft: "1.6vw", fontSize: '1.3vw' }}>Inbox</span>
      </div>

      {/* Starred Item */}
      <div
        style={{
          marginTop: "1vw",
          marginLeft: "0.8vw",
          width: "12vw",
          display: "flex",
          alignItems: "center",
          ...getItemStyle("Starred"), // Apply hover/selected styles
        }}
        onMouseEnter={() => setHoveredItem("Starred")}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => {
          setSelectedItem("Starred");
          props.setSubCollect("Starred");
        }}
      >
        <img src={star} style={{ width: "1.2vw", marginLeft: "2vw" }} alt="Starred" />
        <span style={{ marginLeft: "1.6vw", fontSize: '1.3vw' }}>Starred</span>
      </div>

      {/* Snoozed Item */}
      <div
        style={{
          marginTop: "1vw",
          marginLeft: "0.8vw",
          width: "12vw",
          display: "flex",
          alignItems: "center",
          ...getItemStyle("Snoozed"), // Apply hover/selected styles
        }}
        onMouseEnter={() => setHoveredItem("Snoozed")}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => {
          setSelectedItem("Snoozed");
          props.setSubCollect("Snoozed");
        }}
      >
        <img src={snooze} style={{ width: "1.2vw", marginLeft: "2vw" }} alt="Snoozed" />
        <span style={{ marginLeft: "1.6vw", fontSize: '1.3vw' }}>Snoozed</span>
      </div>

      {/* Send Item */}
      <div
        style={{
          marginTop: "1vw",
          marginLeft: "0.8vw",
          width: "12vw",
          display: "flex",
          alignItems: "center",
          ...getItemStyle("Send"), // Apply hover/selected styles
        }}
        onMouseEnter={() => setHoveredItem("Send")}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => {
          setSelectedItem("Send");
          props.setSubCollect("Send");
        }}
      >
        <img src={send} style={{ width: "1.2vw", marginLeft: "2vw" }} alt="Send" />
        <span style={{ marginLeft: "1.6vw", fontSize: '1.3vw' }}>Send</span>
      </div>
    </div>
  );
}

export default Leftpanel;
