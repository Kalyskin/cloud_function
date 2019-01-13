'use strict'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.database.ref('/Notifications/{pushId}')
    .onWrite((event,context) => {
        console.log('event', event);
        const message = event.after.val();
        const receiverToken = message.receiverToken;
        const body = message.body;
        const title = message.title;
        const pushId = context.params.pushId;

        
        //const getReceiverUidPromise = admin.auth().getUser(receiverUid);

        const payload = {
            notification: {
                title: title,
                body: body
            }
        };

        console.log("pushId:",pushId);

        admin.messaging().sendToDevice(receiverToken, payload)
            .then(function (response) {
                admin.database().ref(`/Notifications`).child(pushId).remove();
                console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
            });
    });