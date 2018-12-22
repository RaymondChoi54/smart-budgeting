import React from 'react'
import Cookies from 'js-cookie'
import Config from '../config'

import LayoutBar from '../components/LayoutBar'

import Router from 'next/router'

const names = [
	{ id: 'dashboard', name: 'Dashboard', on: false},
	{ id: 'profile-settings', name: 'Profile & Settings', on: true},
	{ id: 'current-month', name: 'Current Month', on: false},
	{ id: 'history', name: 'History', on: false},
	{ id: 'logout', name: 'Logout', on: false}
];

export default class extends React.Component {
	constructor(props) {
    	super(props)
    	this.handleSubmit = this.handleSubmit.bind(this)
    	this.state = {
	        fullname: Cookies.get('fullname'),
	        username: Cookies.get('username'),
	        token: Cookies.get('token'),
	        loaded: false
	    };
  	}

  	handleSubmit(e) {
	    e.preventDefault();

	    var updater = {}
    	if(this.refs.fullname.value) {
    		Cookies.set('fullname', this.refs.fullname.value, { expires: 1 });
    		updater.fullname = this.refs.fullname.value
    	}
    	if(this.refs.password.value) {
    		updater.password = this.refs.password.value
    	}

    	if(this.state.loaded) {
	    	fetch(Config.api + '/users/' + this.state.username, {
				method: 'put',
				mode: 'cors',
				headers: {'Content-Type':'application/json', 'x-access-token': this.state.token},
				body: JSON.stringify(updater)
			})
			.then((res) => res.json())
			.then((data) => this.setState(updater))
			.catch(function(err) {
				Router.push('/login');
			})
		}
	}

  	componentDidMount() {
  		if(!this.state.fullname || !this.state.username || !this.state.token) {
  			Router.push('/login');
  			return;
  		}
  		this.setState({
  			loaded: true
  		})
  	}

	render() {
	    return (
	    	<LayoutBar config={names} name={this.state.fullname} barName="Profile & Settings">
				<form onSubmit={this.handleSubmit}>
	          		<h1>Profile</h1>
		            <input type="text" ref="fullname" placeholder="Full Name"/><br/>
		            <input type="password" ref="password" placeholder="Password"/><br/>
		            <input type="submit" value="Submit"/>
		        </form>
				<style jsx>{`
				`}</style>
			</LayoutBar>
		)
	}
}