import React from 'react'
import './Register.css'

const Register = () => {
  return (
    <div class="wrapper">
        <form action="">
            <h1>Sign Up</h1>
            <div class="input-box">
                <input type="text" placeholder="Name" required />
                <i class='bx bxs-user'></i>
            </div>
            <div class="input-box">
                <input type="text" placeholder="Email" required />
                <i class='bx bxs-envelope'></i>
            </div>
            <div class="input-box">
                <input type="password" placeholder="Password" required />
                <i class='bx bx-lock-alt'></i>
            </div>
            <div class="input-box">
                <input type="password" placeholder="Confirm Password" required />
                <i class='bx bxs-lock-alt'></i>
            </div>
            

            <button type="submit" class="btn">Sign Up</button>

        </form>
    </div>
  )
}

export default Register
