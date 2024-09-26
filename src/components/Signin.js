import { Button } from "@mui/material";
import React from "react";
import social from "../images/googlewb.png";
import { signInWithPopup } from "firebase/auth";
import { auth, database, googleProvider } from "../firebase/setup";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

function Signin() {
  const navigate = useNavigate();

  const addUser = async () => {
    const userDoc = doc(database, "Users", `${auth.currentUser?.email}`);
    try {
      await setDoc(userDoc, {
        username: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        id: auth.currentUser?.uid,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const googleSignin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      addUser();
      navigate("/main");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // <div style={{ position: "absolute", left: "28%", padding: "110px" }}>
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // padding: "100px 20px",
    backgroundColor: "#f5f5f5",
    height: "100vh",
  }}
>
  <div
    style={{
      border: "1px solid #e0e0e0",
      padding: "30px",
      textAlign: "center",
      borderRadius: "10px",
      minHeight: "350px",
      maxWidth: "400px",
      backgroundColor: "#fff",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    }}
  >
    <img style={{ width: "150px", marginBottom: "20px" }} src={social} alt="Google Icon" />
    <h2 style={{ fontWeight: "400", marginBottom: "10px", color: "#333" }}>
      Create your Google Clone Account
    </h2>
    <h3 style={{ fontWeight: "300", marginBottom: "30px", color: "#666" }}>
      Click the Sign-in button below
    </h3>
    <Button
      onClick={googleSignin}
      variant="contained"
      style={{
        backgroundColor: "#4285F4",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        fontWeight: "500",
        textTransform: "none",
      }}
    >
      Sign in with Google
    </Button>
  </div>
</div>

  );
}

export default Signin;
