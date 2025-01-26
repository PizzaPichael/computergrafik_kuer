# "Stellar symphony"
## A Computergrafik Kürteil project

Wintersemester 2024/25
Lecturer: Prof. Dr. Thomas Jung

This project is under authorship of Michael Kaup, s0589545



##Disclaimer1:
I couldn't upload the textures and objects, as they were increasing the size of the project so much, that it went above the 100MB maximum.
I only noticed this at the end, so I decided to remove them from the moodle upload.

If the missing files are needed, please refer to the following github repo: https://github.com/PizzaPichael/computergrafik_kuer.git
In the main branch, download the "textures" and "objects" folders and copy them into the ch5_ex4 folder.

The important files for the project are inside the ch5_ex4 folder.
All the JavaScript files are inside the "js" folder.
Other folder and files are:
- CopilotScreenshots
- modules, threejs modules folder
- music, hold the music stems for the instruments
- objects, holds all the needed objects
- textures, holds all the textures for the objects
- index, starts the project when opened with LiveServer

I only tried to rename the ch5_ex4 folder at the end of the project and got an error that I was to afraid to fix, 
as I didn't want it to cause more problems and make the projectnot work anymore.
The FromThreeBook folder and files are the ones used in the last exercise.



##Scene description:
The scene represents a theaterroom in which the spectator sits, looking at closed theatre curtains.
Inside the room, a curtain rope hangs from the ceiling with which the spectator can interact by pulling it down.
If the spectator pulls the rope far enough, the curtains start opening and a spotlight is activated.
The curtain reveals a white canvas on which a spinning portal becomes visible.

The camera starts to move towards the portal and eventually passes through it.
Suddenly, the spectator fidn itself in space, looking at a floating stage with three instruments on it.
A text displays how to navigate around, how to use the GUI Buttons in the upper right corner, and how to interact with the instruments.

Via the Buttons, music can be started, suspended or stopped.
After the tutorial has been showen once, buttons are added to the gui to bring back the tutorial for certain parts of the scene, if needed.



##Disclaimer2:
The process of writing the code involved the usage of the CopilotExtension in VS-Code.
It was used to debug errors and change minor problems in the code but also suggest solutions for ideas that needed to be implemented.
F.e. the approach of dragging the curtain rope, using the three events mousedown, mousemove and mouseup.
For reference, see the screenshots of the CopilotConversation in the under the path .\CopilotScreenshots\CordDraggingExample.

By nature, the copilot output is very extensive and involves a lot of code suggestions.
In my experience it is not possible yet to let copilot write code that fits into the context of the codebase.
Thats why, in the end, if suggestions copilot made were fitting to what was needed to achieve, only the general idea was used, not the whole code it created.
The code then was adjusted to fit into the context and work with the rest of the code.
So copilot served more as a replacement of StackOverflow or other Websites that provide ideas and codesnippets.
That is also the reason, why none of these websites are credited here, because they have not really been used for this project.

The only occasions where websites like these were used, were bugfixes for errors, that copilot could not help dealing with. 
Non of these involved copying codesnippets from the web though, but rather changing general concepts within the code structure.

Further general suggested concepts by copilot:
- HTMLOverlayText for the tutorial, see .\CopilotScreenshots\HTMLTextOverlay
- Detection of instruments on stage, see .\CopilotScreenshots\InstrumentOnStageDetectionExample
- Object removal from stage, see .\CopilotScreenshots\ObjectRemovalExample
- Using promises for async object laoding, see .\CopilotScreenshots\PromiseExample

I have also added an example for reassurence work i did with copilot, where I f.e. ask it about coding concepts, see .\CopilotScreenshots\ReassuranceExample

Unfortunately, I couldn't recall all the CopilotChats I had.
Further instances where copilot suggestions were used are:
- adding the three instruments as combined meshes to the scene as to make sure, that no matter where the isntrument is clicked on, it is selected
- setup and use a raycaster
- setting up an audioloader and audiolistener

##Model Sources:
Piano: https://www.cgtrader.com/free-3d-models/furniture/other/realistic-custom-grand-piano last accessed 24.01.2025
Cello: https://free3d.com/3d-model/cello-v01--419340.html last accessed 24.01.2025
Violine: https://sketchfab.com/3d-models/violin-midpoly-c618da74c8604192bfdcd63c91d39822 last accessed 26.01.2025
Wooden planks: https://sketchfab.com/3d-models/old-colored-wooden-plank-low-poly-1e7e5747728d4280a75401e3a5b59d80 last accessed 24.01.2025
Curtains: https://sketchfab.com/3d-models/curtain-6f0e27c3b4734b99ae6ed051899a1453 last accessed 24.01.2025
Chairs: https://www.turbosquid.com/3d-models/armchaircinema-3d-model-2216982 last accessed 26.01.2025
Rope: extracted from this model https://www.turbosquid.com/3d-models/swedish-wall-1566618 using blender, last accessed 26.01.2025
Stage and Stagerim: Made by me in onshape
Music: DomesticResearchPartners_OldEmptyNest from https://www.cambridge-mt.com/ms/mtk/, last accessed 26.01.2025

##Texture sources:
- instruments, the textures for the instruments came with the models
- woodenplank, the texture for the woodenplank came with the model
- curtain and theaterchairs: https://polyhaven.com/a/leather_red_03 last accessed 26.01.2025
- theaterroom brick texture: https://polyhaven.com/a/red_brick last accessed 26.01.2025
- Portal: https://e7.pngegg.com/pngimages/601/839/png-clipart-blue-and-purple-vortex-illustration-portal-magic-animation-portal-purple-blue-thumbnail.png last accessed 26.01.2025
- Milky way background/starmap_16k: https://svs.gsfc.nasa.gov/4851/ last accessed 26.01.2025
- Stage texture wood_cabinet: https://polyhaven.com/a/wood_cabinet_worn_long last accessed 26.01.2025
- Curtain rop teexture(not really the texture is used here, jsut the colour): https://polyhaven.com/a/wood_floor last accesed 26.01.2025


Todo:
- add spotlights for each of the instruments when they are on stage
- Ambient noise that fades out when the cord is pulled


Fix:
- somehow the stage does not receive any shadow

