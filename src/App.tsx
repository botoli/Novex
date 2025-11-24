
import './App.css'

function App() {
const zapros=async ()=>{
  const response=await  fetch("http://127.0.0.1:8000/user")
  const res=await  response.json()
  console.log(res)

}
zapros()

  return (
    <>

    </>
  )
}

export default App
