const Overlay: React.FC<{
  onClick: () => void
}> = ({ onClick }) => {
  return (
    <div
      className="overlay fixed left-0 top-0 w-screen h-screen bg-[#9191917f] z-20"
      onClick={onClick}
    ></div>
  )
}

export default Overlay
