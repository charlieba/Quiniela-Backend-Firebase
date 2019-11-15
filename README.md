# Quiniela Backends Project
The Quiniela backend project allows you to save, delete and remove soccer results, the idea is use this backend in the Soccer World Cup, the project is created with firebase function in NodeJS. 

## Installation
The requirements to use run this example are:
* NodeJS 12 or highest. 
* Setup the Firebase functions configuration, could be found [here](https://firebase.google.com/docs/functions/get-started).

## Usage
Each firebase function could be called one by one using a web browser, this is the way to call each function:

```
https://us-central1-MY_PROJECT.cloudfunctions.net/NameOfTheFunction?parameter=1 
```
The functions created in this project are:
* GetGroupByID: This functions allows get the list of member of a group by id.
* GetGroupsByUser: This funcionts allows you get the list of member of a group by a username.
* GetMembersByGroup: This funcionts allows you get the list of member of a group by a group id.
* JoinGroup: This functions allows add a member to a group.
* SetGroup: This functions allows creat a group.
* SetUser: This functions allows create a user. 

## Licensing
This project has created by me using firebase functions, anyone could add code and improve the project. 
