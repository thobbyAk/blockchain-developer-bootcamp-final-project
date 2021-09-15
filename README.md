# blockchain-developer-bootcamp-final-project
#  A Decentralized Voting System
#  Problem:
In my country (Nigeria), there's an alarming rate of election fraud and rigging. Many a times, there  are recorded issues of a single person voting across different pooling units and there's no proper system in place to curb such cheat since they're empowered by people in power and this shows no accounability. An electronic voting system was introduced some years back there's doubt in the ability of the system to secure the data and  also the possibility of the voting line being hijacked by hackers and hence, rigged.

# Solution:
A decentralised system where users register their details like date of birth, fullname and co, the system uses these details to generate a key pair for the users and this information can only be accessed with the users private key. Each user is only able to vote with his private key with which the system identifies each user uniquely. A user is verified that he hasnt voted before and his identifiction is genuine, otherwise his vote is discarded. The system is transparent, everyone can monitor how the whole voting process goes and the system is protected from outsiders or attacks. The only way to vote is if you have been verified by the system. 

# Questions
1. Database needed?
Yes a database is needed to store information of all the available users and to monitor the vote count
2. are there multiple writers?
Yes there are multiple writers on the system(the voters)
3. Do they have a conflicting intrest?
yes they have a conflicting intrest as different voters may have diffrent preference
4. can a 3rd Party be trusted?
No, a third party cannot be trusted with the personal infomation and not using the private key to place the vote on the users behalf
5. access control is not needed
6. Pubilc blockchain?
yes transactions have to be monitored in this case votes

# Workflow
1. a user registers on the platform (will call the application voteID) 
2. the user information are hashed and a key pair is generated and the private key is given to the user. only this key can be used to cast a vote
3. the user logs in to cast his vote, the sytem verifies the authencity of the user when the vote is cast
4. the state is updated and the consensus mechanism handles that. Consensus protocols allow the user to "save" that authenticity across time by facilitating the coordination of all network nodes around a global state. 
