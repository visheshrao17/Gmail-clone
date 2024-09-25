
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import calendar from "../images/calendar.png";
import closeIcon from "../images/close.png"; // Import close icon
import { auth, database } from '../firebase/setup';
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "25vw", // Adjust width for square shape
  height: "25vw", // Set height equal to width for a square
  bgcolor: 'background.paper',
  padding: "1vw",
  borderRadius: "1vw",
  boxShadow: 24, // Optional: Add shadow for better visibility
};

export default function Event() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [event, setEvent] = React.useState("");
  const [date, setDate] = React.useState("");
  const [eventData, setEventData] = React.useState([]);
  const [loadingAdd, setLoadingAdd] = React.useState(false); // Loading state for adding event
  const [loadingShow, setLoadingShow] = React.useState(false); // Loading state for showing events

  const addEvent = async () => {
    setLoadingAdd(true);  // Start loading
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageRef = collection(userDoc, "Event");
    try {
      console.log("try start")
      await addDoc(messageRef, {
        event: event,
        date: date
      })
      console.log("after try");
      handleClose(); // Close the modal after adding the event
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdd(false);  // Stop loading after event addition
    }
  }

  const showEvent = async () => {
    setLoadingShow(true); // Start loading for showing events
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageRef = collection(userDoc, "Event");
    try {
      const data = await getDocs(messageRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setEventData(filteredData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingShow(false); // Stop loading after fetching events
    }
  }

  return (
    <div>
      <img onClick={handleOpen} src={calendar} alt="Calendar" style={{ cursor: "pointer", width: "1.4vw", paddingTop: "2vw" }} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img 
            src={closeIcon} 
            alt="Close" 
            onClick={handleClose} 
            style={{ cursor: "pointer", position: "absolute", top: "1vw", right: "1vw", width: "2vw" }} 
          />
          <Typography sx={{ paddingTop: "3vw", fontSize: "1vw", color: "grey" }}>
            Add Events
          </Typography>
          <input onChange={(e) => setEvent(e.target.value)} placeholder='Event' style={{ outline: "none", fontSize: "1vw", width: "23vw", height: "2.5vw" }} />
          <input onChange={(e) => setDate(e.target.value)} type='date' style={{ outline: "none", fontSize: "1vw", width: "23vw", height: "2.5vw", marginTop: "0.5vw" }} />
          <Button onClick={addEvent} variant='contained' sx={{ fontSize: "1vw", width: "10vw", height: "2.5vw", marginTop: "1vw" }} >Add</Button>
          <Button onClick={showEvent} variant='contained' sx={{ fontSize: "1vw", width: "10vw", height: "2.5vw", marginTop: "1vw", marginLeft: "1vw" }} >Show</Button>
          <br />
          {/* Show loading message when adding event */}
          {loadingAdd && <Typography sx={{ fontSize: "1vw", color: "blue", marginTop: "1vw" }}>Adding event...</Typography>}
          
          {/* Show loading message when fetching events */}
          {loadingShow && <Typography sx={{ fontSize: "1vw", color: "blue", marginTop: "1vw" }}>Loading...</Typography>}
          
          {/* Display event data */}
          {eventData.map((data) => {
            return (
              <li key={data.id} style={{ marginTop: "0.5vw", fontSize: "1vw" }}>{data.event}<span> - {data.date}</span></li>
            );
          })}
        </Box>
      </Modal>
    </div>
  );
}

