# part3_phonebook

Functional Heroku production build (frontend + backend) at address: https://tranquil-everglades-28442.herokuapp.com/

This is a React app representing a phonebook that includes a production build of the frontend, integrated with an Express backend. 

Users can add new contacts to their phonebook, and are presented with a colourful message indicating success. 

![Successfully added user message](https://github.com/anirudhkannan9/fso_redo/blob/main/submissions/part2/phonebook/screenshots/added_user.png)

Users can search (case-indifferent) for contacts in their phonebook, and the app will re-render to display only contacts with names that match the search string. 

![Searching for contact, multiple matches](https://github.com/anirudhkannan9/fso_redo/blob/main/submissions/part2/phonebook/screenshots/search_many_matches.png)

![Searching for contact, one match](https://github.com/anirudhkannan9/fso_redo/blob/main/submissions/part2/phonebook/screenshots/search_one_match.png)

Users can also update the number of a contact that already exists (they're asked if they're sure first), and are presented with a colourful message indicating success once the operation is completed. 

![Confirm update number](https://github.com/anirudhkannan9/fso_redo/blob/main/submissions/part2/phonebook/screenshots/update_part_1.png)

![Number updated successfully](https://github.com/anirudhkannan9/fso_redo/blob/main/submissions/part2/phonebook/screenshots/update_part_2.png)

Lastly, edge cases where the user opens the app and interacts with it in separate windows are handled. If a user deletes a contact in one window, and then attempts to change the number of the recently-deleted contact in another window, they are presented with a styled error message indicating that the contact has already been removed from their phonebook.

![Update error](https://github.com/anirudhkannan9/fso_redo/blob/main/submissions/part2/phonebook/screenshots/update_error.pngt)

