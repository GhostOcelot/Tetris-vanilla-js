# Tetris in vanilla javascript

I challenged myself to code a fully functionable version of the classic tetris game in pure javascript without the help of any external libraries and tutorials. I did all the work as planned with one exception. The only feature that caused me to look into a tutorial was the rotation part. In this case I took some ideas from Turbo Makes Games youtube video [How to Properly Rotate Tetris Pieces - Game Development Tutorial](https://www.youtube.com/watch?v=yIpk5TJ_uaI&t=1024s).

Live version available [here](https://third-clock.surge.sh/).

**_NOTE THAT IT'S A DESKTOP ONLY VERSION. I DIDN'T CREATE TOUCH CONTROLS AND RESPONSIVE LAYOUT._**

## Contains all tetris mechanics such as:

- grid system
- interval based game
- generating random blocks
- moving blocks in 3 direction with user inputs
- rotating blocks
- collisions detection
- full rows clearing and collapsing
- points earned for clearing rows
- bonus for clearing multiple rows
- game speed increases with player progress
- pause/resume game
- hi score save

# Controls:

- new game/pause/resume - space
- move block - left/right/down
- rotate block - up
