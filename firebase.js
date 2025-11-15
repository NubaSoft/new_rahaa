// // firebase.js
// import { initializeApp } from "firebase/app"
// import { getAuth } from "firebase/auth"
// import { getFirestore } from "firebase/firestore"

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC2qR0Q1_tZ1S6wYYvVBoszN5bbOFkFeP4",
//   authDomain: "mswy-dayt.firebaseapp.comm",
//   projectId: "mswy-dayt",
//   storageBucket: "mswy-dayt.appspot.com",
//   messagingSenderId: "375849000446",
//   appId: "1:375849000446:android:3cd4506c17f31e0b54b4af",
// }

// const app = initializeApp(firebaseConfig)
// const auth = getAuth(app)
// const firestore = getFirestore(app)
// // firebase.js
import { initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

const app = initializeApp();
export { app, messaging };


// export { app, auth, firestore }
