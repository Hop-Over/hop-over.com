const credentials = require('./config.json')
const firebase = require("firebase");

firebase.initializeApp({
  apiKey: credentials.firebaseCreds.apiKey,
  authDomain: credentials.firebaseCreds.authDomain,
  projectId: credentials.firebaseCreds.projectId
});

const db = firebase.firestore();

addToWaitlist = (db, name, email, betaAccess) => {
  db.collection("waitlist").doc(email).set({
  name: name,
  email: email,
  betaAccess: betaAccess,
  referrals: 0
  })
  .then(function() {
    console.log("Successfully added to waitlist");
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

searchStore = (db,email) => {
  const ref = db.collection('waitlist').doc(email)
  ref.get()
  .then((doc) => {
    if (doc.exists){
      console.log("true")
    } else {
      console.log("false")
    }
  })
}



const name = "Bilal Qadar"
const email1 = "qadarbilal@gmail.com"
const email2 = "rameesha.qazi@gmail.com"

//addToWaitlist(db, name, email1, true)
console.log(searchStore(db, email2))
