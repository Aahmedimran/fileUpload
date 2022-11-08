import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
const Product = () => {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // console.log(data)
  const [users, setUsers] = useState([])

  const [togleLoading, setTogleLoading] = useState(false)

    useEffect( () => {

      let getAllUsers = async () => {

    let response = await axios.get("http://localhost:3001/users")
    setUsers(response.data.data.reverse())
  }
  getAllUsers();
  }, [togleLoading])


  const doSignup = async (e) => {
    e.preventDefault();


    var profilePictureInput = document.getElementById("profilePictureInput");

    console.log("fileupload : ", profilePictureInput.files[0])


    // var url = URL.createObjectURL(profilePictureInput.files[0])
    // console.log("url",url)
    // document.getElementById("img").innerHTML = `<img src="${url}" alt="" id="img" >`


    let fromData = new FormData();
    fromData.append("firstName", firstName) // this is how you add some text data along with file
    fromData.append("email", email) // this is how you add some text data along with file
    fromData.append("password", password) // this is how you add some text data along with file
    fromData.append("profilePicture", profilePictureInput.files[0]); //file input is for browser on



    // stringfy data send example
    // fromData.append("myDetail",
    // JSON.stringify({
    //     "subject" : "science",
    //     "year" : "2021"
    // }));
    // console.log("response", response.data)

    axios({

      method: 'post',
      url: "http://localhost:3001/signup",
      data: fromData,
      headers: { 'Content-Type': 'multipart/from-data' },
      withCredentials: true

    })
      .then(res => {
        console.log(`upload success` + res.data);
        setTogleLoading(!togleLoading)
      })
      .catch(err => {
        console.log(err)
      })



  }


  return (
    <>
      <form onSubmit={doSignup}  >
        name<input name='name' type="text" placeholder='' required onChange={(e) => {
          setFirstName(e.target.value);

        }} ></input>
        <br />
        email<input name='email' type="text" placeholder='' required id='email'
          onChange={(e) => {
            setEmail(e.target.value);

          }}></input>
        <br />
        password<input name='password' type="password" placeholder='' required
          onChange={(e) => {
            setPassword(e.target.value);

          }}></input>
        <br />
        file<input name='' type="file" placeholder='' id='profilePictureInput' required accept='image/*'

          onChange={
            () => {
              var profilePictureInput = document.getElementById("profilePictureInput");
              var url = URL.createObjectURL(profilePictureInput.files[0])
              console.log("url", url)
              document.getElementById("img").innerHTML = `<img width ="200px" src="${url}"  id="img" >`
            }
          }


        ></input>
        <br />
        <br />
        <div id='img' ></div>
        <br />
        <button type='submit'>submit</button>

      </form>

      <h1>Users</h1>

<div>
{users.map(eachUsers =>(

<div key ={eachUsers.id}>

<div>{eachUsers.firstName}</div>
<div>{eachUsers.email}</div>

<img width={200}  src={eachUsers.profilePicture} alt='' />

</div>

))
} 


</div>






    </>
  )
}

export default Product