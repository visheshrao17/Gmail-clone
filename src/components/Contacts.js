

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import user from "../images/user.png";
import closeIcon from "../images/close.png"; // Import close icon
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "25vw", // Adjust width as needed
  minHeight: "400px", // Set minimum height
  bgcolor: 'background.paper',
  padding: "2vw",
  borderRadius: "1vw",
  boxShadow: 24, // Optional: Add shadow for better visibility
};

export default function Contacts() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [contactsData, setContactsData] = React.useState([]);
  const [loadingAdd, setLoadingAdd] = React.useState(false); // Loading state for adding contact
  const [loadingShow, setLoadingShow] = React.useState(false); // Loading state for showing contacts

  const addContacts = async () => {
    setLoadingAdd(true); // Start loading
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageRef = collection(userDoc, "Contacts");
    try {
      await addDoc(messageRef, {
        name: name,
        mobile: mobile
      });
      handleClose(); // Close the modal after adding the contact
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdd(false); // Stop loading after successful addition
    }
  };

  const showContacts = async () => {
    setLoadingShow(true); // Start loading for showing contacts
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageRef = collection(userDoc, "Contacts");
    try {
      const data = await getDocs(messageRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setContactsData(filteredData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingShow(false); // Stop loading after fetching contacts
    }
  };

  return (
    <div>
      <img onClick={handleOpen} src={user} alt="User" style={{ cursor: "pointer", width: "1.4vw", paddingTop: "2vw" }} />
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
          <Typography sx={{ paddingTop: "3vw", fontSize: "1.2vw", color: "grey" }}>
            Add Contacts
          </Typography>
          <input onChange={(e) => setName(e.target.value)} placeholder='Name' style={{ outline: "none", fontSize: "1vw", width: "23vw", height: "2.5vw", marginTop: "1vw" }} />
          <input onChange={(e) => setMobile(e.target.value)} placeholder='Mobile' style={{ outline: "none", fontSize: "1vw", width: "23vw", height: "2.5vw", marginTop: "1vw" }} />
          <Button onClick={addContacts} variant='contained' sx={{ fontSize: "1vw", width: "10vw", height: "2.5vw", marginTop: "1vw" }} >Add</Button>
          <Button onClick={showContacts} variant='contained' sx={{ fontSize: "1vw", width: "10vw", height: "2.5vw", marginTop: "1vw", marginLeft: "1vw" }} >Show</Button>
          
          {/* Show loading message when adding a contact */}
          {loadingAdd && <Typography sx={{ fontSize: "1vw", color: "blue", marginTop: "1vw" }}>Adding to contact...</Typography>}
          
          {/* Show loading message when fetching contacts */}
          {loadingShow && (
            <Typography sx={{ fontSize: "1vw", color: "blue", marginTop: "1vw" }}>
              Loading
              <span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
            </Typography>
          )}
          
          {/* Display contacts data */}
          {contactsData.map((data) => {
            return (
              <li key={data.id} style={{ marginTop: "0.5vw", fontSize: "1vw" }}>
                - {data.name} <span> - {data.mobile}</span>
              </li>
            );
          })}
        </Box>
      </Modal>

      <style>
        {`
          .dot-blink {
            animation: blink 1s infinite;
          }
          
          @keyframes blink {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
