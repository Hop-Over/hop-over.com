const db = firebase.firestore();
const name = document.getElementById("name")
const email = document.getElementById("email")
const phone = document.getElementById("phone")
const message = document.getElementById("message")
const submit = document.getElementById("sendMessageButton")
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

validatePhone = (phone) => {
  var regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const error = document.getElementById("phone-error")
  if(!regPhone.test(phone)){
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

validateMessage = (message) => {
  const error = document.getElementById("message-error")
  if (message.length < 3){
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

validateInputs = (name, email, phone, message) => {
  isNameValid = validateName(name)
  isEmailValid = validateEmail(email)
  isPhoneValid = validatePhone(phone)
  isMessageValid = validateMessage(message)

  if(isNameValid && isEmailValid && isPhoneValid && isMessageValid){
    return true
  } else {
    return false
  }
}

contactUs = async (db, name, email, phone, message) => {
  const date = new Date();
  db.collection("contact").doc(date.toString()).set({
    name: email,
    email: email,
    phone: phone,
    message: message
  })
  .then(function() {
    location.reload()
    window.location.href="contact-submit.html"
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

submit.addEventListener("click", (event) => {
  event.preventDefault()
  var submitReady = validateInputs(name.value, email.value, phone.value, message.value)

  if (submitReady && anonIn){
    contactUs(db, name.value, email.value, phone.value, message.value)
  }
})


loginAnon = () => {
    firebase.auth().signInAnonymously()
    .then(function(response){
        console.log("Authenticated")
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
