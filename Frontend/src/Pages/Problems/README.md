# Problems Page Structure

This folder contains all the components and styles related to the Problems page.

## File Structure

```
Problems/
├── Problem.jsx                  # Main Problems page component
├── Problems.module.css          # Styles for the Problems page
├── Components/
│   ├── StaticBackground.jsx     # Static background component (no animations)
│   └── StaticBackground.css     # Styles for the static background
└── README.md                    # This documentation file
```

## Components

### `Problem.jsx`
- Main Problems page component
- Handles modal states for login/register
- Imports and uses StaticBackground component
- Uses CSS modules for styling

### `Components/StaticBackground.jsx`
- Static background component without moving particles
- Contains gradient orbs, grid overlay, accent lines, and geometric shapes
- All elements are statically positioned (no animations)
- Uses black and white color scheme

## Styling

### `Problems.module.css`
- Contains all styles specific to the Problems page
- Uses CSS modules for scoped styling
- Includes responsive design for mobile devices
- Features glass morphism effects in black and white theme

### `Components/StaticBackground.css`
- Styles for the static background elements
- White gradient orbs with different sizes and positions
- Grid overlay with subtle white glow effects
- Geometric shapes with static positioning
- Black and white color scheme throughout

## Usage

The Problems page can be imported in the main App.jsx like this:

```jsx
import Problems from './Pages/Problems/Problem';
```

This will import the `Problem.jsx` file from the Problems folder.
