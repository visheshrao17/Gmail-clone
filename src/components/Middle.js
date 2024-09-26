import { List, ListItem, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import star from "../images/star.png";
import refresh from "../images/refresh.png";
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';
import remove from "../images/bin.png";
import yellow from "../images/yellow.png";
import snooze from "../images/snooze.png";

function Middle(props) {
  const [mailData, setMailData] = useState([]);
  const [show, setShow] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // For refresh animation
  const [alertShownCount, setAlertShownCount] = useState(0); // To track if the alert has been shown

  // Static mails to be displayed by default in the Inbox only
  const staticMails = [
    {
      id: 'welcome123',
      email: 'welcome@google.com',
      sender: 'Google',
      subject: 'Welcome to Google!',
      starred: false
    },
    {
      id: 'lastlogin456',
      email: 'security@google.com',
      sender: 'Google',
      subject: 'Your Last Login Information',
      starred: false
    },
    {
      id: 'welcomeback789',
      email: 'no-reply@google.com',
      sender: 'Google',
      subject: 'Welcome Back to Google Services',
      starred: false
    },
    {
      id: 'services123',
      email: 'services@google.com',
      sender: 'Google Services',
      subject: 'Updates to Google Services',
      starred: false
    },
    {
      id: 'support123',
      email: 'support@google.com',
      sender: 'Google Support',
      subject: 'How Can We Help You?',
      starred: false
    }
  ];

  const deleteMail = async (data) => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageDoc = doc(userDoc, "Inbox", `${data.id}`);
    const starredDoc = doc(userDoc, "Starred", `${data.id}`);
    const snoozedDoc = doc(userDoc, "Snoozed", `${data.id}`);
    try {
      await deleteDoc(starredDoc);
      await deleteDoc(snoozedDoc);
      await deleteDoc(messageDoc);
    } catch (err) {
      console.error(err);
    }
  };

  const getMail = async () => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageDoc = collection(userDoc, `${props.subCollect ? props.subCollect : "Inbox"}`);
    try {
      const data = await getDocs(messageDoc);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));

      // Show static mails only in Inbox
      const combinedMailData = props.subCollect === "Inbox"
        ? [...filteredData, ...staticMails]
        : [...filteredData];
      
      setMailData(combinedMailData.reverse()); // New emails at the top
    } catch (err) {
      console.error(err);
    }
  };

  const starred = async (data) => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageDoc = doc(userDoc, "Starred", `${data.id}`);
    try {
      await setDoc(messageDoc, {
        email: data.email,
        sender: data.sender,
        starred: "true"
      });
      data.starred = true; // Mark as starred
      setMailData([...mailData]); // Update the UI
    } catch (err) {
      console.error(err);
    }
  };

  const removeStarred = async (data) => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageDoc = doc(userDoc, "Starred", `${data.id}`);
    try {
      await deleteDoc(messageDoc);
      data.starred = false; // Mark as unstarred
      setMailData([...mailData]); // Update the UI
    } catch (err) {
      console.error(err);
    }
  };

  const snoozed = async (data) => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    const messageDoc = doc(userDoc, "Snoozed", `${data.id}`);
    const snoozeDoc = doc(userDoc, "Inbox", `${data.id}`);
    try {
      await deleteDoc(snoozeDoc);
      await setDoc(messageDoc, {
        email: data.email,
        sender: data.sender,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMail();
  }, [props.subCollect]);

  // Handle refresh animation and refresh mail data
  const handleRefresh = () => {
    setIsRefreshing(true);
    getMail(); // Call to refresh mail data
    setTimeout(() => setIsRefreshing(false), 1000); // Animation duration of 1s
  };

  // Function to show the alert only once
  const showAlertOnce = () => {
      alert("Can't open, work in progress");
      setAlertShownCount(alertShownCount+1);
  };

  return (
    <div style={{ marginLeft: "2.9vw", width: '75vw' }}>
      <img
        src={refresh}
        onClick={handleRefresh}
        style={{
          width: "1.5vw",
          height: "1.5vw",
          marginLeft: "1.5vw",
          marginTop: "2vw",
          cursor: "pointer",
          transition: "transform 1s",
          transform: isRefreshing ? "rotate(360deg)" : "none" // Rotate animation
        }}
      />
      {mailData.map((data) => (
        <Paper
          key={data.id}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          elevation={0}
          style={{ backgroundColor: "#F8FCFF", borderBottom: "1px solid #EFEFEF", borderTop: "1px solid #EFEFEF" }}
        >
          <ListItem>
            {data.starred
              ? <img onClick={() => removeStarred(data)} src={yellow} style={{ cursor: "pointer", width: "1.4vw", height: "1.4vw" }} />
              : <img onClick={() => starred(data)} src={star} style={{ cursor: "pointer", width: "1.4vw", height: "1.4vw" }} />}
            <span 
              style={{ fontSize: "1.3vw", marginLeft: "1.2vw", fontWeight: "500", cursor: "pointer" }} 
              onClick={showAlertOnce}
            >
              {data.sender}
              <span 
                style={{ marginLeft: "12vw", fontWeight: "200", cursor: "pointer" }} 
                onClick={showAlertOnce}
              >
                {data.email}
              </span>
              <span 
                style={{ marginLeft: "2vw", fontWeight: "200", fontStyle: "italic", cursor: "pointer" }} 
                onClick={showAlertOnce}
              >
                {data.subject}
              </span>
            </span>
            {show && <img onClick={() => snoozed(data)} src={snooze} style={{ marginLeft: "1vw", width: "1.3vw", height: "1.3vw", cursor: "pointer" }} />}
            {/* {show && <img onClick={() => deleteMail(data)} src={remove} style={{ width: "1.1vw", height: "1.1vw", marginLeft: "1vw", cursor: "pointer" }} />} */}
          </ListItem>
        </Paper>
      ))}

      <h6 style={{ fontWeight: "400", marginLeft: "28vw", fontSize: "1vw" }}>Terms · Privacy · Program Policies</h6>
    </div>
  );
}

export default Middle;






// import { List, ListItem, Paper } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import star from "../images/star.png";
// import refresh from "../images/refresh.png";
// import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
// import { auth, database } from '../firebase/setup';
// import remove from "../images/bin.png";
// import yellow from "../images/yellow.png";
// import snooze from "../images/snooze.png";

// function Middle(props) {

//   const [mailData, setMailData] = useState([]);
//   const [show, setShow] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false); // For refresh animation

//   // Static mails to be displayed by default in the Inbox only
//   const staticMails = [
//     {
//       id: 'welcome123',
//       email: 'welcome@google.com',
//       sender: 'Google',
//       subject: 'Welcome to Google!',
//       starred: false
//     },
//     {
//       id: 'lastlogin456',
//       email: 'security@google.com',
//       sender: 'Google',
//       subject: 'Your Last Login Information',
//       starred: false
//     },
//     {
//       id: 'welcomeback789',
//       email: 'no-reply@google.com',
//       sender: 'Google',
//       subject: 'Welcome Back to Google Services',
//       starred: false
//     },
//     {
//       id: 'services123',
//       email: 'services@google.com',
//       sender: 'Google Services',
//       subject: 'Updates to Google Services',
//       starred: false
//     },
//     {
//       id: 'support123',
//       email: 'support@google.com',
//       sender: 'Google Support',
//       subject: 'How Can We Help You?',
//       starred: false
//     }
//   ];

//   const deleteMail = async (data) => {
//     const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
//     const messageDoc = doc(userDoc, "Inbox", `${data.id}`);
//     const starredDoc = doc(userDoc, "Starred", `${data.id}`);
//     const snoozedDoc = doc(userDoc, "Snoozed", `${data.id}`);
//     try {
//       await deleteDoc(starredDoc);
//       await deleteDoc(snoozedDoc);
//       await deleteDoc(messageDoc);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const getMail = async () => {
//     const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
//     const messageDoc = collection(userDoc, `${props.subCollect ? props.subCollect : "Inbox"}`);
//     try {
//       const data = await getDocs(messageDoc);
//       const filteredData = data.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id
//       }));

//       // Show static mails only in Inbox
//       const combinedMailData = props.subCollect === "Inbox"
//         ? [...filteredData, ...staticMails]
//         : [...filteredData];
      
//       setMailData(combinedMailData.reverse()); // New emails at the top
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const starred = async (data) => {
//     const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
//     const messageDoc = doc(userDoc, "Starred", `${data.id}`);
//     try {
//       await setDoc(messageDoc, {
//         email: data.email,
//         sender: data.sender,
//         starred: "true"
//       });
//       data.starred = true; // Mark as starred
//       setMailData([...mailData]); // Update the UI
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const snoozed = async (data) => {
//     const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
//     const messageDoc = doc(userDoc, "Snoozed", `${data.id}`);
//     const snoozeDoc = doc(userDoc, "Inbox", `${data.id}`);
//     try {
//       await deleteDoc(snoozeDoc);
//       await setDoc(messageDoc, {
//         email: data.email,
//         sender: data.sender,
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     getMail();
//   }, [props.subCollect]);

//   // Handle refresh animation and refresh mail data
//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     getMail(); // Call to refresh mail data
//     setTimeout(() => setIsRefreshing(false), 1000); // Animation duration of 1s
//   };

//   return (
//     <div style={{ marginLeft: "2.9vw", width: '75vw' }}>
//       <img
//         src={refresh}
//         onClick={handleRefresh}
//         style={{
//           width: "1.5vw",
//           height: "1.5vw",
//           marginLeft: "1.5vw",
//           marginTop: "2vw",
//           cursor: "pointer",
//           transition: "transform 1s",
//           transform: isRefreshing ? "rotate(360deg)" : "none" // Rotate animation
//         }}
//       />
//       {mailData.map((data) => (
//         <Paper
//           key={data.id}
//           onMouseEnter={() => setShow(true)}
//           onMouseLeave={() => setShow(false)}
//           elevation={0}
//           style={{ backgroundColor: "#F8FCFF", borderBottom: "1px solid #EFEFEF", borderTop: "1px solid #EFEFEF" }}
//         >
//           <ListItem>
//             {data.starred
//               ? <img src={yellow} style={{ cursor: "pointer", width: "1.4vw", height: "1.4vw" }} />
//               : <img onClick={() => starred(data)} src={star} style={{ cursor: "pointer", width: "1.4vw", height: "1.4vw" }} />}
//             <span 
//               style={{ fontSize: "1.3vw", marginLeft: "1.2vw", fontWeight: "500" }} 
//               onClick={() => alert("Can't open, work in progress")}
//             >
//               {data.sender}
//               <span 
//                 style={{ marginLeft: "12vw", fontWeight: "200" }} 
//                 onClick={() => alert("Can't open, work in progress")}
//               >
//                 {data.email}
//               </span>
//               <span 
//                 style={{ marginLeft: "2vw", fontWeight: "200", fontStyle: "italic" }} 
//                 onClick={() => alert("Can't open, work in progress")}
//               >
//                 {data.subject}
//               </span>
//             </span>
//             {show && <img onClick={() => snoozed(data)} src={snooze} style={{ marginLeft: "1vw", width: "1.3vw", height: "1.3vw", cursor: "pointer" }} />}
//             {show && <img onClick={() => deleteMail(data)} src={remove} style={{ width: "1.1vw", height: "1.1vw", marginLeft: "1vw", cursor: "pointer" }} />}
//           </ListItem>
//         </Paper>
//       ))}

//       <h6 style={{ fontWeight: "400", marginLeft: "28vw", fontSize: "1vw" }}>Terms · Privacy · Program Policies</h6>
//     </div>
//   );
// }

// export default Middle;
