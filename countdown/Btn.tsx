
const Btn = ({text,cb}) => {
  return (
    <>
      <button className=' w-12 h-12' onClick={cb}>{text}</button>
    </>
  )
}

export default Btn
