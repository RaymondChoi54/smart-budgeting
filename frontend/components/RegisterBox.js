import React from 'react'
import Cookies from 'js-cookie'
import Config from '../config'

import Router from 'next/router'
import Link from 'next/link'

export default class extends React.Component {
	constructor(props) {
    	super(props)
    	this.handleSubmit = this.handleSubmit.bind(this)
  	}

	handleSubmit(e) {
	    e.preventDefault();

	    var un = this.refs.username.value
	    var fn = this.refs.fullname.value

	    fetch(Config.api + '/users', {
			method: 'post',
			mode: 'cors',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
		    	username: un,
		    	password: this.refs.password.value,
		    	fullname: fn,
		    	email: this.refs.email.value
			})
		})
		.then((res) => res.json())
		.then(function(data, err) {
			if(err) {
				alert("Please try again");
			} else {
				Cookies.set('token', data.token, { expires: 1 });
				Cookies.set('username', un, { expires: 1 });
				Cookies.set('fullname', fn, { expires: 1 });
				Router.push('/dashboard');
			}
		})
	 }

	render() {
	    return (
			<div>
	          	<form onSubmit={this.handleSubmit} >
	          		<h1>Register</h1>
	          		<input type="text" ref="email" placeholder="Email"/>
	          		<input type="text" ref="fullname" placeholder="Fullname"/>
		            <input type="text" ref="username" placeholder="Username"/>
		            <input type="password" ref="password" placeholder="Password"/>
		            <input type="submit" value="Submit"/>
	          	</form>
	          	<Link href="/login">Already have an account? Login now</Link>
				<style jsx>{`
		      		div { 
		        		background: white;
		        		position: fixed;
		        		top: 50%;
		    			left: 50%;
		    			margin-left: -205px;
		    			margin-top: -215px;
		    			width: 400px;
		    			height: 430px;
		    			text-align: right;
		    			padding: 5px;
		      		}

		      		h1 {
		      			font-size: 30px;
		      		}

		      		form {
		      			margin: 20px;
		      			text-align: center;
		      		}

		      		input {
		      			text-align: center;
		      			margin: 15px;
		      			font-size: 24px;
		      			border-radius: 8px;
		      		}

		      		a {
		      			margin: 5px;
		      			font-size: 12px;
		      		}
				`}</style>
			</div>
	    )
  	}
}