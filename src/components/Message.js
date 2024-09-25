


import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import pen from "../images/pen.png";
import closeIcon from "../images/close.png"; // Import the close icon
import { TextField } from '@mui/material';
import { addDoc, collection, doc } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';

const style = {
  position: 'absolute',
  top: '61%',
  left: '71%',
  transform: 'translate(-50%, -50%)',
  width: "40vw",
  height: "35vw",
  minHeight: "505px",
  bgcolor: 'background.paper',
  padding: "1vw",
  borderRadius: "1vw",
};

export default function Message() {
  const [open, setOpen] = React.useState(false);
  const [mailId, setMailId] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsSending(false);
    setStatusMessage("");
  };

  const send = async () => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageRef = collection(userDoc, "Send");

    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    try {
      await addDoc(messageRef, {
        email: message,
        subject: subject || "(No subject)",
        timestamp: new Date(),
      });
      console.log("Message saved in 'Send' collection.");
    } catch (err) {
      console.error("Error in send:", err);
    }
  };

  const inbox = async () => {
    if (!mailId.trim()) {
      alert("Please enter a recipient email.");
      return;
    }

    if (!mailId.endsWith("@gmail.com") && !mailId.endsWith("edu.in") && !mailId.endsWith(".co")) {
      alert("Please enter a valid email address (must end with '@gmail.com', '@edu.in', or '.co').");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setIsSending(true);
    setStatusMessage("Sending Mail...");

    const userDoc = doc(database, "Users", `${mailId}`);
    const messageRef = collection(userDoc, "Inbox");

    try {
      await addDoc(messageRef, {
        email: message,
        sender: auth.currentUser?.email,
        subject: subject || "(No subject)",
        timestamp: new Date(),
      });
      console.log("Message sent to Inbox.");
      await send();
      setStatusMessage("Mail sent successfully!");
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Error in inbox:", err);
      setStatusMessage("Failed to send mail.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div onClick={handleOpen} style={{
        cursor: 'pointer', height: "4.5vw", marginLeft: "1vw",
        width: "12vw", display: "flex", alignItems: "center",
        borderRadius: "20px", backgroundColor: "#BEE0FF"
      }}>
        <img src={pen} style={{ width: "1.2vw", marginLeft: "2vw" }} alt="Compose" />
        <h4 style={{ marginLeft: "1.6vw", fontWeight: "400", fontSize: '1.3vw' }}>Compose</h4>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography style={{
            backgroundColor: "#EDF9FF", position: 'absolute',
            top: "0", left: "0", width: "41vw", padding: "0.5vw", fontSize: "1vw",
            borderRadius:"1vw"
          }}>
            New Message
            <img 
              src={closeIcon} 
              alt="Close" 
              style={{ 
                position: 'absolute', 
                top: '5px', 
                right: '5px', 
                width: '20px', 
                height: '20px', 
                cursor: 'pointer' 
              }} 
              onClick={handleClose} // Add onClick event to close the modal
            />
          </Typography>
          <TextField 
            onChange={(e) => setMailId(e.target.value)} 
            variant='standard' 
            label="To" 
            sx={{ width: "39vw", marginTop: "1vw" }} 
          />
          <br />
          <TextField 
            onChange={(e) => setSubject(e.target.value)} 
            variant='standard' 
            label="Subject" 
            sx={{ width: "39vw" }} 
          />
          <br />
          <TextField 
            onChange={(e) => setMessage(e.target.value)} 
            multiline rows={12} 
            sx={{ width: "39vw", "& fieldset": { border: "none" } }} 
            placeholder="Type your message here"
          />
          <br />

          {isSending && <Typography sx={{ marginBottom: "1vw", color: "blue" }}>{statusMessage}</Typography>}

          <Button 
            onClick={inbox} 
            variant='contained' 
            sx={{
              borderRadius: "6vw",
              fontSize: "1vw", width: "4vw", height: "3vw",
              marginTop: "1vw"
            }}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
