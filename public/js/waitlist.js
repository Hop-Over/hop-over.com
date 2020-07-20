const db = firebase.firestore();
const name = document.getElementById("name")
const email = document.getElementById("email")
const beta = document.getElementById("beta")
const referral = document.getElementById("reference")
const submit = document.getElementById("joinWaitlistButton")
var anonIn = false;

validateName = (name) => {
    var regName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const error = document.getElementById("name-error")

    if((name === "")){
      error.classList.remove('text-hidden')
      error.classList.add('help-block')
      error.classList.add('text-danger')
      return false;
    } else {
      error.classList.remove('help-block')
      error.classList.remove('text-danger')
      error.classList.add('text-hidden')
      return true ;
    }
}

validateEmail = (email) => {
  var regEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  const error = document.getElementById("email-error")
  if(!regEmail.test(email)){
    error.classList.remove('text-hidden')
    error.classList.add('help-block')
    error.classList.add('text-danger')
    return false;
  } else {
    error.classList.remove('help-block')
    error.classList.remove('text-danger')
    error.classList.add('text-hidden')
    return true;
  }
}


validateReferral = (referral, email) => {
  var regEmail = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  const error = document.getElementById("referral-error")

  if(referral !== "" && (!regEmail.test(referral) || referral === email )){
    error.classList.remove('text-hidden')
    error.classList.add('help-block')
    error.classList.add('text-danger')
    return false;
  } else {
    error.classList.remove('help-block')
    error.classList.remove('text-danger')
    error.classList.add('text-hidden')
    return true;
  }
}

validateInputs = (name, email, referral) => {
  isNameValid = validateName(name)
  isEmailValid = validateEmail(email)
  isReferralValid = validateReferral(referral, email)
  if(isNameValid && isEmailValid && isReferralValid){
    return true
  } else {
    return false
  }
}

updateReferralNumber = async (db,referralEmail) => {
  await searchStore(db, referralEmail)
  .then((doc) => {
      console.log(doc.data())
    if (doc.exists){
      var referralUser = doc.data()
      db.collection("waitlist").doc(referralEmail).set({
      referrals: referralUser.referrals + 1
    }, { merge: true })
    }
  })
}

addToWaitlist = async (db, name, email, referralEmail,betaAccess) => {
  await searchStore(db, email)
  .then((doc) => {
    if (doc.exists){
      location.reload()
      window.location.href="welcome-back.html"
    }
    else {
      db.collection("waitlist").doc(email).set({
      name: name,
      email: email,
      betaAccess: betaAccess,
      referralEmail: referralEmail,
      referrals: 0
      })
      .then(function() {
        location.reload()
        window.location.href="thanks.html"
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

submit.addEventListener("click", (event) => {
  event.preventDefault()

  var submitReady = validateInputs(name.value, email.value, referral.value)
  if (submitReady && anonIn){
    if(referral.value !== ""){
        updateReferralNumber(db, referral.value)
      }
    addToWaitlist(db, name.value, email.value, referral.value, beta.checked)
  }
})


loginAnon = () => {
    firebase.auth().signInAnonymously()
    .then(function(response){
        // console.log('Authenticated')
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        anonIn = true
    }else{
        anonIn = false
    }
});
