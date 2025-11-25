# Lilly Technical Challenge Documentation Template

*This documentation template serves as a place for you to discuss how you approached this challenge, any issues you faced & how you overcame them, or any other points that you feel would be relevant for the interviewers to know. The text in italics is here to guide you - feel free to remove it once you fill out each section!*

***Not every section in this document is required. This is just a template to help get you started. Feel free to add or remove sections as you feel necessary.***

## Approach
*How did you approach this challenge? Did you work through the objectives in any particular order? If so, why? Did you utilize any external resources, such as tutorials, guides, or other materials?*

I began by building a clean and functional HTML structure, followed by JavaScript that handled API communication using fetch(). Once the basic functionality was working, I focused on defensive coding techniques to handle cases like missing fields, invalid prices, or an offline backend.
I used external documentation mainly for verifying correct usage of Fetch API features and HTML accessibility attributes, but the majority of the implementation was built manually without relying on tutorials. I aimed to create clear, maintainable code with comments explaining each step.
I tested each step immediately after implementation to ensure stability before moving on.

## Objectives - Innovative Solutions
*For the challenge objectives, did you do anything in a particular way that you want to discuss? Is there anything you're particularly proud of that you want to highlight? Did you attempt some objectives multiple times, or go back and re-write particular sections of code? If so, why? Use this space to document any key points you'd like to tell us about.*

Safe & Defensive Rendering:
Implemented strict validation and fallback values for each medicine field to prevent UI breaks or unsafe rendering.
“Unknown name” for missing names
“Price unavailable” for missing price
“Invalid price” for malformed values
Each of these is visually highlighted to guide the user and help identify data issues immediately.

Cell-Level Error Highlighting:
Instead of highlighting entire table rows, I applied conditional styling only to specific problematic cells (e.g., unknown names or invalid prices). This keeps the table clean while still bringing attention to errors.

Accessible & Clean UI Structure:
The table layout, spacing, headings, and refresh button were designed to be clear and easy to read. Unnecessary whitespaces were removed for a tighter and neater layout.

Interactive Number Input for Price:
For the Add Medicine form, I used the HTML type="number" input for the Price field.
This automatically gives the user arrow buttons to increase or decrease the price
Prevents non-numeric input
Reduces user typing, decreases errors, and makes the form more user-friendly

Automatic Table Refresh After Adding a Medicine:
Once a medicine is added, the page automatically reloads and displays the updated list without requiring the user to refresh manually.

Frontend Clean-Up Based on Actual API:
Initially added a notes/description of medicine but later removed the field entirely after confirming the backend doesn’t use it, keeping the UI consistent with the actual data model.

## Problems Faced
*Use this space to document and discuss any issues you faced while undertaking this challenge and how you solved them. We recommend doing this proactively as you experience and resolve the issues - make sure you don't forget! (Screenshots are helpful, though not required)*.

“Permission Denied” Issue When Using Baked Mode:
When running the project in baked mode, the terminal repeatedly displayed a “permission denied” error. This stopped the build from running properly.
The baked build directory did not have the correct execution permissions, so the system blocked the process from running.

How I fixed it:
Permissions were adjusted using the correct system commands, allowing the build to execute normally without blocking development.

Spacing & Styling Issues in the UI (Major Styling Obstacle):
There was a large unwanted space between the “Available Medicines” heading and the table below it, which made the UI look misaligned.
The table had an unnecessarily large margin applied specifically margin-bottom, which pushed the layout downward.

How I fixed it:
The spacing was manually adjusted by reducing the margin value to margin-bottom: -2, which removed the gap and fixed the visual alignment.

Logical Errors in Highlighting Text (Unknown Name & Unavailable Price):
When trying to highlight unknown medicine names or missing prices in red, the entire table cell sometimes turned red instead of the specific text.
The highlighting logic targeted the parent <td> instead of just the text span, causing the full cell to inherit the color.

How I fixed it:
Inline styling was applied only to the specific text (<span>) with conditions checking for:
"unknown" names
"price unavailable" values
This allowed only the correct words to turn red without breaking the table styling.

Notes Field Not Compatible With API Structure:
The UI initially had a Notes field for adding medicine, and the table also displayed a Notes column.
The API only accepted name and price, so adding Notes caused mismatches and unnecessary complexity.

How I fixed it:
The Notes field and corresponding table column were removed completely, ensuring the frontend matches the API’s actual schema.


## Evaluation
*How did you feel about the challenge overall? Did some parts go better than others? Did you run out of time? If you were to do this again, and were given more time, what would you do differently?*