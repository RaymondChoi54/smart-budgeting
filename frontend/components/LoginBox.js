import React from 'react'

export default class extends React.Component {
	constructor(props) {
    	super(props)
    	this.handleSubmit = this.handleSubmit.bind(this)
  	}

  	componentDidMount() {
	    // if (auth.loggedIn()) {
	    //   	this.props.url.replaceTo('/admin')
	    // }
	 }

	handleSubmit(e) {
	    e.preventDefault();
	    console.log(this.refs.email.value + this.refs.password.value);
	 }

	render() {
	    return (
			<div>
				<div>
		        	Login
		          	<form onSubmit={this.handleSubmit} >
			            <input type="text" ref="email"/>
			            <input type="password" ref="password"/>
			            <input type="submit" value="Submit"/>
		          	</form>
		      	</div>
				<style jsx>{`
		      		div { 
		        		background: white;
		        		height: 400px;
		        		width: 400px;
		        		position: fixed;
		        		top: 50%;
		    			left: 50%;
		    			margin-left: -200px;
		    			margin-top: -200px;
		      		}
				`}</style>
			</div>
	    )
  	}
}