


import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import tasks from "../images/tasks.png";
import closeIcon from "../images/close.png"; // Import the close icon
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';

const style = {
  position: 'absolute',
  top: '50%',
  left: '92%',
  transform: 'translate(-50%, -50%)',
  width: "14vw",
  minHeight: "650px",
  bgcolor: 'background.paper',
  padding: "1vw",
  borderRadius: "1vw", // Add border radius
};

export default function Notes() {
  const [open, setOpen] = React.useState(false);
  const [loadingAdd, setLoadingAdd] = React.useState(false);
  const [loadingShow, setLoadingShow] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [notesData, setNotesData] = React.useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addNote = async () => {
    if (notes.trim() === "") {
      alert("Please enter a note.");
      return;
    }

    setLoadingAdd(true);
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageRef = collection(userDoc, "Notes");
    try {
      await addDoc(messageRef, { notes });
      setNotes(""); // Clear the input after adding
      showNotes(); // Refresh the notes
      handleClose(); // Close the modal after adding
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdd(false);
    }
  };

  const showNotes = async () => {
    setLoadingShow(true);
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageRef = collection(userDoc, "Notes");
    try {
      const data = await getDocs(messageRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotesData(filteredData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingShow(false);
    }
  };

  return (
    <div>
      <img
        onClick={handleOpen}
        src={tasks}
        style={{ cursor: "pointer", width: "1.4vw", paddingTop: "2vw" }}
        alt="tasks"
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            onClick={handleClose}
            src={closeIcon}
            style={{ cursor: "pointer", width: "2vw", position: "absolute", top: "1vw", right: "1vw" }}
            alt="close"
          />
          <Typography sx={{ paddingTop: "3vw", fontSize: "1vw", color: "grey" }}>
            Add Notes
          </Typography>
          <input
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
            placeholder="Notes"
            style={{ outline: "none", fontSize: "1vw", width: "11vw", height: "1.5vw" }}
          />
          <Button
            onClick={addNote}
            variant="contained"
            sx={{ fontSize: "1vw", width: "4vw", height: "2vw", marginTop: "1vw" }}
          >
            Add
          </Button>
          <Button
            onClick={showNotes}
            variant="contained"
            sx={{ fontSize: "1vw", width: "4vw", height: "2vw", marginTop: "1vw" }}
          >
            Show
          </Button>

          {loadingAdd && (
            <Typography sx={{ fontSize: "1vw", color: "blue", marginTop: "1vw" }}>
              Adding to notes...
            </Typography>
          )}

          {loadingShow && (
            <Typography sx={{ fontSize: "1vw", color: "blue", marginTop: "1vw" }}>
              Loading
              <span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
            </Typography>
          )}

          <ul>
            {notesData.map((data) => (
              <li key={data.id} style={{ marginTop: "0.5vw", fontSize: "1vw" }}>
                {data.notes}
              </li>
            ))}
          </ul>
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
