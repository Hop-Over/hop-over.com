const db = firebase.firestore();
const name = document.getElementById("name")
const email = document.getElementById("email")
const betaAccess = document.getElementById("betaAccess")
const referral = document.getElementById("reference")
const submit = document.getElementById("joinWaitlistButton")

formatBetaAccess = (betaAccess) => {
  if (betaAccess !== "on"){
    return true
  } else {
    return false
  }
}

validateName = (name) => {
    var regName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    if(!regName.test(name)){
      return false;

    } else {
      return true ;
    }
}

validateEmail = (email) => {
	var regEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if(!regEmail.test(email)){
      return false;
    } else {
      return true;
    }
}

validateInputs = (name, email) => {
  isNameValid = validateName(name)
  isEmailValid = validateEmail(email)

  if(isNameValid && isEmailValid){
    return true
  } else {
    return false
  }
}

addToWaitlist = async (db, name, email, betaAccess) => {

  await searchStore(db, email)
  .then((doc) => {
    if (doc.exists){
      console.log("Already in Database")
      location.reload()
    }
    else {
      db.collection("waitlist").doc(email).set({
      name: name,
      email: email,
      betaAccess: betaAccess,
      referrals: 0
      })
      .then(function() {
        console.log("Successfully added to waitlist");
        location.reload()
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }
  })
}

searchStore = async (db,email) => {
  const ref = db.collection('waitlist').doc(email)
  response = await ref.get()
  return response
}

betaValue = formatBetaAccess(betaAccess.value)
submit.addEventListener("click", (event) => {
  event.preventDefault()
  addToWaitlist(db, name.value, email.value, formatBetaAccess(betaValue))
})
