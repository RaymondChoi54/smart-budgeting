import React from 'react'
import Cookies from 'js-cookie'
import Config from '../config'

import Router from 'next/router'

export default class extends React.Component {
	constructor(props) {
    	super(props)
    	this.handleSubmit = this.handleSubmit.bind(this)
  	}

	handleSubmit(e) {
	    e.preventDefault();

	    fetch(Config.api + '/session', {
			method: 'post',
			mode: 'cors',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
		    	username: this.refs.username.value,
		    	password: this.refs.password.value
			})
		})
		.then((res) => res.json())
		.then(function(data, err) {
			if(err) {
				alert("Please try again");
			} else {
				if(!data.auth) {
					alert("Incorrect login info");
				} else {
					Cookies.set('token', data.data.token, { expires: 1 });
					Cookies.set('username', data.data.username, { expires: 1 });
					Cookies.set('fullname', data.data.fullname, { expires: 1 });
					Router.push('/dashboard');
				}
			}
		})
	 }

	render() {
	    return (
			<div>
				<div>
		          	<form onSubmit={this.handleSubmit} >
		          		<h1>Login</h1>
			            <input type="text" ref="username" placeholder="Username"/>
			            <input type="password" ref="password" placeholder="Password"/>
			            <input type="submit" value="Submit"/>
		          	</form>
		          	<a>No account? Create an account now</a>
		      	</div>
				<style jsx>{`
		      		div { 
		        		background: white;
		        		position: fixed;
		        		top: 50%;
		    			left: 50%;
		    			margin-left: -205px;
		    			margin-top: -200px;
		    			width: 400px;
		    			max-height: 400px;
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