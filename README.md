# Habit Tracker Web App

A simple and interactive habit tracker web application that allows users to manage their daily habits, track progress for each day of the week, reorder habits using drag-and-drop functionality, and edit habit titles inline. Completed habits are displayed separately for better organization.

---

## Features

- **Add Habits**: Create new habits to track.
- **Edit Habit Titles**: Click on a habit title to edit it inline and save changes.
- **Track Weekly Progress**: Toggle the completion status for each day of the week.
- **Drag-and-Drop**: Reorder habits using drag-and-drop functionality.
- **Mark as Completed**: Mark habits as completed and move them to a separate "Completed Habits" section.
- **Delete Habits**: Remove habits from the list.
- **Confetti Celebration**: Celebrate when a habit is fully completed for the week.

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

---

## Usage

### Adding a Habit
1. Enter the name of the habit in the input field.
2. Press `Enter` to add the habit to the list.

### Editing a Habit Title
1. Click on the habit title to make it editable.
2. Modify the title and press `Enter` to save or `Escape` to cancel.

### Tracking Weekly Progress
1. Click on the day boxes (e.g., M, T, W) to toggle the completion status for that day.
2. A green background indicates the day is completed.

### Reordering Habits
1. Drag a habit by its header to reorder it in the list.

### Marking Habits as Completed
1. Click the checkmark icon next to a habit to mark it as completed.
2. Completed habits will move to the "Completed Habits" section.

### Deleting Habits
1. Click the "Delete" button to remove a habit from the list.

---

## Folder Structure

habit-tracker-web/
├── public/                 # Public assets
├── src/
│   ├── App.js              # Main React component
│   ├── App.css             # Styling for the app
│   ├── index.js            # Entry point for the app
│   └── components/         # (Optional) Additional components
├── package.json            # Project dependencies and scripts
└── README.md               # Documentation

## Customization

   Styling
      * Modify the App.css file to customize the appearance of the app.

   Confetti Celebration
      * The confetti effect is triggered when a habit is fully completed for the week. You can adjust the particle count, spread, and origin in the toggleDay function.

## Dependencies

  * react: ^18.0.0
  * @hello-pangea/dnd: ^18.0.1
  * ionicons: ^5.5.2
  * canvas-confetti: ^1.4.0

## Future Enhancement
* Show progression of goal over time in accordion
* Add notification

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

## Acknowledgments

- [React](https://reactjs.org/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- [Ionicons](https://ionic.io/ionicons)
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)