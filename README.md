# CSE Card Collector (Final Project by Team 30 aka Nerdy-Thirty)

## Overview:
Welcome to Nerdy-Thirty's (aka Team 30's) Final Project for CSE 110! Our project is a card collecting app, similar to mobile TCG games, with the main theme being Computer Science Engineering (CSE) Major professors from the University of California, San Diego. The app consists of a Shop to buy a single pack of a card, a Grid View displaying all of the collected cards, as well as a "Cookie Clicker"-esque minigame, used as the main source of obtaining currency that is used in the shop! With this project we aimed for it to be entertaining and fun, while also tying it to our overall CSE major, with the cards having small bios in the back about the professors and the course they're teaching.

## Installation Guide:
If you want to contribute to the project with your own implementation of features, you may do so by following these steps:
1. Fork the repository to your own account.
2. Use Git Bash or Visual Studio Code to clone the repository.
3. Once the repo has been cloned, make sure to run "npm install" on your terminal, to downloaded the necessary packages and look over *package.json*.
4. After performing the install, perform the command "npm run start" in order to start a local server on localhost:3000
5. Implement your features, making sure to include documentation code (that way it gives us an idea of what the code does without having to go the extra hurdles.)
6. Once you have tested and finished implementing working efficient code, make a Pull Request to your repo first, before doing a new PR to our branch. (Your PR will not be accepted until it passes all of the tests and a human review is done by at least one of our group members.)
Huzzah! With all of the steps completed in order, you have successfully made our project better in the process, and we thank you for it :)

## Important Project Notes

### Mobile Optimization 
The app has been optimized to be properly implemented and working on most types of mobile devices. These optimizations include:
- The header being edited to work as a side drawer on mobile devices, in order to improve screen readability and reducing clutter on small screens.
- Having functioning screen touches and taps working on devices, ensuring the app can still work as intended without a mouse of keyboard.
- Used responsive sizes for images and fonts to ensure they look good on all types of devices.

### Accessibility
The app includes some sense of accessibility by having keyboard binds that can be used instead of mouse clicking. These can be seen in the clicker page being able to play the clicker game with a button press, as well as the shop page, being able to buy packs, open them, and flip the card all with the press of keyboard buttons.

### Performance
The app has been tested on slow-working networks, using network throttling on 3g. While the core functionality of the app still works as intended, the site was not visually responsive, affecting the program's intended RAIL (Response, Animation, Idle, Load) values. However, the app was found to run well at slow 4g connection, running at an acceptable level with some images taking a bit longer than usual to load, which was not an issue for fast 4g.
We also switched the images from png to webp format, reducing their size greatly for faster loading times and improving the performance.

### Testability
Testing has been implemented for every page in the app, with a total of 48 individual tests, alongside several e2e tests (The codacy coverage shows only the unit tests, and not the e2e tests.)

### Compatability
The app has been checked for compatability in as many major browsers as possible like Chrome, Microsoft Edge, Firefox, and Safari to be as optimized as we can make it possible. 

### Coverage (Codacy)
Our coverage encompasses all of our js files that have functions/code in them, ensuring that as much of our code as possible is being tested and covered through the unit tests and e2e tests implemented.

## Important Pages:
[Team File](admin/team.md)

## Final Project
[Heroku Hosted Link](https://nerdity-thirty-c404d15cf7fe.herokuapp.com/)

### Videos
Final Project Video Public 
- [Youtube Link](https://youtu.be/M6opFgkmq4Y)

Final Project Video Private
- [Youtube Link](https://youtu.be/0g59zMxAVuw)

Status Video 1:
- [Youtube Link](https://youtu.be/UU8ilUeQxk4)
- [Repo Link](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/videos/statusvideo1.mp4)

### Codacy
[Codacy Dashboard](https://app.codacy.com/gh/cse110-sp25-group30/cse110-sp25-group30/dashboard)

## Documentation
### JSDocs
- [Page Link](https://cse110-sp25-group30.github.io/cse110-sp25-group30/)

### Rules
- [Rules Folder](https://github.com/cse110-sp25-group30/cse110-sp25-group30/tree/main/admin/misc)
- [Group Contract](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/misc/rules.md)

## Meetings
[Meetings Folder](https://github.com/cse110-sp25-group30/cse110-sp25-group30/tree/main/admin/meetings)
(The meeting notes alongside the sprint reviews and retrospectives have all been split into folders named after the weeks the sprint was partaking during in a mmdd format, ex. Spring 1 was through May 12th to May 18th, making 0512-0518 the folder for all Sprint 1 associated meetings.)

### Sprint Start Meetings
- [Meeting 1 - May 12th, 2025](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0512-0518/051225meeting.md)
- [Meeting 2 - May 19th, 2025](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0519-0525/051925-meeting2.md)
- [Meeting 3 - May 26th, 2025](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0526-0601/052625-meeting3.md)
- [Meeting 4 - June 3rd, 2025](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0602-0608/060225-meeting4.md)

### Sprint Review Meetings
- [Sprint 1 Review](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0512-0518/051225meeting.md)
- [Sprint 2 Review](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0519-0525/052525-sprint2-review.md)
- [Sprint 3 Review](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0526-0601/060125-sprint3-review.md)
- [Sprint 4 Review](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0602-0608/060825-sprint4-review.md)

### Retrospectives
- [Sprint 1 Retrospective](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0512-0518/051825-retrospective.md)
- [Sprint 2 Retrospective](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0519-0525/052525-retrospective.md)
- [Sprint 3 Retrospective](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0526-0601/060125-retrospective.md)
- [Sprint 4 Retrospective](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/meetings/0602-0608/060825-retrospective.md)

### ADRs
[ADRs Folder](https://github.com/cse110-sp25-group30/cse110-sp25-group30/tree/main/specs/adrs)
- [ADR1 - Problem Solving and Meeting Decision](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/specs/adrs/051125-MVPandMeetingsDecisions.md)
- [ADR2 - Card Grid, Collector Features and Hosting](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/specs/adrs/052225-CardGridandCollectorFeatures.md)
- [ADR3 - Removal of Card-Deck and Implementing Consistent Presentation](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/specs/adrs/052825-CardDeckRemoval.md)
- [ADR4 - Flash Card Removal and Tutorial](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/specs/adrs/060625-FlashCardsRemovalandToolTip.md)

### CD/CI Pipeline
[Link to CD Pipeline Folder](https://github.com/cse110-sp25-group30/cse110-sp25-group30/tree/main/admin/cipipeline)
1. Phase 1:
- [Template Image](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/cipipeline/phase1.png)
- [Markdown file](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/cipipeline/phase1.md)
- [Phase 1 Video](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/cipipeline/phase1.mp4)

2. Phase 2:
- [Template Image](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/cipipeline/phase2/phase2.png)
- [Markdown file](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/cipipeline/phase2/phase2.md)
- [Phase 2 Video](https://github.com/cse110-sp25-group30/cse110-sp25-group30/blob/main/admin/cipipeline/phase2/phase2.mp4)
