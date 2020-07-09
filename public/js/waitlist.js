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
  if((referral !== "") && (!regEmail.test(referral) || referral !== email )){
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
  isEmailValid = validateEmail(referral, email)
  isReferralValid = validateReferral(referral)
  if(isNameValid && isEmailValid && isReferralValid){
    return true
  } else {
    return false
  }
}

addToWaitlist = async (db, name, email, betaAccess) => {
  await searchStore(db, email)
  .then((doc) => {
    if (doc.exists){
      location.reload()
      window.location.href="alreadyExists.html"
    }
    else {
      db.collection("waitlist").doc(email).set({
      name: name,
      email: email,
      betaAccess: betaAccess,
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

betaValue = formatBetaAccess(betaAccess.value)
var anonIn = false;
submit.addEventListener("click", (event) => {
  event.preventDefault()
  
  var submitReady = validateInputs(name.value, email.value, referral.value)
  if (submitReady && this.anonIn){
    addToWaitlist(db, name.value, email.value, formatBetaAccess(betaValue))
  }
})


loginAnon = () => {
    firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
    });
}

authChanged = () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            console.log('uid' + uid)
            this.anonIn = true
        }else{
            this.anonIn = false
        }
    });
}