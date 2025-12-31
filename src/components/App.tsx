import { NavLink} from 'react-router';
function App() {
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/chess-game">Chess Game</NavLink>
        </div>
      </div>
    </>
  )
}

export default App
