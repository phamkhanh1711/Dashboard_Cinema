import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "./firebase.config";

export function handleUploadFile(file) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        reject(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            const imageUrl = url;

            resolve(imageUrl);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  });
}