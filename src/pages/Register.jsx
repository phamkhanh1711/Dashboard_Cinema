import React, { useState } from 'react';
import CheckError from "./CheckError";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
function Register() {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
		
	  });
	  const navigate = useNavigate();
	  const [errors, setErrors] = useState([]);

	  
  function handleInput(e) {
    const nameInput = e.target.name;
    const value = e.target.value;
    setInputs((state) => ({ ...state, [nameInput]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    let errorsSubmit = {};
    let flag = true;

    if (inputs.email === "") {
      errorsSubmit.email = "Vui long nhap lai Email";
      flag = false;
    } else if (!IsEmail(inputs.email)) {
      errorsSubmit.email = "Chua dung dinh dang Email";
      flag = false;
    }
    if (inputs.password === "") {
      errorsSubmit.password = "Vui long nhap password";
      flag = false;
    }
 

    if (!flag) {
      setErrors(errorsSubmit);
    
    } else {
      setErrors({});
      const data = {
        email: inputs.email,
        password: inputs.password,
        // role_id: inputs.role_id,
      };
      axios
        .post("http://localhost:4000/auth/login", data)
        .then((res) => {
          console.log(res);

          if(res.data.data.role === 1){
            Swal.fire({
              title: "Success!",
              text: res.data.message,
              icon: "success",
            }); 
            navigate('/');
          }
         else if(res.data.data.role === 2){
            Swal.fire({
              title: "Success!",
              text: res.data.message,
              icon: "success",
            }); 
            navigate('/booking');
          }
          else{
            alert("Bạn không có quyền truy cập vào trang này");
          }
        
      
          const token = res.data.data.accessToken;
          console.log(token);
          Cookies.set('token', token);

          
          const auth = res.data.data.auth;
          console.log(auth);
          Cookies.set('auth', JSON.stringify(auth));
          

        
          
         
          // Sau khi đăng nhập thành công, điều hướng đến trang tương ứng
          
        })
        .catch((response) => { 
          console.log(response);
          Swal.fire({
            title: "Error!",
            text: response.response.data.message  ,
            icon: "error",
      })
        
        });
    }
  }
  function IsEmail(email) {
    let regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zAZ0-9]{2,4})+$/;
    if (!regex.test(email)) {
      return false;
    } else {
      return true;
    }
  }
  return (
	<div className="container">
	<div className="screen">
	  <div className="screen__content">
		<form className="login"  onSubmit={handleSubmit}>
		  <div className="login__field">
			<i className="login__icon fas fa-user" />
			<input type="email"placeholder="Email Address" name="email"onChange={handleInput} />
			{errors.email && <span className='text-danger' >  {errors.email}</span>}

		  </div>
		  <div className="login__field">
			<i className="login__icon fas fa-lock" />
			<input type="password"placeholder="Password"name="password"onChange={handleInput} />
			{errors.password && <span className='text-danger' >  {errors.password}</span>}

		  </div>
		  <button className="button login__submit">
			<span className="button__text">Log In Now</span>
			<i className="button__icon fas fa-chevron-right" />
		  </button>				
		</form>
		<CheckError errors={errors} />
		<div className="social-login">
		  <h3>log in via</h3>
		  <div className="social-icons">
			<a href="#" className="social-login__icon fab fa-instagram" />
			<a href="#" className="social-login__icon fab fa-facebook" />
			<a href="#" className="social-login__icon fab fa-twitter" />
		  </div>
		</div>
	  </div>
	  <div className="screen__background">
		<span className="screen__background__shape screen__background__shape4" />
		<span className="screen__background__shape screen__background__shape3" />		
		<span className="screen__background__shape screen__background__shape2" />
		<span className="screen__background__shape screen__background__shape1" />
	  </div>		
	</div>
  </div>
  );
}

export default Register;
